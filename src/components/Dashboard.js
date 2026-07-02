import { useMemo } from "react";
import { thisMonth } from "../lib/formatters";
import { CategoryBreakdown } from "./reports/CategoryBreakdown";
import { ClockWidget } from "./dashboard/ClockWidget";
import { SummaryCards } from "./dashboard/SummaryCards";
import { AIInsights } from "./AIInsights";
import { RecentTransactions } from "./dashboard/RecentTransactions";

export function Dashboard({ transactions, categories, insight, insightError, insightStale, onLoadInsight, insightLoading }) {
  const month = thisMonth();
  const { monthTx, income, expense, balance } = useMemo(() => {
    const monthTx = transactions.filter(t => t.date?.startsWith(month));
    const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const balance = income - expense;
    return { monthTx, income, expense, balance };
  }, [transactions, month]);

  return (
    <div>
      <ClockWidget />
      <SummaryCards income={income} expense={expense} balance={balance} transactionCount={monthTx.length} />

      <div className="grid grid-cols-2 gap-3">
        <RecentTransactions transactions={transactions} categories={categories} />

        <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border border-border dark:border-dark-border">
          <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm mb-3">Spending by Category</div>
          <div className="mt-4">
            <CategoryBreakdown transactions={monthTx} categories={categories} limit={7} />
          </div>
          <AIInsights insight={insight} insightError={insightError} insightStale={insightStale} onLoadInsight={onLoadInsight} insightLoading={insightLoading} />
        </div>
      </div>
    </div>
  );
}
