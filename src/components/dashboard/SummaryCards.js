import { fmt, fmtSigned } from "../../lib/formatters";

export function SummaryCards({ income, expense, balance, transactionCount }) {
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6 items-stretch">
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border min-h-[80px] sm:min-h-0" style={{ borderBottom: `2px solid ${balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Net Balance</div>
        <div className={`text-lg sm:text-2xl font-semibold tabular-nums ${balance >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(balance)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border min-h-[80px] sm:min-h-0" style={{ borderBottom: '2px solid var(--color-success)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Income</div>
        <div className="text-lg sm:text-2xl font-semibold tabular-nums text-success">{fmt(income)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border min-h-[80px] sm:min-h-0" style={{ borderBottom: '2px solid var(--color-danger)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Expenses</div>
        <div className="text-lg sm:text-2xl font-semibold tabular-nums text-danger">{fmt(expense)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border min-h-[80px] sm:min-h-0" style={{ borderBottom: '2px solid var(--color-accent)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Savings Rate</div>
        <div className="text-lg sm:text-2xl font-semibold tabular-nums text-accent-primary">{savingsRate}%</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-3 sm:p-5 border border-border dark:border-dark-border min-h-[80px] sm:min-h-0" style={{ borderBottom: '2px solid var(--color-text-secondary)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1 sm:mb-2">Transactions</div>
        <div className="text-lg sm:text-2xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{transactionCount}</div>
      </div>
    </div>
  );
}
