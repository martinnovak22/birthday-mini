export const Loading = ({ title }) => {
	return (
		<div className={"screen"}>
			<div className={"loading"}>
				<span className={"loader"}></span>
				<h4>{title}</h4>
			</div>
		</div>
	);
};
