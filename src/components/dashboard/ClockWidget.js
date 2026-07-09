import { useState, useEffect } from "react";

export function ClockWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-lg px-5 py-3 mb-6 flex items-center gap-4">
      <div aria-label="Current local time" aria-live="off" className="text-lg font-semibold tabular-nums text-text-primary dark:text-dark-text-primary tracking-tight whitespace-nowrap">
        {formatTime(currentTime)}
      </div>
      <div className="flex flex-col">
        <div className="text-xs text-text-secondary dark:text-dark-text-secondary leading-tight">
          {formatDate(currentTime)}
        </div>
        <div className="text-[10px] text-text-tertiary dark:text-dark-text-tertiary leading-tight">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
}
