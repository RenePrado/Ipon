import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function MonthPicker({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value?.split("-")[0]) || new Date().getFullYear());
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const select = (monthIndex) => {
    const next = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    onChange(next);
    setOpen(false);
  };

  const display = value
    ? `${months[Number(value.split("-")[1]) - 1]} ${value.split("-")[0]}`
    : "Select month";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="truncate">{display}</span>
        <Calendar size={14} className="flex-shrink-0 text-text-tertiary dark:text-dark-text-tertiary" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-md p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setYear(y => y - 1)}
              className="p-1 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
              aria-label="Previous year"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-medium text-text-primary dark:text-dark-text-primary tabular-nums">{year}</div>
            <button
              type="button"
              onClick={() => setYear(y => y + 1)}
              className="p-1 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
              aria-label="Next year"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {months.map((m, i) => {
              const selected = value === `${year}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => select(i)}
                  className={`px-2 py-2 rounded text-xs font-medium transition-colors ${
                    selected
                      ? "bg-accent-primary text-white"
                      : "text-text-primary dark:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
