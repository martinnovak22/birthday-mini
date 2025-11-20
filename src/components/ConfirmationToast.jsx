export const ConfirmationToast = ({ onYes, toast }) => {
	return (
		<div className={"toast"}>
			<span className={"toast-title"}>Start again</span>
			<span className={"toast-text"}>
				Do you want to start with fresh garden?
			</span>
			<div className={"toast-button-wrapper"}>
				<button
					type={"button"}
					onClick={() => {
						onYes();
						toast.dismiss();
					}}
					className={"button"}
				>
					Yes
				</button>
				<button
					type={"button"}
					onClick={() => toast.dismiss()}
					className={"button"}
				>
					No
				</button>
			</div>
		</div>
	);
};
