import { HiDotsVertical } from "react-icons/hi";
import { useUserStore } from "../../../lib/userStore";
import { MdBlock } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { useHandleBlock } from "../../../lib/customHook/useHandleBlock";

export default function Userinfo() {
	const { currentUser } = useUserStore();
	const [openMore, setOpenMore] = useState(false);
	const handleBlock = useHandleBlock();

	const handleOpen = () => {
		setOpenMore((prev) => !prev);
	};

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

			<div className="cursor-pointer relative">
				<HiDotsVertical className="size-6" onClick={handleOpen} />
				<div
					className={`flex-col gap-6 text-[18px] absolute right-2 top-9 z-10 rounded-md w-[170px] p-5 bg-slate-900 opacity-95
						${openMore ? "flex" : "hidden"}`}
				>
					<span
						className="flex items-center gap-3"
						onClick={() => {
							handleOpen();
							handleBlock();
						}}
					>
						<MdBlock className="size-6" />
						Block User
					</span>
					<span
						className="flex items-center gap-3"
						onClick={() => {
							handleOpen();
							auth.signOut();
						}}
					>
						<IoLogOutOutline className="size-6" />
						Logout
					</span>
				</div>
			</div>
		</div>
	);
}
