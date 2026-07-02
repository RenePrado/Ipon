import { CATEGORY_COLORS } from "../../constants";
import { fmt } from "../../lib/formatters";

export function CategoryBreakdown({ transactions, categories, limit = 7, onAddTransaction }) {
  const byCategory = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    const cat = categories.find(c => c.name === t.category);
    const name = cat?.name || "Other";
    byCategory[name] = (byCategory[name] || 0) + Number(t.amount);
  });
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const total = sorted.reduce((s, [, amt]) => s + amt, 0) || 1;
  const max = sorted[0]?.[1] || 1;

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">◎</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">No expenses in this period. Track your spending to see breakdown here.</div>
        {onAddTransaction && (
          <button 
            className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
            onClick={onAddTransaction}
          >
            + Add a transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {sorted.map(([name, amt]) => {
        const color = CATEGORY_COLORS[name] || 'var(--color-category-other)';
        const widthPercent = (amt / max) * 100;
        return (
          <div key={name} className="flex items-center justify-between p-3 bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg mb-2 w-full gap-3">
            <div className="flex items-center gap-2.5 min-w-[120px]">
              <span
                className="inline-block w-2.5 h-2.5 min-w-[10px] rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
                {name}
              </span>
            </div>
            <div className="flex-1 bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${widthPercent}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary whitespace-nowrap font-mono">
                {fmt(amt)}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-secondary dark:text-dark-text-secondary whitespace-nowrap min-w-[42px] text-center">
                {Math.round((amt / total) * 100)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
