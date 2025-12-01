import { useCallback, useEffect, useRef, useState } from "react";
import {
	emptyGarden,
	loadGardenFromDB,
	saveGardenToDB,
} from "../utils/gardenDB.js";
import { hapticBloom, hapticTap } from "../utils/haptics.js";
import { loadUserProfile, processBloom } from "../utils/userDB.js";

const PLOTS = 9;

export function useGarden(user) {
	const [garden, setGarden] = useState(null);
	const [profile, setProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sparkle, setSparkle] = useState(new Set());
	const [activePlot, setActivePlot] = useState(null);

	const updateQueue = useRef(Promise.resolve());

	useEffect(() => {
		if (!user) return;

		(async () => {
			setIsLoading(true);
			try {
				const [gardenData, profileData] = await Promise.all([
					loadGardenFromDB(user.uid, PLOTS),
					loadUserProfile(user.uid),
				]);
				setGarden(gardenData);
				setProfile(profileData);
				setError(null);
			} catch (err) {
				console.error("Load failed", err);
				setError("Garden failed to load");
			} finally {
				setIsLoading(false);
			}
		})();
	}, [user]);

	useEffect(() => {
		if (!user || !garden) return;
		saveGardenToDB(user.uid, garden);
	}, [user, garden]);

	const water = useCallback(
		async (index) => {
			if (!garden) return;

			const now = Date.now();
			const prevPlot = garden[index];

			if (prevPlot.finished) return;

			hapticTap();

			const nextPlot = { ...prevPlot, lastWatered: now };
			const newWaterLevel = Math.min(nextPlot.water + 1, 5);
			nextPlot.water = newWaterLevel;

			let isFinished = false;
			if (newWaterLevel >= 5) {
				nextPlot.finished = true;
				isFinished = true;
			}

			setGarden((prev) => {
				const next = [...prev];
				next[index] = nextPlot;
				return next;
			});

			if (isFinished) {
				setSparkle((prev) => new Set(prev).add(index));
				hapticBloom();

				const XP_PER_BLOOM = 100;

				updateQueue.current = updateQueue.current.then(async () => {
					try {
						const updatedProfile = await processBloom(user.uid, XP_PER_BLOOM);
						setProfile((prev) => ({ ...prev, ...updatedProfile }));
					} catch (e) {
						console.error("Failed to save progress", e);
					}
				});
			}
		},
		[garden, user?.uid],
	);

	const plant = useCallback((index, flower) => {
		setGarden((prev) => {
			const next = [...prev];
			next[index] = {
				...next[index],
				water: 0,
				flower,
				finished: false,
				lastWatered: Date.now(),
			};
			return next;
		});
	}, []);

	const resetGarden = useCallback(() => {
		setGarden(emptyGarden(PLOTS));
	}, []);

	const clearSparkle = useCallback((index) => {
		setSparkle((prev) => {
			const next = new Set(prev);
			next.delete(index);
			return next;
		});
	}, []);

	const reload = useCallback(async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const data = await loadGardenFromDB(user.uid, PLOTS);
			setGarden(data);
			setError(null);
		} catch {
			setError("Failed to reload");
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	return {
		garden,
		profile,
		isLoading,
		error,
		sparkle,
		water,
		plant,
		resetGarden,
		clearSparkle,
		reload,
		activePlot,
		setActivePlot,
		isAdmin: profile?.role === "admin",
	};
}
