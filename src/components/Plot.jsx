import { memo } from "react";
import plus from "../assets/plus.png";
import seed from "../assets/seed.png";
import BloomParticles from "./BloomParticles";

const waterToTimeMap = {
	1: 1,
	2: 1,
	3: 1,
	4: 1,
	5: 10,
};

const waterToSizeMap = {
	2: "42px",
	3: "52px",
	4: "62px",
};

function Plot({
	water,
	flower,
	onWater,
	onParticlesDone,
	lastWatered,
	onSeedClick,
	now,
	showParticles,
}) {
	const remaining = Math.max(
		0,
		waterToTimeMap[water] - (now - lastWatered) / 1000,
	);
	const disabled = remaining > 0;

	const handleClick = () => {
		if (water === -1) {
			onSeedClick();
			return;
		}
		onWater();
	};
	return (
		<button
			type="button"
			className="plot"
			onClick={handleClick}
			disabled={disabled}
		>
			<div className="flower-wrapper">
				{water === -1 && (
					<img src={plus} alt={"seed"} className={"icon-image"} />
				)}
				{water === 0 && (
					<img src={seed} alt={"seed"} className={"icon-image"} />
				)}
				{water === 1 && <span className="emoji seed">🌱</span>}
				{water >= 2 && water < 5 && (
					<span className="emoji" style={{ fontSize: waterToSizeMap[water] }}>
						🌿
					</span>
				)}
				{water === 5 && (
					<span className="emoji bloom">{flower}</span>
				)}
			</div>

			{showParticles && remaining === 0 && (
				<BloomParticles onDone={onParticlesDone} />
			)}

			<div className="water-bar">
				<div style={{ width: water === -1 ? "0%" : `${(water / 5) * 100}%` }} />
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
