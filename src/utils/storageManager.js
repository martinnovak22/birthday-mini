// Centralized localStorage management
const STORAGE_KEYS = {
    TURBO_MODE: "isTurboMode",
    ONBOARDING: "hasSeenOnboarding",
    SOUND_ENABLED: "isSoundEnabled",
};

// Helper to get boolean value from localStorage
const getBooleanValue = (key, defaultValue = false) => {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : value === "true";
};

// Helper to set boolean value in localStorage
const setBooleanValue = (key, value) => {
    localStorage.setItem(key, String(value));
};

export const storageManager = {
    // Turbo Mode
    getTurboMode: () => getBooleanValue(STORAGE_KEYS.TURBO_MODE, false),
    setTurboMode: (enabled) => setBooleanValue(STORAGE_KEYS.TURBO_MODE, enabled),

    // Onboarding
    getHasSeenOnboarding: () =>
        getBooleanValue(STORAGE_KEYS.ONBOARDING, false),
    setHasSeenOnboarding: (seen) =>
        setBooleanValue(STORAGE_KEYS.ONBOARDING, seen),

    // Sound
    getSoundEnabled: () => getBooleanValue(STORAGE_KEYS.SOUND_ENABLED, true),
    setSoundEnabled: (enabled) =>
        setBooleanValue(STORAGE_KEYS.SOUND_ENABLED, enabled),
};
