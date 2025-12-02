class SoundGenerator {
	constructor() {
		this.audioContext = null;
	}

	getContext() {
		if (!this.audioContext) {
			this.audioContext = new (
				window.AudioContext || window.webkitAudioContext
			)();
		}
		return this.audioContext;
	}

	// Warm click: soft attack, fast decay, slight pitch drop
	playClick() {
		try {
			const ctx = this.getContext();

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.type = "sine";

			osc.frequency.setValueAtTime(320, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.025);

			gain.gain.setValueAtTime(0.0001, ctx.currentTime);
			gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.002);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.035);
		} catch (err) {
			console.warn("Sound playback failed:", err);
		}
	}

	// Grow: rising tone with gentle fade-out
	playGrow() {
		try {
			const ctx = this.getContext();

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.type = "sine";
			osc.frequency.setValueAtTime(280, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.25);

			gain.gain.setValueAtTime(0.15, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.25);
		} catch (err) {
			console.warn("Sound playback failed:", err);
		}
	}

	// Bloom: cheerful and calming, soft layered harmony
	playBloom() {
		try {
			const ctx = this.getContext();

			const playTone = (freq, delay, duration) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.type = "triangle";
				osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

				gain.gain.setValueAtTime(0, ctx.currentTime + delay);
				gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.025);
				gain.gain.exponentialRampToValueAtTime(
					0.01,
					ctx.currentTime + delay + duration,
				);

				osc.start(ctx.currentTime + delay);
				osc.stop(ctx.currentTime + delay + duration);
			};

			playTone(440, 0, 0.32);
			playTone(554.37, 0.06, 0.36);
			playTone(659.25, 0.12, 0.4);
		} catch (err) {
			console.warn("Sound playback failed:", err);
		}
	}
}

export const soundGenerator = new SoundGenerator();
