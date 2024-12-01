import Userinfo from "./userInfo/Userinfo";
import ChatList from "./chatList/ChatList";

export default function List() {
	return (
		<div className="flex-1 flex flex-col">
			<Userinfo />
			<ChatList />
		</div>
	);
}
