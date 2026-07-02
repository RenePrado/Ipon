import { fmt } from "../../lib/formatters";
import { getCat } from "../../lib/calculations";

export function RecentTransactions({ transactions, categories }) {
  const recent = [...transactions].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 8);

  return (
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border border-border dark:border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm">Recent Transactions</div>
      </div>
      <div className="space-y-2">
        {recent.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">↕</div>
            <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No transactions yet. Add your first income or expense to get started.</div>
          </div>
        )}
        {recent.map(tx => {
          const cat = getCat(tx.category, categories);
          return (
            <div key={tx.id} className="flex items-center gap-3 p-3 rounded-md border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                tx.type === "income" 
                  ? "bg-success/15 text-success" 
                  : "bg-danger/15 text-danger"
              }`}>
                {cat?.icon || "💸"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm truncate">{tx.note || cat?.name || tx.type}</div>
                <div className="text-text-secondary dark:text-dark-text-secondary text-xs">{cat?.name} · {tx.date}</div>
              </div>
              <div className={`font-mono text-sm font-semibold ${
                tx.type === "income" 
                  ? "text-success" 
                  : "text-danger"
              }`}>
                {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "↔"}{fmt(tx.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
