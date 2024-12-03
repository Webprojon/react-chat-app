import { useEffect, useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import AddUser from "./addUser/AddUser";

const ChatList = () => {
	const [chats, setChats] = useState([]);
	const [input, setInput] = useState("");

	const { currentUser } = useUserStore();
	const { chatId, changeChat, addMode, setToggleMode, setTogglePage } =
		useChatStore();

	useEffect(() => {
		const unSub = onSnapshot(
			doc(db, "userchats", currentUser.id),
			async (res) => {
				const items = res.data().chats;

				const promises = items.map(async (item) => {
					const userDocRef = doc(db, "users", item.receiverId);
					const userDocSnap = await getDoc(userDocRef);

					const user = userDocSnap.data();

					return { ...item, user };
				});

				const chatData = await Promise.all(promises);

				setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
			},
		);

		return () => {
			unSub();
		};
	}, [currentUser.id]);

	const handleSelect = async (chat) => {
		setTogglePage();

		const userChats = chats.map((item) => {
			const { user, ...rest } = item;
			console.log(user, chatId);
			return rest;
		});
		const chatIndex = userChats.findIndex(
			(item) => item.chatId === chat.chatId,
		);

		userChats[chatIndex].isSeen = true;
		const userChatsRef = doc(db, "userchats", currentUser.id);

		try {
			await updateDoc(userChatsRef, {
				chats: userChats,
			});
			changeChat(chat.chatId, chat.user);
		} catch (err) {
			console.log(err);
		}
	};

	const filteredChats = chats.filter((c) =>
		c.user.username.toLowerCase().includes(input.toLowerCase()),
	);

	return (
		<div className="mt-2 no-scrollbar overflow-y-scroll flex-1">
			<div className="p-3 flex items-center gap-x-4">
				<div className="flex-1 flex items-center gap-x-3 rounded-md bg-slate-800 py-[10px] px-2">
					<img src="./search.png" alt="search img" className="w-[24px]" />
					<input
						type="text"
						placeholder="Search"
						onChange={(e) => setInput(e.target.value)}
						className="py-[3px] md:py-0 bg-transparent outline-none text-white placeholder:text-white w-full"
					/>
				</div>
				<img
					src={addMode ? "./minus.png" : "./plus.png"}
					alt="plus img"
					className="w-[24px] cursor-pointer"
					onClick={setToggleMode}
				/>
			</div>

			{filteredChats.map((chat) => (
				<div
					key={chat.chatId}
					onClick={() => handleSelect(chat)}
					style={{
						backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
					}}
					className="flex items-center cursor-pointer mt-4 p-2 gap-x-4 border-b border-[#545454] hover:border-[#bbb4b4]"
				>
					<img
						src={
							chat.user.blocked.includes(currentUser.id)
								? "./avatar.png"
								: chat.user.avatar || "./avatar.png"
						}
						className="w-[50px] h-[50px] rounded-full object-cover"
						alt="user img"
					/>

					<div>
						<span className="text-[18px] font-semibold">
							{chat.user.blocked.includes(currentUser.id)
								? "User"
								: chat.user.username}
						</span>
						<p className="text-[15px] md:text-[14px] font-light text-slate-300">
							{chat.lastMessage}
						</p>
					</div>
				</div>
			))}

			{addMode && <AddUser />}
		</div>
	);
};

export default ChatList;
