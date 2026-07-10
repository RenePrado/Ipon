import { useMemo, useState } from "react";
import { thisMonth } from "../lib/formatters";
import { CategoryBreakdown } from "./reports/CategoryBreakdown";
import { ClockWidget } from "./dashboard/ClockWidget";
import { SummaryCards } from "./dashboard/SummaryCards";
import { RecentTransactions } from "./dashboard/RecentTransactions";
import { TxModal } from "./TxModal";
import { ConfirmDialog } from "./common/ConfirmDialog";

export function Dashboard({ transactions, categories, onUpdate, onDelete }) {
  const month = thisMonth();
  const { monthTx, income, expense, balance } = useMemo(() => {
    const monthTx = transactions.filter(t => t.date?.startsWith(month));
    const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const balance = income - expense;
    return { monthTx, income, expense, balance };
  }, [transactions, month]);

  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);

  return (
    <div>
      <ClockWidget />
      <SummaryCards income={income} expense={expense} balance={balance} transactionCount={monthTx.length} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <RecentTransactions transactions={transactions} categories={categories} onEdit={setEditTx} onDelete={setDeleteTx} />

        <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">
          <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-4">Spending by Category</div>
          <div>
            <CategoryBreakdown transactions={monthTx} categories={categories} limit={7} />
          </div>
        </div>
      </div>

      {editTx && (
        <TxModal
          tx={editTx}
          categories={categories}
          onSave={async (form) => { await onUpdate(editTx.id, form); setEditTx(null); }}
          onClose={() => setEditTx(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTx}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This cannot be undone."
        onConfirm={() => { onDelete(deleteTx.id); setDeleteTx(null); }}
        onCancel={() => setDeleteTx(null)}
      />
    </div>
  );
}
