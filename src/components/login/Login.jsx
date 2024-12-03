import { useState } from "react";
import toast from "react-hot-toast";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import upload from "../../lib/upload";

export default function Login() {
	const [isLogin, setIsLogin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});

	const handleAvatar = (e) => {
		if (e.target.files[0]) {
			setAvatar({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.target);
		const { email, password } = Object.fromEntries(formData);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			toast.success("Successfully logged in 🥳");
		} catch (err) {
			console.log(err.message);
			toast.error("Something went wrong" + err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target);
		const { username, password, email } = Object.fromEntries(formData);

		// VALIDATE INPUTS
		if (!username || !email || !password)
			return toast.warn("Please enter inputs!");
		if (!avatar.file) return toast.warn("Please upload an avatar!");

		// VALIDATE UNIQUE USERNAME
		const usersRef = collection(db, "users");
		const q = query(usersRef, where("username", "==", username));
		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			return toast.warn("Select another username");
		}

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);

			const imgUrl = await upload(avatar.file);

			await setDoc(doc(db, "users", res.user.uid), {
				username,
				email,
				avatar: imgUrl,
				id: res.user.uid,
				blocked: [],
			});

			await setDoc(doc(db, "userchats", res.user.uid), {
				chats: [],
			});

			toast.success("Account created successfully 🥳");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-[100%] h-[100%] flex items-center justify-center md:gap-[100px]">
			{/* Login */}
			<div
				className={`flex-1 flex flex-col items-center gap-[20px] 
					${isLogin ? "hidden" : "flex"}`}
			>
				<h2 className="text-[30px] tracking-wide font-semibold">
					Welcome back,
				</h2>
				<form
					onSubmit={handleLogin}
					className="w-[92%] md:w-[300px] flex flex-col items-center justify-center gap-[22px] md:gap-[20px]"
				>
					<input
						type="email"
						name="email"
						autoComplete="off"
						placeholder="Email"
						className="loginInputs"
					/>
					<input
						type="password"
						name="password"
						autoComplete="off"
						placeholder="Password"
						className="loginInputs"
					/>
					<button
						disabled={loading}
						className="py-3 md:py-2 px-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed transition-all font-medium rounded-md cursor-pointer"
					>
						{loading ? "Loading..." : "Sign In"}
					</button>
				</form>
				<p className="md:hidden" onClick={() => setIsLogin((prev) => !prev)}>
					If you dont have an account ! register
				</p>
			</div>

			<div className="w-[1px] h-[80%] bg-[#545454]"></div>

			{/* Register */}
			<div
				className={`flex-1 flex flex-col items-center gap-[20px]
					 ${isLogin ? "flex" : "hidden md:flex"}`}
			>
				<h2 className="text-[30px] tracking-wide font-semibold">
					Create an Account
				</h2>
				<form
					onSubmit={handleRegister}
					className="w-[92%] md:w-[300px] flex flex-col items-center justify-center gap-[22px] md:gap-[20px]"
				>
					<label
						htmlFor="file"
						className="w-full flex items-center gap-x-3 cursor-pointer underline"
					>
						<img
							alt="upload img"
							src={avatar.url || "./avatar.png"}
							className="w-[50px] h-[50px] object-cover rounded-md"
						/>
						Upload an image
					</label>
					<input
						type="file"
						id="file"
						accept="image/*"
						className="hidden"
						onChange={handleAvatar}
					/>
					<input
						type="text"
						name="username"
						autoComplete="off"
						placeholder="Username"
						className="loginInputs"
					/>
					<input
						type="email"
						name="email"
						autoComplete="off"
						placeholder="Email"
						className="loginInputs"
					/>
					<input
						type="password"
						name="password"
						autoComplete="off"
						placeholder="Password"
						className="loginInputs"
					/>
					<button
						disabled={loading}
						className="py-3 md:py-2 px-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed transition-all font-medium rounded-md cursor-pointer"
					>
						{loading ? "Loading..." : "Sign Up"}
					</button>
				</form>
				<p className="md:hidden" onClick={() => setIsLogin((prev) => !prev)}>
					If you have an account ! login
				</p>
			</div>
		</div>
	);
}
