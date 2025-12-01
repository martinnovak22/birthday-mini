import { memo, useEffect, useRef, useState } from "react";
import plus from "../assets/plus.png";
import seed from "../assets/seed.png";
import BloomParticles from "./BloomParticles";

const normalWaterToTimeMap = {
	1: 1,
	2: 5,
	3: 10,
	4: 15,
	5: 30,
};

const cheatWaterToTimeMap = {
	1: 1,
	2: 1,
	3: 1,
	4: 1,
	5: 1,
};

function Plot({
	water,
	flower,
	onWater,
	onParticlesDone,
	lastWatered,
	onSeedClick,
	showParticles,
	isHighlighted,
	isTurboMode,
}) {
	const [now, setNow] = useState(Date.now());
	const waterToTimeMap = isTurboMode ? cheatWaterToTimeMap : normalWaterToTimeMap;

	const effectiveNow = Math.max(now, lastWatered);
	const duration = waterToTimeMap[water] || 0;
	const expiry = lastWatered + duration * 1000;
	const remaining = Math.max(0, (expiry - effectiveNow) / 1000);
	const disabled = remaining > 0;

	const clickingRef = useRef(false);

	useEffect(() => {
		if (!disabled) return;

		const id = setInterval(() => {
			const current = Date.now();
			setNow(current);
			if (current >= expiry) {
				clearInterval(id);
			}
		}, 100);

		return () => clearInterval(id);
	}, [disabled, expiry]);

	const handleClick = () => {
		if (clickingRef.current) return;
		clickingRef.current = true;

		setTimeout(() => {
			clickingRef.current = false;
			if (water === -1) {
				onSeedClick();
				return;
			}
			onWater();
		}, 150);
	};
	return (
		<button
			type={"button"}
			className={`plot ${isHighlighted ? "highlight" : ""}`}
			onClick={handleClick}
			disabled={disabled}
		>
			<div className={"flower-wrapper"}>
				{water === -1 && (
					<img src={plus} alt={"seed"} className={"icon-image"} />
				)}
				{water === 0 && (
					<img src={seed} alt={"seed"} className={"icon-image"} />
				)}
				{water === 1 && <span className={"emoji seed"}>🌱</span>}
				{water >= 2 && water < 5 && (
					<span className={`emoji emoji-size-${water}`}>
						🌿
					</span>
				)}
				{water === 5 && <span className={"emoji bloom"}>{flower}</span>}
			</div>

			{showParticles && remaining === 0 && (
				<BloomParticles onDone={onParticlesDone} />
			)}

			<div className={"water-bar"}>
				<div style={{ width: water === -1 ? "0%" : `${(water / 5) * 100}%` }} />
			</div>

			{disabled && (
				<div className={"cooldown"}>
					<div className={"loader"} />
					{Math.ceil(remaining)}s
				</div>
			)}
		</button>
	);
}

export default memo(Plot);
