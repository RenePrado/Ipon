import { fmt, fmtSigned } from "../../lib/formatters";

export function ReportStats({ income, expense, transactionCount }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 border border-border dark:border-dark-border">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Total Income</div>
        <div className="font-mono text-base font-semibold text-success">{fmt(income)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 border border-border dark:border-dark-border">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Total Expenses</div>
        <div className="font-mono text-base font-semibold text-danger">{fmt(expense)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 border border-border dark:border-dark-border">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Net Savings</div>
        <div className={`font-mono text-base font-semibold ${income - expense >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(income - expense)}</div>
      </div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 border border-border dark:border-dark-border">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Transactions</div>
        <div className="font-mono text-base font-semibold text-text-primary dark:text-dark-text-primary">{transactionCount}</div>
      </div>
    </div>
  );
}
