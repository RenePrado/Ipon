import { useEffect } from "react";

export function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div role="alert" aria-live="polite" className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium ${
      type === "success" 
        ? "bg-success/15 text-success border-success" 
        : "bg-danger/15 text-danger border-danger"
    }`}>
      {msg}
    </div>
  );
}
