import { useState, useRef } from "react";
import { thisMonth, fmt } from "../lib/formatters";
import { getCat } from "../lib/calculations";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusTrap } from "../hooks/useFocusTrap";

export function Budgets({ budgets, transactions, categories, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ category: "", limit_amount: "", month: thisMonth() });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const month = thisMonth();
  const monthTx = transactions.filter(t => t.date?.startsWith(month) && t.type === "expense");

  const getSpent = (catName) => monthTx.filter(t => t.category === catName).reduce((s, t) => s + Number(t.amount), 0);

  const validate = () => {
    const newErrors = {};
    if (!form.category) {
      newErrors.category = "Category is required";
    }
    if (!form.limit_amount || parseFloat(form.limit_amount) <= 0) {
      newErrors.limit_amount = "Limit must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setLoading(true);
    if (modal === "new") {
      await onCreate({ ...form, limit_amount: parseFloat(form.limit_amount) });
    } else {
      await onUpdate(modal.id, { ...form, limit_amount: parseFloat(form.limit_amount) });
    }
    setModal(null); setForm({ category: "", limit_amount: "", month: thisMonth() }); setErrors({});
    setLoading(false);
  };

  const expenseCats = categories.filter(c => c.type === "expense");

  const modalRef = useRef(null);
  useEscapeKey(() => { if (modal) setModal(null); });
  useFocusTrap(modalRef, !!modal);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
          onClick={() => { setForm({ category: "", limit_amount: "", month: thisMonth() }); setModal("new"); }}
        >
          + New Budget
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {budgets.length === 0 && (
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">◎</div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">No budgets set. Create a budget to track your monthly spending.</div>
              <button 
                className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
                onClick={() => { setForm({ category: "", limit_amount: "", month: thisMonth() }); setModal("new"); }}
              >
                + Create a budget
              </button>
            </div>
          </div>
        )}
        {budgets.map(b => {
          const cat = getCat(b.category, categories);
          const spent = getSpent(b.category);
          const pct = b.limit_amount > 0 ? Math.min((spent / b.limit_amount) * 100, 100) : 0;
          const over = spent > b.limit_amount;

          return (
            <div key={b.id} className="relative bg-bg-elevated dark:bg-dark-bg-elevated rounded-md p-3 border border-border dark:border-dark-border">
              <div className="absolute top-3 right-3 flex gap-1 z-10">
                <button 
                  className="p-2.5 rounded hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 text-text-secondary dark:text-dark-text-secondary text-sm transition-colors"
                  onClick={() => { setForm({ category: b.category, limit_amount: String(b.limit_amount), month: b.month }); setModal(b); }} 
                  aria-label="Edit budget"
                >
                  ✎
                </button>
                <button 
                  className="p-2.5 rounded hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 text-danger text-sm transition-colors"
                  onClick={() => setDeleteConfirm(b)} 
                  aria-label="Delete budget"
                >
                  ✕
                </button>
              </div>
              <div className="pr-12">
                <div>
                  <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">{cat?.icon} {cat?.name || "Unknown"}</div>
                  <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mt-1">
                    {over ? `Over by ${fmt(spent - b.limit_amount)}` : `${fmt(b.limit_amount - spent)} remaining`}
                  </div>
                  <div className="mt-1">
                    <span className={`font-mono text-xs font-semibold ${
                      over 
                        ? "text-danger" 
                        : pct > 80 
                          ? "text-warning" 
                          : "text-success"
                    }`}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Horizontal Stacked Bar */}
              <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full h-2 overflow-hidden mb-3">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${pct}%`, 
                    background: over 
                      ? "var(--color-danger)" 
                      : pct > 80 
                        ? "var(--color-warning)" 
                        : "var(--color-success)" 
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div ref={modalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-6 w-full max-w-md border border-border dark:border-dark-border shadow-lg" role="dialog" aria-modal="true" aria-labelledby="budget-modal-title">
            <div id="budget-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-4">{modal === "new" ? "New Budget" : "Edit Budget"}</div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="budget-category">Category</label>
              <select 
                id="budget-category" 
                value={form.category} 
                onChange={e => { setForm(f => ({ ...f, category: e.target.value })); setErrors(e => ({ ...e, category: "" })); }}
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Select category</option>
                {expenseCats.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
              {errors.category && <div className="text-danger text-xs mt-1">{errors.category}</div>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="budget-limit">Limit (₱)</label>
                <input 
                  id="budget-limit" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.limit_amount} 
                  onChange={e => { setForm(f => ({ ...f, limit_amount: e.target.value })); setErrors(e => ({ ...e, limit_amount: "" })); }}
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                {errors.limit_amount && <div className="text-danger text-xs mt-1">{errors.limit_amount}</div>}
              </div>
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="budget-month">Month</label>
                <input 
                  id="budget-month" 
                  type="month" 
                  value={form.month} 
                  onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors" 
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
                onClick={save} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Budget"
          message="Are you sure you want to delete this budget? This cannot be undone."
          onConfirm={() => { onDelete(deleteConfirm.id); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
