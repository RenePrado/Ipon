import { useState, useEffect, useRef } from "react";
import { fmt } from "../../lib/formatters";
import { getCat } from "../../lib/calculations";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 5;

export function RecentTransactions({ transactions, categories }) {
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef(null);

  const sorted = [...transactions].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [transactions, totalPages, currentPage]);

  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = sorted.slice(start, start + PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border border-border dark:border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm">Recent Transactions</div>
      </div>
      <div ref={listRef} className="space-y-2 max-h-[360px] overflow-y-auto">
        {pageItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">↕</div>
            <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No transactions yet. Add your first income or expense to get started.</div>
          </div>
        )}
        {pageItems.map(tx => {
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
      {sorted.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border dark:border-dark-border">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-1.5 rounded-md text-text-secondary dark:text-dark-text-secondary hover:text-accent-primary dark:hover:text-accent-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary dark:disabled:hover:text-dark-text-secondary"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-md text-text-secondary dark:text-dark-text-secondary hover:text-accent-primary dark:hover:text-accent-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary dark:disabled:hover:text-dark-text-secondary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
