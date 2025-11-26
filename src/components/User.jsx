export const User = ({ profile, name }) => {
	return (
		<div className={"user-info"}>
			<h3 className={"user-text"}>{name}</h3>
			<p className={"user-text"}>Your Level: {profile?.level}</p>
			<p className={"user-text"}>Flowers grown: {profile?.blooms}</p>
		</div>
	);
};
