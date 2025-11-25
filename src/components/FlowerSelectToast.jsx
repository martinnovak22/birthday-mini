export const FlowerSelectToast = ({ toast, flowers, onSelect }) => {
	return (
		<div className="toast">
			<div className="toast-title">Choose your flower</div>
			<div className={"toast-flowers"}>
				{flowers.map((f) => (
					<button
						type={"button"}
						key={f}
						className={"button toast-flower-button"}
						onClick={() => {
							toast.dismiss();
							onSelect(f);
						}}
					>
						<span className={"toast-flower"}>{f}</span>
					</button>
				))}
			</div>
		</div>
	);
};
