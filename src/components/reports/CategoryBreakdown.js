import { CATEGORY_COLORS } from "../../constants";
import { fmt } from "../../lib/formatters";
import { getCat } from "../../lib/calculations";

export function CategoryBreakdown({ transactions, categories, limit = 7 }) {
  const byCategory = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    const cat = getCat(t.category, categories);
    const name = cat?.name || "Other";
    byCategory[name] = (byCategory[name] || 0) + Number(t.amount);
  });
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const total = sorted.reduce((s, [, amt]) => s + amt, 0) || 1;
  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No expenses in this period</div>
      </div>
    );
  }
  return (
    <div>
      {sorted.map(([name, amt]) => {
        const color = CATEGORY_COLORS[name] || 'var(--color-category-other)';
        const widthPercent = (amt / total) * 100;
        return (
          <div key={name} className="flex items-center gap-3 py-2.5 border-b border-border dark:border-dark-border last:border-b-0 w-full overflow-hidden">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs sm:text-sm text-text-secondary dark:text-dark-text-secondary whitespace-nowrap flex-shrink-0 min-w-[70px] sm:min-w-[110px]">
              {name}
            </span>
            <div className="flex-1 bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full overflow-hidden" style={{ height: '8px' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${widthPercent}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 justify-end min-w-[70px] sm:min-w-[100px]">
              <span className="text-xs sm:text-sm font-semibold text-text-primary dark:text-dark-text-primary whitespace-nowrap tabular-nums">
                {fmt(amt)}
              </span>
              <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-secondary dark:text-dark-text-secondary whitespace-nowrap text-center tabular-nums min-w-[38px] sm:min-w-[42px]">
                {Math.round((amt / total) * 100)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
