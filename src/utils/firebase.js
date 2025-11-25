import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBzl6QevyVeXbHW6b-x90kbROMhaMA4y5I",
	authDomain: "garden-50fa3.firebaseapp.com",
	projectId: "garden-50fa3",
	storageBucket: "garden-50fa3.firebasestorage.app",
	messagingSenderId: "858066459162",
	appId: "1:858066459162:web:693c1cfe68524f47aa0fa3",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export function signInWithGoogle() {
	return signInWithPopup(auth, googleProvider);
}
