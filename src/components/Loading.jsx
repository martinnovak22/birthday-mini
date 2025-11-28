export const Loading = ({ title }) => {
	return (
		<div className={"screen"}>
			<span className={"loader"}></span>
			<span className={"text"}>{title}</span>
		</div>
	);
};
