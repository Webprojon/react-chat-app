import { HiDotsVertical } from "react-icons/hi";
import { useUserStore } from "../../../lib/userStore";

export default function Userinfo() {
	const { currentUser } = useUserStore();

	return (
		<div className="flex items-center justify-between p-3 border-b border-[#545454]">
			<div className="flex items-center gap-x-4">
				<img
					alt="avatar img"
					src={currentUser.avatar || "./avatar.png"}
					className="w-[50px] h-[50px] rounded-full object-cover"
				/>
				<h2 className="text-[18px] font-medium">{currentUser.username}</h2>
			</div>

			<HiDotsVertical className="size-6 cursor-pointer" />
		</div>
	);
}
