export const XPProgressBar = ({ currentXP = 0, xpToNextLevel = 500, level = 1 }) => {
    const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);
    const isNearLevelUp = percentage >= 90;

    return (
        <div className="xp-progress-container">
            <div className="xp-progress-header">
                <span>Level {level}</span>
                <span>{currentXP} / {xpToNextLevel} XP</span>
            </div>
            <div className="xp-progress-bar">
                <div
                    className={`xp-progress-fill ${isNearLevelUp ? "near-levelup" : ""}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
