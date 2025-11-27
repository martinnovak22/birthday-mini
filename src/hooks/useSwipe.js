import { useEffect, useRef } from "react";

export function useSwipe({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 70,
}) {
    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    useEffect(() => {
        const onTouchStart = (e) => {
            touchEnd.current = null;
            touchStart.current = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY,
            };
        };

        const onTouchMove = (e) => {
            touchEnd.current = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY,
            };
        };

        const onTouchEnd = () => {
            if (!touchStart.current || !touchEnd.current) return;

            const distanceX = touchStart.current.x - touchEnd.current.x;
            const distanceY = touchStart.current.y - touchEnd.current.y;
            const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

            if (isHorizontal) {
                if (Math.abs(distanceX) > threshold) {
                    if (distanceX > 0) {
                        onSwipeLeft?.();
                    } else {
                        onSwipeRight?.();
                    }
                }
            } else {
                if (Math.abs(distanceY) > threshold) {
                    if (distanceY > 0) {
                        onSwipeUp?.();
                    } else {
                        onSwipeDown?.();
                    }
                }
            }
        };

        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);

        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);
}
