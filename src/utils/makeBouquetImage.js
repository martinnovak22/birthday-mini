export default function makeBouquetImage(blooms, opts = {}) {
	const {
		bgColor = "#fff8fb",
		textColor = "#e91e63",
		fileName = "bouquet.png",
	} = opts;

	const SPACING_X = 100;
	const SPACING_Y = 50;
	const SIZE = 60;
	const PAD = 60;
	const RADIUS = 70;

	const dynamicRadius = Math.max(50, RADIUS - blooms.length * 2);

	const CENTER_X = dynamicRadius + PAD + SPACING_X;
	const CENTER_Y = dynamicRadius + PAD + SPACING_Y;

	const CANVAS_W = CENTER_X * 2;
	const CANVAS_H = CENTER_Y * 2 + PAD;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = CANVAS_W;
	canvas.height = CANVAS_H;

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

	// Header
	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.font = "bold 28px system-ui";
	ctx.fillText("Our Garden Bouquet 💐", CANVAS_W / 2, SPACING_X / 2);

	// Flower positions
	const n = blooms.length || 1;
	const angleStep = (Math.PI * 2) / n;

	const positions = blooms.map((_, i) => {
		const angle = i * angleStep - Math.PI / 2;
		const x = CENTER_X + Math.cos(angle) * dynamicRadius;
		const y = CENTER_Y + Math.sin(angle) * dynamicRadius;
		return { x, y };
	});

	// Stem bottom (unchanged bouquet position)
	const stemBottomX = CANVAS_W / 2;
	const stemBottomY = CENTER_Y * 2; // where stems end before ribbon

	// Natural stems
	positions.forEach((pos) => {
		const cpX = (pos.x + stemBottomX) / 2 + (Math.random() * 40 - 20);
		const cpY = (pos.y + stemBottomY) / 2 - 20;

		const gradient = ctx.createLinearGradient(
			pos.x,
			pos.y,
			stemBottomX,
			stemBottomY,
		);
		gradient.addColorStop(0, "#51a653");
		gradient.addColorStop(1, "#2e7d32");

		ctx.strokeStyle = gradient;
		ctx.lineWidth = 5 + Math.random() * 1.5;
		ctx.lineCap = "round";

		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
		ctx.quadraticCurveTo(cpX, cpY, stemBottomX, stemBottomY);
		ctx.stroke();
	});

	// Ribbon 🎀 slightly higher
	const ribbonY = stemBottomY + 40;

	ctx.font = "90px Arial";
	ctx.textAlign = "center";
	ctx.fillText("🎀", stemBottomX, ribbonY);

	// Flowers
	ctx.font = `${SIZE}px Arial`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	blooms.forEach((b, i) => {
		const pos = positions[i];
		ctx.fillText(b.flower, pos.x, pos.y);
	});

	// Download
	canvas.toBlob((blob) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	});
}
