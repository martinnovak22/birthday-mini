import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { emptyGarden } from "./gardenLoad.js";

export async function loadGardenFromDB(uid, size) {
	const ref = doc(db, "gardens", uid);
	const snap = await getDoc(ref);

	if (!snap.exists()) {
		const initial = emptyGarden(size);
		await setDoc(ref, { garden: initial });
		return initial;
	}

	return snap.data().garden;
}

export async function saveGardenToDB(uid, garden) {
	const ref = doc(db, "gardens", uid);
	await updateDoc(ref, { garden });
}
