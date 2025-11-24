export function emptyGarden(size) {
	return Array.from({ length: size }, () => ({
		water: -1,
		flower: "",
		lastWatered: 0,
	}));
}
