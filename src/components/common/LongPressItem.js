import { useLongPress } from "../../hooks/useLongPress";

export function LongPressItem({ children, onLongPress, onClick, className }) {
  const longPress = useLongPress(onLongPress, onClick, 500);

  const finalClassName = typeof className === 'function' ? className(longPress.isLongPressing) : className;

  return (
    <div className={finalClassName} {...longPress}>
      {children}
    </div>
  );
}
