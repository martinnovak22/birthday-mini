import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase.js";
import makeBouquetImage from "../utils/makeBouquetImage.js";
import { ConfirmationToast } from "./ConfirmationToast.jsx";
import { OnboardingToast } from "./OnboardingToast.jsx";
import { SelectionToast } from "./SelectionToast.jsx";
import { User } from "./User.jsx";

export const SideMenu = ({
	isOpen,
	onClose,
	user,
	profile,
	garden,
	onReset,
	toast,
	isAdmin,
	isTurboMode,
	setIsTurboMode,
	isSoundEnabled,
	setIsSoundEnabled,
}) => {
	const blooms = garden ? garden.filter((p) => p.water === 5) : [];
	const hasStarted = garden ? garden.some((p) => p.water >= 0) : false;
	const allFinished = garden ? garden.every((p) => !p.finished) : true;

	const name = isAdmin ? `⭐ ${user.displayName}` : user.displayName;

	return (
		<>
			{isOpen ? (
				<button
					type={"button"}
					onClick={onClose}
					className={`menu-overlay ${isOpen ? "open" : ""}`}
					aria-label={"Close menu"}
				/>
			) : null}

			<div className={`side-menu ${isOpen ? "open" : ""}`}>
				<h1>Menu</h1>
				<button type={"button"} className={"close-btn"} onClick={onClose}>
					×
				</button>
				<User profile={profile} name={name} />
				{isAdmin ? (
					<label className={"checkbox-wrapper"}>
						<span>Turbo Mode</span>
						<input
							type={"checkbox"}
							id={"cheat"}
							checked={isTurboMode}
							onChange={(e) => setIsTurboMode(e.target.checked)}
						/>
						<span className={"checkbox-box"} />
					</label>
				) : null}
				<label className={"checkbox-wrapper"}>
					<span>Sound Effects 🔊</span>
					<input
						type={"checkbox"}
						id={"sound"}
						checked={isSoundEnabled}
						onChange={(e) => setIsSoundEnabled(e.target.checked)}
					/>
					<span className={"checkbox-box"} />
				</label>
				<button
					type={"button"}
					className={"button button-side-menu"}
					onClick={() => {
						onClose();
						toast(
							<OnboardingToast
								toast={{
									dismiss: () => {
										toast.dismiss();
									},
								}}
							/>,
							{ duration: Infinity },
						);
					}}
				>
					How to play 🌱
				</button>
				<button
					type={"button"}
					className={"button button-side-menu"}
					disabled={!hasStarted}
					onClick={() => {
						onClose();
						toast(
							<ConfirmationToast
								onYes={onReset}
								toast={toast}
								title={"Start again"}
								text={"Do you want to start with fresh garden?"}
							/>,
						);
					}}
				>
					Start again
				</button>

				<button
					type={"button"}
					className={"button button-side-menu"}
					onClick={() => {
						onClose();
						toast(
							<SelectionToast
								toast={toast}
								onCustomSelect={() =>
									makeBouquetImage(blooms, {
										fileName: "our-bouquet.png",
									})
								}
								blooms={blooms}
							/>,
						);
					}}
					disabled={allFinished}
				>
					Download bouquet
				</button>
				<button
					type={"button"}
					className={"button button-side-menu"}
					onClick={() => {
						onClose();
						toast(
							<ConfirmationToast
								onYes={() => signOut(auth)}
								toast={toast}
								title={"Logout"}
								text={"Do you want to logout?"}
							/>,
						);
					}}
				>
					Logout
				</button>
			</div>
		</>
	);
};
