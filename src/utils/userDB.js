import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function loadUserProfile(uid) {
	const ref = doc(db, "users", uid);
	const snap = await getDoc(ref);

	if (!snap.exists()) {
		const initial = {
			level: 1,
			xp: 0,
			xpToNextLevel: 500,
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

export async function addXP(uid, amount) {
	const ref = doc(db, "users", uid);
	await updateDoc(ref, {
		xp: increment(amount),
		lastUpdated: Date.now(),
	});
}

export async function levelUp(uid, newLevel) {
	const ref = doc(db, "users", uid);
	const newXpRequired = xpRequiredForLevel(newLevel);
	await updateDoc(ref, {
		level: newLevel,
		xpToNextLevel: newXpRequired,
		lastUpdated: Date.now(),
	});
}

export function xpRequiredForLevel(level) {
	return 500 + (level - 1) * 100;
}
