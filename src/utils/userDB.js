import { doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
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
			role: "user",
		};
		await setDoc(ref, initial);
		return initial;
	}

	let data = snap.data();
	const { level, xp, xpToNextLevel, leveledUp } = calculateProgression(data);

	if (leveledUp) {
		data = { ...data, level, xp, xpToNextLevel };
		await updateDoc(ref, {
			level,
			xp,
			xpToNextLevel,
			lastUpdated: Date.now(),
		});
	}

	return data;
}

export function calculateProgression(current) {
	let { level, xp, xpToNextLevel } = current;
	let deduction = 0;
	let leveledUp = false;

	while (xp >= xpToNextLevel) {
		deduction += xpToNextLevel;
		xp -= xpToNextLevel;
		level += 1;
		xpToNextLevel = xpRequiredForLevel(level);
		leveledUp = true;
	}

	return { level, xp, xpToNextLevel, deduction, leveledUp };
}

export async function processBloom(uid, xpAmount) {
	const ref = doc(db, "users", uid);
	return await runTransaction(db, async (transaction) => {
		const sfDoc = await transaction.get(ref);
		if (!sfDoc.exists()) {
			throw "Document does not exist!";
		}

		const data = sfDoc.data();
		const newBlooms = (data.blooms || 0) + 1;
		const newXp = (data.xp || 0) + xpAmount;

		const { level, xp, xpToNextLevel } = calculateProgression({
			...data,
			xp: newXp,
		});

		const updatedData = {
			blooms: newBlooms,
			level,
			xp,
			xpToNextLevel,
			lastUpdated: Date.now(),
		};

		transaction.update(ref, updatedData);
		return updatedData;
	});
}

export function xpRequiredForLevel(level) {
	return 500 + (level - 1) * 100;
}
