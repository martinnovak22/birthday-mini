import { XPProgressBar } from "./XPProgressBar.jsx";

export const User = ({ profile, name }) => {
	return (
		<div className={"user-info"}>
			<h3 className={"user-text"}>{name}</h3>
			<XPProgressBar
				currentXP={profile?.xp}
				xpToNextLevel={profile?.xpToNextLevel}
				level={profile?.level}
			/>
			<p className={"user-text"}>Flowers grown: {profile?.blooms}</p>
		</div>
	);
};
