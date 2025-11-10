import { useEffect, useRef } from "react";

export default function BloomParticles({ onDone }) {
	const canvas = useRef(null);

	useEffect(() => {
		const ctx = canvas.current.getContext("2d");
		const W = ctx.canvas.width;
		const H = ctx.canvas.height;
		const drops = Array.from({ length: 60 }, () => ({
			x: Math.random() * W,
			y: Math.random() * H - H,
			vy: 2 + Math.random() * 3,
			color: `hsla(${300 + Math.random() * 60}, 90%, 70%, 0.8)`,
			size: 2 + Math.random() * 3,
		}));

		let rid;
		function animate() {
			ctx.clearRect(0, 0, W, H);
			let live = false;
			for (const d of drops) {
				d.y += d.vy;
				if (d.y < H) {
					live = true;
					ctx.beginPath();
					ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
					ctx.fillStyle = d.color;
					ctx.fill();
				}
			}
			if (live) rid = requestAnimationFrame(animate);
			else onDone();
		}
		animate();
		return () => cancelAnimationFrame(rid);
	}, [onDone]);

	return <canvas ref={canvas} className="particles" />;
}
