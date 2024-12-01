import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,

	authDomain: "reactchatapp-994db.firebaseapp.com",
	projectId: "reactchatapp-994db",
	storageBucket: "reactchatapp-994db.firebasestorage.app",
	messagingSenderId: "561370047056",
	appId: "1:561370047056:web:fc8f16a2442e2f05da2755",
	measurementId: "G-7XE10C3MSP",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
