import { useState } from "react";
import { thisMonth, fmt } from "../lib/formatters";
import { getCat } from "../lib/calculations";
import { TxModal } from "./TxModal";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { Pencil, X } from "lucide-react";
import { CustomSelect } from "./common/CustomSelect";
import { MonthPicker } from "./common/MonthPicker";

export function Transactions({ transactions, categories, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState({ type: "all", search: "", month: thisMonth() });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);


  const filtered = transactions.filter(tx => {
    if (filter.type !== "all" && tx.type !== filter.type) return false;
    if (filter.month && !tx.date?.startsWith(filter.month)) return false;
    if (filter.search) {
      const cat = getCat(tx.category, categories);
      const q = filter.search.toLowerCase();
      const amountStr = String(tx.amount);
      if (!(tx.note?.toLowerCase().includes(q) || cat?.name?.toLowerCase().includes(q) || amountStr.includes(q))) return false;
    }
    return true;
  }).sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const visible = filtered.slice(0, visibleCount);

  const handleSave = async (form) => {
    if (modal === "new") await onCreate(form);
    else await onUpdate(modal.id, form);
    setModal(null);
  };

  return (
    <div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg border border-border dark:border-dark-border p-5">
        {/* Filter bar header */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-4 mb-4 border-b border-border dark:border-dark-border">
          <div className="flex gap-2 flex-wrap">
            <input
              placeholder="Search..."
              value={filter.search}
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
              className="max-w-[200px] px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
            />
            <MonthPicker
              value={filter.month}
              onChange={v => setFilter(f => ({ ...f, month: v }))}
              className="w-40"
            />
            <CustomSelect
              value={filter.type}
              onChange={v => setFilter(f => ({ ...f, type: v }))}
              options={[
                { value: "all", label: "All Types" },
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
              ]}
              className="max-w-[140px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary whitespace-nowrap tabular-nums">
              {filtered.length} {filtered.length === 1 ? "transaction" : "transactions"}
            </span>
            <button
              className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
              onClick={() => setModal("new")}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Transaction list */}
        <div>
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-12 text-center">
              <div className="text-text-secondary dark:text-dark-text-secondary text-sm">
                {filter.search || filter.type !== "all" || filter.month !== thisMonth()
                  ? "No matching transactions found"
                  : "No transactions this month"}
              </div>
            </div>
          )}
          {visible.map(tx => {
            const cat = getCat(tx.category, categories);
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-border dark:border-dark-border last:border-b-0 hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors cursor-pointer -mx-2 px-2 rounded group"
                onClick={() => setModal(tx)}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-text-primary dark:text-dark-text-primary text-sm font-medium truncate">{tx.note || cat?.name || tx.type}</div>
                  <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-0.5">{cat?.name} · {tx.date}</div>
                </div>
                <div className={`text-sm font-semibold tabular-nums whitespace-nowrap mr-3 ${
                  tx.type === "income"
                    ? "text-success"
                    : "text-danger"
                }`}>
                  {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}{fmt(tx.amount)}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                    onClick={e => { e.stopPropagation(); setModal(tx); }}
                    aria-label="Edit transaction"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-danger transition-colors"
                    onClick={e => { e.stopPropagation(); setDeleteConfirm(tx); }}
                    aria-label="Delete transaction"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                className="px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                onClick={() => setVisibleCount(c => c + 20)}
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <TxModal
          tx={modal === "new" ? null : modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This cannot be undone."
          onConfirm={() => { onDelete(deleteConfirm.id); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
