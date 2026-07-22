import { useState, useEffect, useRef } from "react";
import { fmt } from "../../lib/formatters";
import { getCat } from "../../lib/calculations";
import { ChevronLeft, ChevronRight, Pencil, X } from "lucide-react";
import { LongPressItem } from "../common/LongPressItem";

const PER_PAGE = 5;

export function RecentTransactions({ transactions, categories, onEdit, onDelete }) {
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
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-text-secondary dark:text-dark-text-secondary text-[13px] sm:text-sm font-medium uppercase tracking-wider">Recent Transactions</div>
      </div>
      <div ref={listRef} className="max-h-[360px] overflow-y-auto">
        {pageItems.length === 0 && (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No transactions this month</div>
          </div>
        )}
        {pageItems.map(tx => {
          const cat = getCat(tx.category, categories);
          return (
            <LongPressItem
              key={tx.id}
              onLongPress={() => onDelete?.(tx)}
              onClick={() => onEdit?.(tx)}
              className={(isLongPressing) => `flex items-center justify-between py-3 border-b border-border dark:border-dark-border last:border-b-0 group cursor-pointer ${isLongPressing ? 'bg-bg-elevated-2 dark:bg-dark-bg-elevated-2' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-text-primary dark:text-dark-text-primary text-sm font-medium truncate">{tx.note || cat?.name || tx.type}</div>
                <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-0.5">{cat?.name} · {tx.date}</div>
              </div>
              <div className={`text-sm font-semibold tabular-nums whitespace-nowrap ml-4 mr-4 ${
                tx.type === "income"
                  ? "text-success"
                  : "text-danger"
              }`}>
                {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}{fmt(tx.amount)}
              </div>
              <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                  onClick={e => { e.stopPropagation(); onEdit?.(tx); }}
                  aria-label="Edit transaction"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-danger transition-colors"
                  onClick={e => { e.stopPropagation(); onDelete?.(tx); }}
                  aria-label="Delete transaction"
                >
                  <X size={14} />
                </button>
              </div>
            </LongPressItem>
          );
        })}
      </div>
      {sorted.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border dark:border-dark-border px-0">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-1.5 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary whitespace-nowrap tabular-nums">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="p-1.5 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
