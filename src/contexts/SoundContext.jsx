import { createContext, useContext, useEffect, useState } from "react";
import { soundGenerator } from "../utils/sounds.js";
import { storageManager } from "../utils/storageManager.js";

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(() =>
        storageManager.getSoundEnabled(),
    );

    // Update localStorage when sound preference changes
    useEffect(() => {
        storageManager.setSoundEnabled(isSoundEnabled);
    }, [isSoundEnabled]);

    const playSound = (soundName) => {
        if (!isSoundEnabled) return;

        switch (soundName) {
            case "click":
                soundGenerator.playClick();
                break;
            case "grow":
                soundGenerator.playGrow();
                break;
            case "bloom":
                soundGenerator.playBloom();
                break;
            default:
                console.warn(`Unknown sound: ${soundName}`);
        }
    };

    return (
        <SoundContext.Provider
            value={{ playSound, isSoundEnabled, setIsSoundEnabled }}
        >
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
};
