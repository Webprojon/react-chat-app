import { useCallback } from "react";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useChatStore } from "../chatStore";
import { useUserStore } from "../userStore";
import { db } from "../firebase";

export const useHandleBlock = () => {
	const { user, changeBlock, isReceiverBlocked } = useChatStore();
	const { currentUser } = useUserStore();

	const handleBlock = useCallback(async () => {
		if (!user || !currentUser) return;

		const userDocRef = doc(db, "users", currentUser.id);

		try {
			await updateDoc(userDocRef, {
				blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
			});
			changeBlock();
		} catch (err) {
			console.error("Error updating block status:", err);
		}
	}, [user, currentUser, isReceiverBlocked, changeBlock]);

	return handleBlock;
};
