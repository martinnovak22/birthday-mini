import { memo, useEffect, useState } from "react";
import BloomParticles from "./BloomParticles";

const waterToTimeMap = {
	1: 2,
	2: 5,
	3: 10,
	4: 15,
	5: 30,
};

// const waterToTimeMap = {
// 	1: 1,
// 	2: 1,
// 	3: 1,
// 	4: 1,
// 	5: 1,
// };

const waterToSizeMap = {
	2: "42px",
	3: "52px",
	4: "62px",
};

function Plot({ stage, water, flower, onWater, onParticlesDone, lastWatered }) {
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const remaining = Math.max(
		0,
		waterToTimeMap[water] - (now - lastWatered) / 1000,
	);
	const disabled = remaining > 0;

	return (
		<button
			type="button"
			className="plot"
			onClick={onWater}
			disabled={disabled}
		>
			<div className="flower-wrapper">
				{stage === "seed" && <span className="emoji seed">🌱</span>}
				{stage === "sprout" && (
					<span className="emoji" style={{ fontSize: waterToSizeMap[water] }}>
						🌿
					</span>
				)}
				{stage === "bloom" && remaining === 0 && (
					<span className="emoji bloom">{flower}</span>
				)}
			</div>

			{water === 5 && remaining === 0 && (
				<BloomParticles onDone={onParticlesDone} />
			)}

			<div className="water-bar">
				<div style={{ width: `${(water / 5) * 100}%` }} />
			</div>

			{disabled && (
				<div className="cooldown">
					<div className="loader" />
					{Math.floor(remaining)}s
				</div>
			)}
		</button>
	);
}

export default memo(Plot);
