import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref, isActive) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    triggerRef.current = document.activeElement;

    const focusable = ref.current.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== "Tab" || !ref.current) return;

      const elements = ref.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
      }
    };
  }, [isActive, ref]);
}
