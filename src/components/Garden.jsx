import { signOut } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { auth } from "../utils/firebase.js";
import { loadGardenFromDB, saveGardenToDB } from "../utils/gardenDB.js";
import { emptyGarden } from "../utils/gardenLoad.js";
import { hapticBloom, hapticTap } from "../utils/haptics.js";
import makeBouquetImage from "../utils/makeBouquetImage.js";
import { ConfirmationToast } from "./ConfirmationToast.jsx";
import { ErrorRefresh } from "./Error.jsx";
import Plot from "./Plot.jsx";
import { SelectionToast } from "./SelectionToast.jsx";

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

	useEffect(() => {
		if (!user) return;

		(async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await loadGardenFromDB(user.uid, PLOTS);
				setGarden(data);
			} catch (err) {
				console.error("Garden failed to load", err);
				setError("Garden failed to load");
			}
			setIsLoading(false);
		})();
	}, [user]);

	useEffect(() => {
		if (!user || !garden) return;
		saveGardenToDB(user.uid, garden);
	}, [user, garden]);

	const handleParticlesDone = useCallback(() => setSparkle(null), []);

	const water = useCallback((index) => {
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
				p.flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
				p.finished = true;
				setSparkle(index);
				hapticBloom();
			}

			next[index] = p;
			return next;
		});
	}, []);

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

	function downloadImage() {
		makeBouquetImage(blooms, {
			fileName: "our-bouquet.png",
		});
	}

	return (
		<>
			<h1>Cute little garden</h1>

			<section className="ground">
				{garden.map((plot, i) => (
					<Plot
						key={i.toString()}
						{...plot}
						onWater={() => water(i)}
						showParticles={sparkle === i}
						onParticlesDone={handleParticlesDone}
					/>
				))}
			</section>

			<div className="button-wrapper">
				<button
					type="button"
					className="button"
					disabled={!garden.some((p) => p.water >= 0)}
					onClick={() => {
						toast(
							<ConfirmationToast
								onYes={() => setGarden(emptyGarden(PLOTS))}
								toast={toast}
							/>,
						);
					}}
				>
					Start again
				</button>
				<button
					type="button"
					className="button"
					onClick={() =>
						toast(
							<SelectionToast
								toast={toast}
								onCustomSelect={downloadImage}
								blooms={blooms}
							/>,
						)
					}
					disabled={garden.every((p) => !p.finished)}
				>
					Download bouquet
				</button>
				<button
					className="button"
					onClick={() => signOut(auth)}
					type={"button"}
				>
					Logout
				</button>
			</div>
		</>
	);
};
