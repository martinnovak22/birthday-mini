import { makeBouquetAI } from "../utils/makeBouquetAI.js";

export const SelectionToast = ({ onCustomSelect, toast, blooms }) => {
	return (
		<div className={"toast"}>
			<span className={"toast-title"}>Choose bouquet style</span>
			<span className={"toast-text"}>
				Do you want custom bouquet or AI generated one?
			</span>
			<div className={"toast-button-wrapper"}>
				<button
					type={"button"}
					onClick={() => {
						onCustomSelect();
						toast.dismiss();
					}}
					className={"button"}
				>
					Custom
				</button>
				<button
					type={"button"}
					onClick={() => {
						toast.promise(
							async () => {
								await makeBouquetAI(blooms);
							},
							{
								loading: "Loading the image",
								success: "Data being downloaded",
								error: "Error getting the image",
							},
						);
					}}
					className={"button"}
				>
					AI
				</button>
			</div>
		</div>
	);
};
