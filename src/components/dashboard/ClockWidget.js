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
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-lg p-4 mb-5 flex justify-between items-center shadow-md">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary dark:text-dark-text-tertiary mb-1">
          Local Time
        </div>
        <div aria-label="Current local time" aria-live="off" className="text-2xl font-bold font-mono text-text-primary dark:text-dark-text-primary tracking-tight">
          {formatTime(currentTime)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-text-secondary dark:text-dark-text-secondary mb-0.5">
          {formatDate(currentTime)}
        </div>
        <div className="text-[10px] text-text-tertiary dark:text-dark-text-tertiary">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
}
