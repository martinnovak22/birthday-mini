import { useCallback, useEffect, useState } from "react";
import {
    emptyGarden,
    loadGardenFromDB,
    saveGardenToDB,
} from "../utils/gardenDB.js";
import {
    addBloom,
    bloomsRequiredFor,
    levelUp,
    loadUserProfile,
} from "../utils/userDB.js";
import { hapticBloom, hapticTap } from "../utils/haptics.js";

const PLOTS = 9;

export function useGarden(user) {
    const [garden, setGarden] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sparkle, setSparkle] = useState(null);

    // Load data
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

    // Save garden on change
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
                    setSparkle(index);
                    hapticBloom();

                    addBloom(user.uid);

                    setProfile((prevProfile) => {
                        if (!prevProfile) return prevProfile;

                        const updated = { ...prevProfile };
                        updated.blooms += 1;

                        const required = bloomsRequiredFor(updated.level);

                        if (updated.blooms >= required) {
                            updated.level += 1;
                            levelUp(user.uid);
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

    const clearSparkle = useCallback(() => setSparkle(null), []);

    const reload = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await loadGardenFromDB(user.uid, PLOTS);
            setGarden(data);
            setError(null);
        } catch (e) {
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
        reload
    };
}
