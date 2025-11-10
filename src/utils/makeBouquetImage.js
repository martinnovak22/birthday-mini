export default function makeBouquetImage(blooms, opts = {}) {
	const {
		bgColor = "#fff8fb",
		textColor = "#e91e63",
		title = "With love, always.",
		fileName = "bouquet.png",
	} = opts;

	const SIZE = 120; // emoji box size
	const PAD = 20; // outer padding
	const COLS = 6; // flowers per row
	const rows = Math.ceil(blooms.length / COLS) || 1;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const W = COLS * SIZE + 2 * PAD;
	const H = rows * SIZE + 2 * PAD + 80; // extra space for header/title

	canvas.width = W;
	canvas.height = H;

	// background
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, W, H);

	// header text
	ctx.font = "bold 28px system-ui, Segoe UI, Roboto, Helvetica, Arial";
	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.fillText("Our Garden Bouquet 💐", W / 2, PAD + 30);

	// flowers
	ctx.font = "80px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	blooms.forEach((b, i) => {
		const row = Math.floor(i / COLS);
		const col = i % COLS;
		const inThisRow = Math.min(COLS, blooms.length - row * COLS);
		const offsetX = (W - inThisRow * SIZE) / 2;
		const x = offsetX + col * SIZE + SIZE / 2;
		const y = PAD + 80 + row * SIZE + SIZE / 2;
		ctx.fillText(b.flower, x, y);
	});

	// footer text
	ctx.font = "20px system-ui";
	ctx.fillText(title, W / 2, H - PAD - 10);

	// download
	canvas.toBlob((blob) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	}, "image/png");
}
