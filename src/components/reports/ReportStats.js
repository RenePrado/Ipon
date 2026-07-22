import { fmt, fmtSigned } from "../../lib/formatters";

export function ReportStats({ income, expense, transactionCount }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border" style={{ borderBottom: '2px solid var(--color-success)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Total Income</div>
        <div className="text-base sm:text-xl font-semibold tabular-nums text-success">{fmt(income)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border" style={{ borderBottom: '2px solid var(--color-danger)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Total Expenses</div>
        <div className="text-base sm:text-xl font-semibold tabular-nums text-danger">{fmt(expense)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border" style={{ borderBottom: `2px solid ${income - expense >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Net Savings</div>
        <div className={`text-base sm:text-xl font-semibold tabular-nums ${income - expense >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(income - expense)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border">
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Transactions</div>
        <div className="text-base sm:text-xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{transactionCount}</div>
      </div>
    </div>
  );
}
