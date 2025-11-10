import "./App.css";
import { useCallback, useEffect, useState } from "react";
import Plot from "./components/Plot.jsx";
import { loadGarden, saveGarden } from "./utils/gardenLoad.js";

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

	function water(index) {
		setGarden((prev) => {
			const next = [...prev];
			const prevPlot = next[index];
			if (prevPlot.stage === "bloom") return prev;

			const p = { ...prevPlot };
			p.water = Math.min(p.water + 1, 5);
			if (p.water >= 5) {
				p.stage = "bloom";
				p.flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
				setSparkle(index);
			} else if (p.water === 1) {
				p.stage = "sprout";
			}
			next[index] = p;
			return next;
		});
	}

	return (
		<main className="app">
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

			<button
				type={"button"}
				className="reset"
				onClick={() => {
					if (confirm("Clear every plant?")) setGarden(loadGarden(PLOTS, true));
				}}
			>
				Start Over
			</button>
		</main>
	);
}

export default App;
