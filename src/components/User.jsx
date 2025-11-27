import { XPProgressBar } from "./XPProgressBar.jsx";

export const User = ({ profile, name }) => {
	return (
		<div className={"user-info"}>
			<h4 className={"user-text"}>{name}</h4>
			<XPProgressBar
				currentXP={profile?.xp}
				xpToNextLevel={profile?.xpToNextLevel}
				level={profile?.level}
			/>
			<p className={"user-text"}>Flowers grown: {profile?.blooms}</p>
		</div>
	);
};
