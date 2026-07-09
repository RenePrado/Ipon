import { useState } from "react";
import { thisMonth, fmt } from "../lib/formatters";
import { getCat } from "../lib/calculations";
import { TxModal } from "./TxModal";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { Pencil } from "lucide-react";

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
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg border border-border dark:border-dark-border p-4">
        {/* Filter bar header */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3 mb-3 border-b border-border dark:border-dark-border">
          <div className="flex gap-2 flex-wrap">
            <input 
              placeholder="Search..." 
              value={filter.search} 
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} 
              className="max-w-[200px] px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary" 
            />
            <input 
              type="month" 
              value={filter.month} 
              onChange={e => setFilter(f => ({ ...f, month: e.target.value }))} 
              className="max-w-[160px] px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary" 
            />
            <select 
              value={filter.type} 
              onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} 
              className="max-w-[140px] px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
              {filtered.length} {filtered.length === 1 ? "transaction" : "transactions"}
            </span>
            <button 
              className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
              onClick={() => setModal("new")}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Transaction list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">↕</div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">
                {filter.search || filter.type !== "all" || filter.month !== thisMonth() 
                  ? "No matching transactions found. Try adjusting your filters." 
                  : "No transactions found. Add your first income or expense to get started."}
              </div>
              {!filter.search && filter.type === "all" && filter.month === thisMonth() && (
                <button 
                  className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
                  onClick={() => setModal("new")}
                >
                  + Add your first transaction
                </button>
              )}
            </div>
          )}
          {visible.map(tx => {
            const cat = getCat(tx.category, categories);
            return (
              <div 
                key={tx.id} 
                className="flex items-center gap-3 p-3 rounded-md border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 cursor-pointer transition-colors duration-300"
                onClick={() => setModal(tx)}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                  tx.type === "income" 
                    ? "bg-success/15 text-success" 
                    : "bg-danger/15 text-danger"
                }`}>
                  {cat?.icon || "💸"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm truncate">{tx.note || cat?.name || tx.type}</div>
                  <div className="text-text-secondary dark:text-dark-text-secondary text-xs">{cat?.name} · {tx.date}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.type === "income" 
                    ? "bg-success/15 text-success" 
                    : "bg-danger/15 text-danger"
                }`}>
                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                </span>
                <div className={`font-mono text-sm font-semibold text-right min-w-[80px] ${
                  tx.type === "income" 
                    ? "text-success" 
                    : "text-danger"
                }`}>
                  {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "↔"}{fmt(tx.amount)}
                </div>
                <button 
                  className="p-2 rounded-md text-text-tertiary dark:text-dark-text-tertiary hover:text-accent-primary dark:hover:text-accent-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                  onClick={e => { e.stopPropagation(); setModal(tx); }} 
                  aria-label="Edit transaction"
                >
                  <Pencil size={15} />
                </button>
                <button 
                  className="p-2 rounded-md text-text-tertiary dark:text-dark-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(tx); }} 
                  aria-label="Delete transaction"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {filtered.length > visibleCount && (
            <div className="flex justify-center pt-3">
              <button 
                className="px-4 py-2 rounded-md bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors" 
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
