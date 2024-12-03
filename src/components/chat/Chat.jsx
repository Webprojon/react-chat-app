import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { IoArrowBackSharp } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";

export default function Chat() {
	const [chat, setChat] = useState();
	const [isEmoji, setIsEmoji] = useState(false);
	const [text, setText] = useState("");
	const endRef = useRef(null);
	const {
		chatId,
		user,
		isOpenPage,
		setTogglePage,
		isReceiverBlocked,
		isCurrentUserBlocked,
	} = useChatStore();
	const { currentUser } = useUserStore();
	const [img, setImg] = useState({
		file: null,
		url: "",
	});

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChat(res.data());
		});

		return () => {
			unSub();
		};
	}, [chatId]);

	const handleEmoji = (e) => {
		setText((prev) => prev + e.emoji);
		setIsEmoji(false);
	};

	const handleImg = (e) => {
		if (e.target.files[0]) {
			setImg({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleSend = async () => {
		if (text === "") return;

		let imgUrl = null;

		try {
			if (img.file) {
				imgUrl = await upload(img.file);
			}

			await updateDoc(doc(db, "chats", chatId), {
				messages: arrayUnion({
					senderId: currentUser.id,
					text,
					createdAt: new Date(),
					...(imgUrl && { img: imgUrl }),
				}),
			});

			const userIDs = [currentUser.id, user.id];

			userIDs.forEach(async (id) => {
				const userChatsRef = doc(db, "userchats", id);
				const userChatsSnapshot = await getDoc(userChatsRef);

				if (userChatsSnapshot.exists()) {
					const userChatsData = userChatsSnapshot.data();

					const chatIndex = userChatsData.chats.findIndex(
						(c) => c.chatId === chatId,
					);

					userChatsData.chats[chatIndex].lastMessage = text;
					userChatsData.chats[chatIndex].isSeen =
						id === currentUser.id ? true : false;
					userChatsData.chats[chatIndex].updatedAt = Date.now();

					await updateDoc(userChatsRef, {
						chats: userChatsData.chats,
					});
				}
			});
		} catch (err) {
			console.log(err.message);
		} finally {
			setImg({
				file: null,
				url: "",
			});

			setText("");
		}
	};

	return (
		<div
			className={`h-[100%] flex-[2] flex-col border-r border-l border-[#545454] 
				${isOpenPage ? "flex" : "hidden"}`}
		>
			{/* Top */}
			<div className="flex justify-between items-center border-b border-[#545454] p-3">
				<div className="flex items-center gap-x-4">
					<IoArrowBackSharp
						onClick={setTogglePage}
						className="size-6 text-sla2te-00 md:hidden"
					/>
					<div className="flex gap-3">
						<img
							alt="user img"
							src={user?.avatar || "./avatar.png"}
							className="w-[50px] h-[50px] object-cover rounded-full"
						/>
						<div>
							<span className="font-semibold text-[18px]">
								{user?.username}
							</span>
							<p className="font-light text-[14px] text-slate-300">
								Lorem ipsum dolor sit
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center cursor-pointer gap-x-4">
					<HiDotsVertical className="size-6" />
				</div>
			</div>

			{/* Center */}
			<div className="no-scrollbar overflow-y-scroll p-4 flex-1 flex flex-col gap-[20px]">
				{chat?.messages?.map((message) => (
					<div
						className={
							message.senderId === currentUser.id ? "message own" : " message"
						}
						key={message?.createdAt}
					>
						<div className="space-y-4">
							{message.img && (
								<img alt="img" src={message.img} className="rounded-md" />
							)}
							<p className="text-[14px]">{message.text}</p>
							{/*<span className="text-[12px]"></span>*/}
						</div>
					</div>
				))}
				{img.url && (
					<div className="message own">
						<div>
							<img src={img.url} alt="img" className="rounded-md" />
						</div>
					</div>
				)}

				<div ref={endRef}></div>
			</div>

			{/* Bottom */}
			<div className="mt-auto flex items-center justify-between gap-x-4 p-3 border-t border-[#545454]">
				<input
					type="text"
					value={text}
					placeholder={
						isCurrentUserBlocked || isReceiverBlocked
							? "You cannot send a message"
							: "Type a message..."
					}
					onChange={(e) => setText(e.target.value)}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
					className="flex-1 text-slate-300 placeholder:text-slate-300 outline-none bg-slate-800 rounded-md py-2 px-3 disabled:cursor-not-allowed"
				/>

				<div className="relative">
					<img
						src="./emoji.png"
						alt="emoji img"
						className="w-[20px] cursor-pointer"
						onClick={() => setIsEmoji((prev) => !prev)}
					/>
					<div className="absolute bottom-[50px] left-0">
						<EmojiPicker open={isEmoji} onEmojiClick={handleEmoji} />
					</div>
				</div>

				<div className="flex items-center gap-x-4 cursor-pointer">
					<label htmlFor="file">
						<img
							alt="img"
							src="./img.png"
							className="w-[20px] cursor-pointer"
						/>
					</label>
					<input
						type="file"
						id="file"
						className="hidden"
						onChange={handleImg}
					/>
				</div>

				<button
					onClick={handleSend}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
					className="py-1 px-3 rounded-md cursor-pointer bg-blue-700 hover:bg-blue-800 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
				>
					Send
				</button>
			</div>
		</div>
	);
}
