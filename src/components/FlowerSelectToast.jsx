import { Toast } from "./Toast.jsx";

export const FlowerSelectToast = ({ toast, flowers, onSelect }) => {
	return (
		<Toast>
			<Toast.Title>Choose your flower</Toast.Title>
			<Toast.Flowers>
				{flowers.map((f) => (
					<Toast.FlowerButton
						key={f}
						onClick={() => {
							toast.dismiss();
							onSelect(f);
						}}
					>
						{f}
					</Toast.FlowerButton>
				))}
			</Toast.Flowers>
		</Toast>
	);
};
