import { useRef, useState } from "react";

export function useLongPress(onLongPress, onClick, threshold = 500) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timerRef = useRef(null);
  const isMovedRef = useRef(false);

  const start = (e) => {
    isMovedRef.current = false;
    setIsLongPressing(false);
    timerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress(e);
    }, threshold);
  };

  const move = () => {
    isMovedRef.current = true;
  };

  const end = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isLongPressing && !isMovedRef.current) {
      onClick(e);
    }
    setIsLongPressing(false);
  };

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsLongPressing(false);
  };

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onTouchCancel: cancel,
    isLongPressing,
  };
}
