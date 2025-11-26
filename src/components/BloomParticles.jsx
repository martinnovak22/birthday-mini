import { useEffect, useRef } from "react";
import heartSvg from "../assets/webicon.svg";

export default function BloomParticles({ onDone }) {
	const canvas = useRef(null);
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		const ctx = canvas.current.getContext("2d");
		const rect = canvas.current.parentElement.getBoundingClientRect();
		canvas.current.width = rect.width;
		canvas.current.height = rect.height;

		const W = canvas.current.width;
		const H = canvas.current.height;

		const img = new Image();
		img.src = heartSvg;

		const drops = Array.from({ length: 60 }, () => ({
			x: Math.random() * W,
			y: Math.random() * H - H,
			vy: 2 + Math.random() * 3,
			color: `hsla(${300 + Math.random() * 60}, 90%, 70%, 0.8)`,
			size: 10 + Math.random() * 15,
		}));

		let rid;

		img.onload = () => {
			function animate() {
				ctx.clearRect(0, 0, W, H);
				let live = false;
				for (const d of drops) {
					d.y += d.vy;
					if (d.y < H) {
						live = true;
						ctx.save();
						ctx.globalAlpha = 0.8;
						ctx.drawImage(
							img,
							d.x - d.size / 2,
							d.y - d.size / 2,
							d.size,
							d.size,
						);
						ctx.restore();
					}
				}
				if (live) rid = requestAnimationFrame(animate);
				else onDone();
			}
			animate();
		};

		return () => cancelAnimationFrame(rid);
	}, [onDone]);

	return <canvas ref={canvas} className="particles" />;
}
