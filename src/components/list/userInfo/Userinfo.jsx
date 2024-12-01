import { useUserStore } from "../../../lib/userStore";

export default function Userinfo() {
	const { currentUser } = useUserStore();

	return (
		<div className="flex items-center justify-between p-3">
			<div className="flex items-center gap-x-4">
				<img
					alt="avatar img"
					src={currentUser.avatar || "./avatar.png"}
					className="w-[50px] h-[50px] rounded-full object-cover"
				/>
				<h2 className="text-[18px] font-medium">{currentUser.username}</h2>
			</div>

			<div className="flex items-center gap-x-3 cursor-pointer">
				<img src="./more.png" alt="icons" className="w-[20px] h-[20px]" />
				<img src="./video.png" alt="icons" className="w-[20px] h-[20px]" />
				<img src="./edit.png" alt="icons" className="w-[20px] h-[20px]" />
			</div>
		</div>
	);
}
