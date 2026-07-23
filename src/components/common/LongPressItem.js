import { useLongPress } from "../../hooks/useLongPress";

export function LongPressItem({ children, onLongPress, onClick, className }) {
  const { isLongPressing, ...handlers } = useLongPress(onLongPress, onClick, 500);

  const finalClassName = typeof className === 'function' ? className(isLongPressing) : className;

  return (
    <div className={finalClassName} {...handlers}>
      {children}
    </div>
  );
}
