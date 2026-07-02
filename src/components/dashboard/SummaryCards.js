import { fmt, fmtSigned } from "../../lib/formatters";

export function SummaryCards({ income, expense, balance, transactionCount }) {
  // Guard against division by zero: if income is 0, savings rate is 0%
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="grid grid-cols-5 gap-3 mb-5 items-stretch overflow-x-auto">
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border-t-2 border border-border dark:border-dark-border min-w-[160px]" style={{ borderTopColor: balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Net Balance</div>
        <div className={`font-mono text-xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(balance)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border-t-2 border border-border dark:border-dark-border min-w-[160px]" style={{ borderTopColor: 'var(--color-success)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Income</div>
        <div className="font-mono text-xl font-bold text-success">{fmt(income)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border-t-2 border border-border dark:border-dark-border min-w-[160px]" style={{ borderTopColor: 'var(--color-danger)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Expenses</div>
        <div className="font-mono text-lg font-semibold text-danger">{fmt(expense)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border-t-2 border border-border dark:border-dark-border min-w-[160px]" style={{ borderTopColor: 'var(--color-accent-secondary)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Savings Rate</div>
        <div className="font-mono text-lg font-semibold text-accent-secondary">{savingsRate}%</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">Of income saved</div>
      </div>

      <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-lg p-4 border border-border dark:border-dark-border min-w-[160px]">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Transactions</div>
        <div className="font-mono text-base font-medium text-text-secondary dark:text-dark-text-secondary">{transactionCount}</div>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mt-1">This month</div>
      </div>
    </div>
  );
}
