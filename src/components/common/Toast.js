import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  const isSuccess = type === "success";
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-2.5 w-80 px-4 py-3 rounded-lg border shadow-lg text-sm ${
        isSuccess
          ? "bg-bg-elevated dark:bg-dark-bg-elevated text-success border-success/40"
          : "bg-bg-elevated dark:bg-dark-bg-elevated text-danger border-danger/40"
      }`}
    >
      {isSuccess ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="mt-0.5 flex-shrink-0" />}
      <span className="leading-snug">{msg}</span>
    </div>
  );
}
