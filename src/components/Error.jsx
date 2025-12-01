export const ErrorRefresh = ({ onClick }) => {
	return (
		<div className={"screen"}>
			<span className={"icon"}>🌧</span>
			<h1 className={"title"}>Unable to load your garden</h1>
			<span>Error getting garden data</span>
			<button type={"button"} className={"button"} onClick={onClick}>
				Try again
			</button>
		</div>
	);
};
