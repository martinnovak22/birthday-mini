import { Toast } from "./Toast.jsx";

export const ConfirmationToast = ({ onYes, toast, title, text }) => {
	return (
		<Toast>
			<Toast.Title>{title}</Toast.Title>
			<Toast.Text>{text}</Toast.Text>
			<Toast.Actions>
				<Toast.Button
					onClick={() => {
						onYes();
						toast.dismiss();
					}}
				>
					Yes
				</Toast.Button>
				<Toast.Button onClick={() => toast.dismiss()}>No</Toast.Button>
			</Toast.Actions>
		</Toast>
	);
};
