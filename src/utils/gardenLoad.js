export function loadGarden(size, forceEmpty = false) {
	if (forceEmpty) return empty(size);
	try {
		const raw = localStorage.getItem("garden");
		if (raw) {
			const data = JSON.parse(raw);
			if (data.length === size) return data;
		}
	} catch {
		console.error("Loading garden failed, using empty garden.");
	}
	return empty(size);
}

export function saveGarden(garden) {
	localStorage.setItem("garden", JSON.stringify(garden));
}

function empty(size) {
	return Array.from({ length: size }, () => ({
		stage: "seed",
		water: 0,
		flower: "",
	}));
}
