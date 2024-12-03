import Userinfo from "./userInfo/Userinfo";
import ChatList from "./chatList/ChatList";
import { useChatStore } from "../../lib/chatStore";

export default function List() {
	const { isOpenPage } = useChatStore();

	return (
		<div
			className={`flex-1 flex-col ${isOpenPage ? "hidden md:flex" : "flex"}`}
		>
			<Userinfo />
			<ChatList />
		</div>
	);
}
