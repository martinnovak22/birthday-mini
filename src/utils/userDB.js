import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function loadUserProfile(uid) {
	const ref = doc(db, "users", uid);
	const snap = await getDoc(ref);

	if (!snap.exists()) {
		const initial = {
			level: 1,
			blooms: 0,
			lastUpdated: Date.now(),
		};
		await setDoc(ref, initial);
		return initial;
	}

	return snap.data();
}

export async function addBloom(uid) {
	const ref = doc(db, "users", uid);
	await updateDoc(ref, {
		blooms: increment(1),
		lastUpdated: Date.now(),
	});
}

export async function levelUp(uid) {
	const ref = doc(db, "users", uid);
	await updateDoc(ref, {
		level: increment(1),
		lastUpdated: Date.now(),
	});
}

export function bloomsRequiredFor(level) {
	return 1 + (level - 1) * 2;
}
