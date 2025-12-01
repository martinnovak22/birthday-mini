import { Toast } from "./Toast.jsx";

export const OnboardingToast = ({ toast }) => {
	return (
		<Toast>
			<Toast.Title>🌱 Welcome to Cute Little Garden!</Toast.Title>
			<Toast.Text className={"onboarding-text"}>
				<strong>How to play:</strong>
				<span>
					<strong>1️⃣ Plant seeds</strong> - Click on empty plots to choose a
					flower
				</span>
				<span>
					<strong>2️⃣ Water regularly</strong> - Click plots to water and grow
					your flowers
				</span>
				<span>
					<strong>3️⃣ Create bouquets</strong> - Once flowers bloom, download them
					as a beautiful bouquet!
				</span>
				<br />
				<span>
					💡 <em>Tip: Ask Máca about turbo mode!</em>
				</span>
			</Toast.Text>
			<Toast.Actions>
				<Toast.Button onClick={() => toast.dismiss()}>Got it! 🌸</Toast.Button>
			</Toast.Actions>
		</Toast>
	);
};
