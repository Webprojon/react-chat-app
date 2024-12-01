import { db } from "../../../../lib/firebase";
import {
	arrayUnion,
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { useChatStore } from "../../../../lib/chatStore";

const AddUser = () => {
	const [user, setUser] = useState(null);
	const { currentUser } = useUserStore();
	const { setToggleMode } = useChatStore();

	const handleSearch = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const username = formData.get("username");

		try {
			const userRef = collection(db, "users");

			const q = query(userRef, where("username", "==", username));

			const querySnapShot = await getDocs(q);

			if (!querySnapShot.empty) {
				setUser(querySnapShot.docs[0].data());
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleAdd = async () => {
		const chatRef = collection(db, "chats");
		const userChatsRef = collection(db, "userchats");

		try {
			const newChatRef = doc(chatRef);

			await setDoc(newChatRef, {
				createdAt: serverTimestamp(),
				messages: [],
			});

			await updateDoc(doc(userChatsRef, user.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: currentUser.id,
					updatedAt: Date.now(),
				}),
			});

			await updateDoc(doc(userChatsRef, currentUser.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: user.id,
					updatedAt: Date.now(),
				}),
			});
		} catch (err) {
			console.log(err);
		} finally {
			setToggleMode();
		}
	};

	return (
		<div className="max-w-max max-h-max absolute top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-80 p-12 rounded-md tracking-wide">
			<form onSubmit={handleSearch} className="flex gap-[20px]">
				<input
					type="text"
					name="username"
					autoComplete="off"
					placeholder="Username"
					className="outline-none p-[10px] rounded-md text-black placeholder:text-black bg-[#ccc]"
				/>
				<button className="py-1 px-3 text-sm rounded-md cursor-pointer font-medium bg-blue-600 hover:bg-blue-700 transition-all">
					Search
				</button>
			</form>

			{user && (
				<div className="mt-5 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<img
							alt="user img"
							src={user.avatar || "./avatar.png"}
							className="w-[40px] h-[40px] rounded-full object-cover"
						/>
						<span className="text-[17px] font-medium">{user.username}</span>
					</div>
					<button
						onClick={handleAdd}
						className="py-1 px-3 text-sm rounded-md cursor-pointer font-medium bg-blue-600 hover:bg-blue-700 transition-all"
					>
						Add User
					</button>
				</div>
			)}
		</div>
	);
};

export default AddUser;
