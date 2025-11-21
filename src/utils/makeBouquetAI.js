const EMOJI_FLOWERS = {
	"🌸": "cherry blossom",
	"🌺": "hibiscus",
	"🌻": "sunflower",
	"🏵️": "marigold flower",
	"🌼": "daisy",
	"🪻": "bluebell",
	"🥀": "wilted rose",
	"🌷": "tulip",
	"🌹": "rose",
	"💮": "white flower",
	"🪷": "lotus",
};

export async function makeBouquetAI(blooms) {
	const flowerNames = blooms.map((b) => EMOJI_FLOWERS[b.flower]).join(", ");

	const prompt =
		`A cute emoji-style flower bouquet illustration matching a soft pastel UI. ` +
		`Flowers should look like real Apple/Google emoji icons, with smooth, round, colorful shapes. ` +
		`Use a clean light-pink background, soft shading, and simple outlines. ` +
		`Include curved green stems and a pink ribbon bow at the bottom. ` +
		`The bouquet should contain these exact flower types: ${flowerNames}. ` +
		`Overall aesthetic: kawaii, cheerful, friendly, minimalistic, soft lighting, not realistic.`;

	const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

	const res = await fetch(url, {
		method: "GET",
		mode: "cors",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch bouquet");
	}

	const blob = await res.blob();

	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "bouquet-ai.png";
	a.click();
	URL.revokeObjectURL(a.href);
}
