export const ErrorRefresh = ({ onClick }) => {
	return (
		<div className={"screen"}>
			<span style={{ fontSize: "60px", lineHeight: "70px" }}>🌧</span>
			<h1 className={"title"}>Unable to load your garden</h1>
			<button type={"button"} className={"button"} onClick={onClick}>
				Try again
			</button>
		</div>
	);
};
