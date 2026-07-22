import { useState } from "react";
import { fmt } from "../../lib/formatters";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DailyActivity({ byDay }) {
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;
  const entries = Object.entries(byDay).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  const totalPages = Math.ceil(entries.length / PER_PAGE) || 1;
  const start = (currentPage - 1) * PER_PAGE;
  const visible = entries.slice(start, start + PER_PAGE);
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border">
      <div className="text-text-secondary dark:text-dark-text-secondary text-xs sm:text-sm font-medium uppercase tracking-wider mb-3 sm:mb-4">Daily Activity</div>
      <div className="flex flex-col gap-0">
        {Object.keys(byDay).length === 0 && (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No activity in this period</div>
          </div>
        )}
        {visible.map(([date, val]) => (
          <div key={date} className="flex justify-between items-center py-2 sm:py-2.5 border-b border-border dark:border-dark-border last:border-b-0">
            <div className="text-[10px] sm:text-xs text-text-secondary dark:text-dark-text-secondary">{date}</div>
            <div className="flex gap-4">
              {val.income > 0 && <span className="text-[10px] sm:text-xs font-medium tabular-nums text-success">+{fmt(val.income)}</span>}
              {val.expense > 0 && <span className="text-[10px] sm:text-xs font-medium tabular-nums text-danger">-{fmt(val.expense)}</span>}
            </div>
          </div>
        ))}
        {entries.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border dark:border-dark-border">
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
    </div>
  );
}
