import { useRef } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  const modalRef = useRef(null);
  useEscapeKey(onCancel);
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div ref={modalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-6 w-full max-w-md border border-border dark:border-dark-border shadow-lg" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div id="confirm-dialog-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-4">{title}</div>
        <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-5 leading-relaxed">
          {message}
        </div>
        <div className="flex gap-3 justify-end">
          <button 
            className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-md bg-danger hover:bg-danger/90 text-white text-sm font-medium border border-transparent transition-colors" 
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
