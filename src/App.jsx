import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ConfirmationToast } from "./components/ConfirmationToast.jsx";
import Plot from "./components/Plot.jsx";
import { loadGarden, saveGarden } from "./utils/gardenLoad.js";
import { hapticBloom, hapticTap } from "./utils/haptics.js";
import makeBouquetImage from "./utils/makeBouquetImage.js";

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

function App() {
	const [garden, setGarden] = useState(() => loadGarden(PLOTS));
	const [sparkle, setSparkle] = useState(null);

	useEffect(() => saveGarden(garden), [garden]);

	const handleParticlesDone = useCallback(() => setSparkle(null), []);

	const water = useCallback((index) => {
		setGarden((prev) => {
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

	const blooms = garden.filter((p) => p.water === 5);

	function downloadImage() {
		makeBouquetImage(blooms, {
			title: "Grown with love, always.",
			fileName: "our-bouquet.png",
		});
	}

	return (
		<main className="app">
			<Toaster />
			<div className={"background"} />
			<h1>Our little garden</h1>
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
					onClick={async () => {
						toast(
							<ConfirmationToast
								onYes={() => setGarden(loadGarden(PLOTS, true))}
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
					onClick={downloadImage}
					disabled={garden.every((p) => !p.finished)}
				>
					Download bouquet
				</button>
			</div>
		</main>
	);
}

export default App;
