import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthStartDay(year, month) {
  return new Date(year, month, 1).getDay();
}

function parseDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

function formatDate({ year, month, day }) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function displayDate(value) {
  if (!value) return "Select date";
  const parsed = parseDate(value);
  if (!parsed) return value;
  const { year, month, day } = parsed;
  return `${String(day).padStart(2, "0")} ${months[month]} ${year}`;
}

export function DatePicker({ value, onChange, placeholder = "Select date", className = "", optional = false }) {
  const [open, setOpen] = useState(false);
  const parsed = parseDate(value);
  const [viewYear, setViewYear] = useState(parsed?.year || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month || new Date().getMonth());
  const ref = useRef(null);

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [value]);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const select = (day) => {
    const next = formatDate({ year: viewYear, month: viewMonth, day });
    onChange(next);
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange("");
    setOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDay = getMonthStartDay(viewYear, viewMonth);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const shiftMonth = (delta) => {
    let nextMonth = viewMonth + delta;
    let nextYear = viewYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setViewMonth(nextMonth);
    setViewYear(nextYear);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="truncate">{value ? displayDate(value) : placeholder}</span>
        <Calendar size={14} className="flex-shrink-0 text-text-tertiary dark:text-dark-text-tertiary" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-md p-3 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="p-1 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-medium text-text-primary dark:text-dark-text-primary tabular-nums">
              {months[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="p-1 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {days.map(d => (
              <div key={d} className="text-center text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="h-8" />;
              const key = formatDate({ year: viewYear, month: viewMonth, day });
              const selected = value === key;
              const isToday = key === todayKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => select(day)}
                  className={`h-8 w-full rounded text-xs font-medium transition-colors ${
                    selected
                      ? "bg-accent-primary text-white"
                      : isToday
                        ? "border border-accent-primary text-text-primary dark:text-dark-text-primary"
                        : "text-text-primary dark:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-border dark:border-dark-border">
            {optional ? (
              <button
                type="button"
                onClick={clear}
                className="text-xs text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              >
                Clear
              </button>
            ) : <div />}
            <button
              type="button"
              onClick={() => select(today.getDate())}
              className="text-xs text-accent-primary dark:text-dark-accent-primary hover:underline transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
