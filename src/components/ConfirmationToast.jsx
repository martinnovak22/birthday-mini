export const ConfirmationToast = ({ onYes, toast, title, text }) => {
	return (
		<div className={"toast"}>
			<span className={"toast-title"}>{title}</span>
			<span className={"toast-text"}>{text}</span>
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
