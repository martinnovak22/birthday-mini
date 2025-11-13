import "./App.css";
import { useCallback, useEffect, useState } from "react";
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
			if (p.stage === "bloom") return prev;

			p.water = Math.min(p.water + 1, 5);

			if (p.water >= 5) {
				p.stage = "bloom";
				p.flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
				setSparkle(index);
				hapticBloom();
			} else if (p.water === 1) {
				p.stage = "sprout";
			}

			next[index] = p;
			return next;
		});
	}, []);

	const blooms = garden.filter((p) => p.stage === "bloom");

	function downloadImage() {
		makeBouquetImage(blooms, {
			title: "Grown with love, always.",
			fileName: "our-bouquet.png",
		});
	}

	return (
		<main className="app">
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
					onClick={() => {
						if (confirm("Clear every plant?"))
							setGarden(loadGarden(PLOTS, true));
					}}
				>
					Start Over
				</button>
				<button type="button" className="button" onClick={downloadImage}>
					Download bouquet
				</button>
			</div>
		</main>
	);
}

export default App;
