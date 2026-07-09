import { fmt, fmtSigned } from "../../lib/formatters";
import { ArrowUpDown } from "lucide-react";

export function SummaryCards({ income, expense, balance, transactionCount }) {
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="grid grid-cols-5 gap-3 mb-5 items-stretch" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border-t-2 border border-border dark:border-dark-border" style={{ borderTopColor: balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Net Balance</div>
        <div className={`font-mono text-xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>{fmtSigned(balance)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border-t-2 border border-border dark:border-dark-border" style={{ borderTopColor: 'var(--color-success)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Income</div>
        <div className="font-mono text-xl font-bold text-success">{fmt(income)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border-t-2 border border-border dark:border-dark-border" style={{ borderTopColor: 'var(--color-danger)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Expenses</div>
        <div className="font-mono text-lg font-semibold text-danger">{fmt(expense)}</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border-t-2 border border-border dark:border-dark-border" style={{ borderTopColor: 'var(--color-accent-secondary)' }}>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Savings Rate</div>
        <div className="font-mono text-lg font-semibold text-accent-secondary">{savingsRate}%</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">Of income saved</div>
      </div>

      <div className="bg-bg-elevated dark:bg-dark-bg-elevated shadow-card dark:shadow-dark-card rounded-lg p-4 border border-border dark:border-dark-border">
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-1">Transactions</div>
        <div className="flex items-center gap-2 mt-1">
          <ArrowUpDown size={18} className="text-text-tertiary dark:text-dark-text-tertiary flex-shrink-0" />
          <div className="font-mono text-xl font-bold text-text-primary dark:text-dark-text-primary">{transactionCount}</div>
        </div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-1">This month</div>
      </div>
    </div>
  );
}
