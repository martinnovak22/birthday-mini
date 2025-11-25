import { signOut } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase.js";
import {
	emptyGarden,
	loadGardenFromDB,
	saveGardenToDB,
} from "../utils/gardenDB.js";
import { hapticBloom, hapticTap } from "../utils/haptics.js";
import makeBouquetImage from "../utils/makeBouquetImage.js";
import {
	addBloom,
	bloomsRequiredFor,
	levelUp,
	loadUserProfile,
} from "../utils/userDB.js";
import { ConfirmationToast } from "./ConfirmationToast.jsx";
import { ErrorRefresh } from "./Error.jsx";
import { FlowerSelectToast } from "./FlowerSelectToast.jsx";
import Plot from "./Plot.jsx";
import { SelectionToast } from "./SelectionToast.jsx";
import { User } from "./User.jsx";

const PLOTS = 9;

const FLOWERS = [
	"🌸",
	"🌺",
	"🌻",
	"🏵️",
	"🌼",
	"🪻",
	"🥀",
	"🌷",
	"🌹",
	"💮",
	"🪷",
];

export const Garden = ({ user }) => {
	const [sparkle, setSparkle] = useState(null);
	const [garden, setGarden] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [profile, setProfile] = useState(null);

	const handleParticlesDone = useCallback(() => setSparkle(null), []);

	useEffect(() => {
		if (!user) return;

		(async () => {
			setIsLoading(true);

			try {
				const data = await loadGardenFromDB(user.uid, PLOTS);
				setGarden(data);

				const profileData = await loadUserProfile(user.uid);
				setProfile(profileData);
			} catch (err) {
				console.error("Load failed", err);
				setError("Garden failed to load");
			}

			setIsLoading(false);
		})();
	}, [user]);

	useEffect(() => {
		if (!user || !garden) return;
		saveGardenToDB(user.uid, garden);
	}, [user, garden]);

	const water = useCallback(
		(index) => {
			setGarden((prev) => {
				if (!prev) return prev;

				const now = Date.now();
				const next = [...prev];
				const prevPlot = next[index];

				hapticTap();

				const p = { ...prevPlot, lastWatered: now };
				if (p.finished) return prev;

				p.water = Math.min(p.water + 1, 5);

				if (p.water >= 5) {
					p.finished = true;
					setSparkle(index);
					hapticBloom();

					addBloom(user.uid);

					setProfile((prev) => {
						if (!prev) return prev;

						const updated = { ...prev };
						updated.blooms += 1;

						const required = bloomsRequiredFor(updated.level);

						if (updated.blooms >= required) {
							updated.level += 1;
							levelUp(user.uid);
						}

						return updated;
					});
				}

				next[index] = p;
				return next;
			});
		},
		[user.uid],
	);

	if (isLoading) {
		return <span className="text">Loading garden…</span>;
	}

	if (error) {
		return (
			<ErrorRefresh
				onClick={async () => {
					const data = await loadGardenFromDB(user.uid, PLOTS);
					setGarden(data);
					setError(false);
				}}
			/>
		);
	}

	if (!garden) return null;

	const blooms = garden.filter((p) => p.water === 5);

	return (
		<>
			<div className={"header"}>
				<button
					type={"button"}
					className={"menu-toggle"}
					onClick={() => setMenuOpen(true)}
				>
					☰
				</button>
				<h1>Cute little garden</h1>
			</div>
			<section className="ground">
				{garden.map((plot, i) => (
					<Plot
						key={i.toString()}
						{...plot}
						onWater={() => water(i)}
						showParticles={sparkle === i}
						onSeedClick={() =>
							toast(
								<FlowerSelectToast
									toast={toast}
									flowers={FLOWERS}
									onSelect={(flower) => {
										setGarden((prev) => {
											const next = [...prev];
											next[i] = {
												...next[i],
												water: 0,
												flower,
												finished: false,
												lastWatered: Date.now(),
											};
											return next;
										});
									}}
								/>,
							)
						}
						onParticlesDone={handleParticlesDone}
					/>
				))}
			</section>
			<div className={`side-menu ${menuOpen ? "open" : ""}`}>
				<h1>Menu</h1>
				<button
					type="button"
					className="close-btn"
					onClick={() => setMenuOpen(false)}
				>
					×
				</button>
				<User profile={profile} name={user.displayName} />
				<button
					type="button"
					className="button"
					disabled={!garden.some((p) => p.water >= 0)}
					onClick={() => {
						setMenuOpen(false);
						toast(
							<ConfirmationToast
								onYes={() => setGarden(emptyGarden(PLOTS))}
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
					type="button"
					className="button"
					onClick={() => {
						setMenuOpen(false);
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
					disabled={garden.every((p) => !p.finished)}
				>
					Download bouquet
				</button>

				<button
					type="button"
					className="button"
					onClick={() => {
						setMenuOpen(false);
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
