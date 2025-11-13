export default function makeBouquetImage(blooms, opts = {}) {
	const {
		bgColor = "#fff8fb",
		textColor = "#e91e63",
		title = "With love, always.",
		fileName = "bouquet.png",
	} = opts;

	const SIZE = 60; // emoji box size - reduced for tighter spacing
	const PAD = 30; // outer padding - increased for better margins
	const COLS = 9; // flowers per row
	const HEADER_SPACE = 70; // space for header
	const FOOTER_SPACE = 50; // space for footer
	const rows = Math.ceil(blooms.length / COLS) || 1;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const W = COLS * SIZE + 2 * PAD;
	const H = rows * SIZE + 2 * PAD + HEADER_SPACE + FOOTER_SPACE;

	canvas.width = W;
	canvas.height = H;

	// background
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, W, H);

	// header text
	ctx.font = "bold 28px system-ui, Segoe UI, Roboto, Helvetica, Arial";
	ctx.fillStyle = textColor;
	ctx.textAlign = "center";
	ctx.fillText("Our Garden Bouquet 💐", W / 2, PAD + 35);

	// flowers
	ctx.font = "75px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	blooms.forEach((b, i) => {
		const row = Math.floor(i / COLS);
		const col = i % COLS;
		const inThisRow = Math.min(COLS, blooms.length - row * COLS);
		const offsetX = (W - inThisRow * SIZE) / 2;
		const x = offsetX + col * SIZE + SIZE / 2;
		const y = PAD + HEADER_SPACE + row * SIZE + SIZE / 2;
		ctx.fillText(b.flower, x, y);
	});

	// footer text
	ctx.font = "20px system-ui";
	ctx.fillText(title, W / 2, H - PAD - 15);

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
