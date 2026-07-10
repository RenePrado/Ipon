import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function CustomSelect({ value, onChange, options, placeholder = "Select", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className="flex-shrink-0 text-text-tertiary dark:text-dark-text-tertiary" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[140px] bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-md overflow-hidden">
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                o.value === value
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-primary dark:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2"
              }`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
