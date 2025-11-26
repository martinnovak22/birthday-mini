import { makeBouquetAI } from "../utils/makeBouquetAI.js";
import { Toast } from "./Toast.jsx";

export const SelectionToast = ({ onCustomSelect, toast, blooms }) => {
	return (
		<Toast>
			<Toast.Title>Choose bouquet style</Toast.Title>
			<Toast.Text>Do you want custom bouquet or AI generated one?</Toast.Text>

			<Toast.Actions>
				<Toast.Button
					onClick={() => {
						onCustomSelect();
						toast.dismiss();
					}}
				>
					Custom
				</Toast.Button>

				<Toast.Button
					onClick={() => {
						toast.dismiss();

						const promise = makeBouquetAI(blooms);

						toast.promise(promise, {
							loading: "Generating bouquet…",
							success: "Your bouquet is downloading 💐",
							error: "Failed to generate bouquet",
						});
					}}
				>
					AI
				</Toast.Button>
			</Toast.Actions>
		</Toast>
	);
};
