export function AIInsights({ insight, insightError, insightStale, onLoadInsight, insightLoading }) {
  return (
    <>
      <div className="border-t border-border dark:border-dark-border my-4" />
      <div className="flex gap-2">
        <button 
          className="flex-1 px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors duration-300" 
          onClick={() => onLoadInsight(false)} 
          disabled={insightLoading} 
          aria-label="Get AI Insights"
        >
          {insightLoading ? "Analyzing..." : "✦ Get AI Insights"}
        </button>
        {insight && !insightLoading && (
          <button 
            className="px-3 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-secondary dark:text-dark-text-secondary text-sm border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors duration-300" 
            onClick={() => onLoadInsight(true)} 
            disabled={insightLoading}
            aria-label="Refresh AI Insights"
            title="Refresh"
          >
            ↻
          </button>
        )}
      </div>
      {!insightLoading && insightError && !insightStale && (
        <div className="mt-3 p-3 bg-danger/10 border border-danger/30 rounded-md text-sm text-danger leading-relaxed flex items-start gap-2">
          <span className="flex-shrink-0 text-base leading-tight">⚠</span>
          <span>{insightError}</span>
        </div>
      )}
      {!insightLoading && insightStale && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/30 rounded-md text-xs text-warning leading-relaxed flex items-start gap-2">
          <span className="flex-shrink-0 text-sm leading-tight">⚠</span>
          <span>Showing cached insight — {insightError}</span>
        </div>
      )}
      {!insightLoading && !insightError && insight && (
        <div className="mt-3 p-3 bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border rounded-md max-h-[120px] overflow-y-auto text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
          {insight}
        </div>
      )}
    </>
  );
}
