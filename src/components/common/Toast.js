import { useEffect } from "react";

export function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div role="alert" aria-live="polite" className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border text-sm font-medium ${
      type === "success" 
        ? "bg-bg-elevated dark:bg-dark-bg-elevated text-success border-success/40" 
        : "bg-bg-elevated dark:bg-dark-bg-elevated text-danger border-danger/40"
    }`}>
      {msg}
    </div>
  );
}
