import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { PiDownloadSimple } from "react-icons/pi";
import { auth } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useHandleBlock } from "../../lib/customHook/useHandleBlock";

export default function Detail() {
	const { user, resetChat, isReceiverBlocked, isCurrentUserBlocked } =
		useChatStore();

	const handleBlock = useHandleBlock();

	const handleLogout = () => {
		auth.signOut();
		resetChat();
	};

	return (
		<div className="flex-1 hidden md:block">
			{/* user */}
			<div className="flex flex-col justify-center items-center gap-2 p-3 border-b border-[#545454]">
				<img
					alt="img"
					src={user?.avatar || "./avatar.png"}
					className="w-[65px] h-[65px] object-cover rounded-full"
				/>
				<h2 className="font-medium text-[17px]">{user?.username}</h2>
				<p className="text-[13px]">Lorem ipsum dolor sit amet</p>
			</div>

			{/* info */}
			<div className="p-3 flex flex-col gap-4">
				<div>
					<div className="flex justify-between cursor-pointer">
						<span>Chat Settings</span>
						<IoChevronUpOutline className="size-7" />
					</div>
				</div>

				<div>
					<div className="flex justify-between cursor-pointer">
						<span>Privacy & Help</span>
						<IoChevronUpOutline className="size-7" />
					</div>
				</div>

				<div>
					<div className="flex justify-between cursor-pointer">
						<span>Shared Photos</span>
						<IoChevronDownOutline className="size-7" />
					</div>

					{/* photos */}
					<div className="flex flex-col gap-3 mt-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									alt="img"
									className="w-[40px] h-[40px] rounded-md object-cover"
									src="https://play-lh.googleusercontent.com/Gtq3-k_EByT2U3AeVEOXkemgwwfx9MLJR2k0Y-_X7Yvj4pD0idrUjINevdN0kehMyYg=w526-h296-rw"
								/>
								<span className="text-[14px] text-slate-300">
									photo_2024_2.png
								</span>
							</div>
							<PiDownloadSimple className="size-6 cursor-pointer" />
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									alt="img"
									className="w-[40px] h-[40px] rounded-md object-cover"
									src="https://play-lh.googleusercontent.com/Gtq3-k_EByT2U3AeVEOXkemgwwfx9MLJR2k0Y-_X7Yvj4pD0idrUjINevdN0kehMyYg=w526-h296-rw"
								/>
								<span className="text-[14px] text-slate-300">
									photo_2024_2.png
								</span>
							</div>
							<PiDownloadSimple className="size-6 cursor-pointer" />
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									alt="img"
									className="w-[40px] h-[40px] rounded-md object-cover"
									src="https://play-lh.googleusercontent.com/Gtq3-k_EByT2U3AeVEOXkemgwwfx9MLJR2k0Y-_X7Yvj4pD0idrUjINevdN0kehMyYg=w526-h296-rw"
								/>
								<span className="text-[14px] text-slate-300">
									photo_2024_2.png
								</span>
							</div>
							<PiDownloadSimple className="size-6 cursor-pointer" />
						</div>
					</div>
				</div>

				<div>
					<div className="flex justify-between cursor-pointer">
						<span>Shared Files</span>
						<IoChevronUpOutline className="size-7" />
					</div>
				</div>

				<button
					onClick={handleBlock}
					className="py-[9px] px-4 cursor-pointer rounded-md bg-red-800 hover:bg-red-900 transition-all"
				>
					{isCurrentUserBlocked
						? "You are Blocked!"
						: isReceiverBlocked
						? "User blocked"
						: "Block User"}
				</button>

				<button
					onClick={handleLogout}
					className="py-[9px] px-4 cursor-pointer rounded-md bg-blue-700 hover:bg-blue-800 transition-all"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
