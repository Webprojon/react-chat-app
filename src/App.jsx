import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

function App() {
	const { currentUser, isLoading, fetchUserInfo } = useUserStore();
	const { chatId } = useChatStore();

	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});

		return () => {
			unSub();
		};
	}, [fetchUserInfo]);

	if (isLoading)
		return <div className="text-[30px] md:text-[40px]">Loading...</div>;

	return (
		<div className="flex select-none w-[100vw] h-screen md:w-[87vw] md:h-[90vh] md:rounded-md bg-[rgba(17,25,40,0.87)] backdrop-blur-[19px] backdrop-saturate-[180%] md:border border-[#545454]">
			{currentUser ? (
				<>
					<List />
					{chatId && <Chat />}
					{chatId && <Detail />}
				</>
			) : (
				<Login />
			)}

			<Toaster position="top-center" />
		</div>
	);
}

export default App;
