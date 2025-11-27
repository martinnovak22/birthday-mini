import { useCallback, useEffect, useState } from "react";
import {
	emptyGarden,
	loadGardenFromDB,
	saveGardenToDB,
} from "../utils/gardenDB.js";
import { hapticBloom, hapticTap } from "../utils/haptics.js";
import {
	addBloom,
	addXP,
	calculateProgression,
	levelUp,
	loadUserProfile,
} from "../utils/userDB.js";

const PLOTS = 9;

export function useGarden(user) {
	const [garden, setGarden] = useState(null);
	const [profile, setProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sparkle, setSparkle] = useState(new Set());
	const [activePlot, setActivePlot] = useState(null);

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
		(index) => {
			setGarden((prev) => {
				if (!prev) return prev;

				const now = Date.now();
				const next = [...prev];
				const prevPlot = next[index];

				hapticTap();

				const p = { ...prevPlot, lastWatered: now };
				if (p.finished) return prev;

				p.water = Math.min(p.water + 1, 5);

				if (p.water >= 5) {
					p.finished = true;
					setSparkle((prev) => new Set(prev).add(index));
					hapticBloom();

					const XP_PER_BLOOM = 100;
					addBloom(user.uid);
					addXP(user.uid, XP_PER_BLOOM);

					setProfile((prevProfile) => {
						if (!prevProfile) return prevProfile;

						const updated = { ...prevProfile };
						updated.blooms += 1;
						updated.xp = (updated.xp || 0) + XP_PER_BLOOM;

						const { level, xp, xpToNextLevel, deduction, leveledUp } =
							calculateProgression(updated);

						updated.level = level;
						updated.xp = xp;
						updated.xpToNextLevel = xpToNextLevel;

						if (leveledUp) {
							levelUp(user.uid, updated.level, deduction);
						}

						return updated;
					});
				}

				next[index] = p;
				return next;
			});
		},
		[user?.uid],
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
