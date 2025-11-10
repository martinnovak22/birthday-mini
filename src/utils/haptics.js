export function hapticTap() {
	if (navigator.vibrate) navigator.vibrate(10);
}
export function hapticBloom() {
	if (navigator.vibrate) navigator.vibrate([5, 20, 10]);
}
