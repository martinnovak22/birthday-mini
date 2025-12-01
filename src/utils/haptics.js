export function hapticTap() {
	if (navigator.vibrate) navigator.vibrate(30);
}
export function hapticBloom() {
	if (navigator.vibrate) navigator.vibrate([40, 30, 60]);
}
