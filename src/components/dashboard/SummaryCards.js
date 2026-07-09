import { fmt, fmtSigned } from "../../lib/formatters";

export function SummaryCards({ income, expense, balance, transactionCount }) {
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="grid grid-cols-5 gap-3 mb-6 items-stretch" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border" style={{ borderBottom: `2px solid ${balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-2">Net Balance</div>
        <div className={`text-2xl font-semibold tabular-nums ${balance >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(balance)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border" style={{ borderBottom: '2px solid var(--color-success)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-2">Income</div>
        <div className="text-2xl font-semibold tabular-nums text-success">{fmt(income)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border" style={{ borderBottom: '2px solid var(--color-danger)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-2">Expenses</div>
        <div className="text-2xl font-semibold tabular-nums text-danger">{fmt(expense)}</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border" style={{ borderBottom: '2px solid var(--color-accent)' }}>
        <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-2">Savings Rate</div>
        <div className="text-2xl font-semibold tabular-nums text-accent-primary">{savingsRate}%</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">
        <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-2">Transactions</div>
        <div className="text-2xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{transactionCount}</div>
      </div>
    </div>
  );
}
