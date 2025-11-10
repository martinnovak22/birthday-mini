import BloomParticles from "./BloomParticles";

export default function Plot({
	stage,
	water,
	flower,
	onWater,
	showParticles,
	onParticlesDone,
}) {
	return (
		<button type={"button"} className="plot" onClick={onWater}>
			<div className={"flower-wrapper"}>
				{stage === "seed" && <span className="emoji seed">🌱</span>}
				{stage === "sprout" && <span className="emoji sprout">🌿</span>}
				{stage === "bloom" && <span className="emoji bloom">{flower}</span>}
			</div>

			{showParticles && <BloomParticles onDone={onParticlesDone} />}

			<div className="water-bar">
				<div style={{ width: `${(water / 5) * 100}%` }} />
			</div>
		</button>
	);
}
