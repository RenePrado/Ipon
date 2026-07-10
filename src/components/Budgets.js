import { useState, useRef } from "react";
import { thisMonth, fmt } from "../lib/formatters";
import { getCat } from "../lib/calculations";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Pencil, X } from "lucide-react";
import { CustomSelect } from "./common/CustomSelect";
import { MonthPicker } from "./common/MonthPicker";

export function Budgets({ budgets, transactions, categories, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ category: "", limit_amount: "", month: thisMonth() });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const month = thisMonth();
  const monthTx = transactions.filter(t => t.date?.startsWith(month) && t.type === "expense");

  const getSpent = (catName) => monthTx.filter(t => t.category === catName).reduce((s, t) => s + Number(t.amount), 0);

  const totalBudgeted = budgets.reduce((s, b) => s + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce((s, b) => s + getSpent(b.category), 0);
  const totalRemaining = totalBudgeted - totalSpent;

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

  const openNew = () => { setForm({ category: "", limit_amount: "", month: thisMonth() }); setModal("new"); };

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg border border-border dark:border-dark-border p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Total Budgeted</div>
              <div className="text-xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{fmt(totalBudgeted)}</div>
            </div>
            <div className="w-px h-10 bg-border dark:bg-dark-border" />
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Total Spent</div>
              <div className="text-xl font-semibold tabular-nums text-danger">{fmt(totalSpent)}</div>
            </div>
            <div className="w-px h-10 bg-border dark:bg-dark-border" />
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Remaining</div>
              <div className={`text-xl font-semibold tabular-nums ${totalRemaining >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(totalRemaining)}</div>
            </div>
          </div>
          <button
            className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
            onClick={openNew}
          >
            + New Budget
          </button>
        </div>
      </div>

      {/* Budget list */}
      {budgets.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-center">
          <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No budgets set yet</div>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map(b => {
            const cat = getCat(b.category, categories);
            const spent = getSpent(b.category);
            const pct = b.limit_amount > 0 ? Math.min((spent / b.limit_amount) * 100, 100) : 0;
            const over = spent >= b.limit_amount;
            const near = !over && pct >= 80;
            const barColor = over ? 'var(--color-danger)' : near ? 'var(--color-warning)' : 'var(--color-success)';

            return (
              <div
                key={b.id}
                className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">
                    {cat?.icon} {cat?.name || "Unknown"}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                      onClick={() => { setForm({ category: b.category, limit_amount: String(b.limit_amount), month: b.month }); setModal(b); }}
                      aria-label="Edit budget"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-danger transition-colors"
                      onClick={() => setDeleteConfirm(b)}
                      aria-label="Delete budget"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Spent of limit */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-base font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{fmt(spent)}</span>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">of {fmt(b.limit_amount)}</span>
                </div>

                {/* Progress bar */}
                <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full overflow-hidden mb-3" style={{ height: '8px' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: barColor
                    }}
                  />
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium tabular-nums ${
                    over ? "text-danger" : near ? "text-warning" : "text-success"
                  }`}>
                    {Math.round(pct)}%
                  </span>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{b.month}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div ref={modalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 w-full max-w-md border border-border dark:border-dark-border" role="dialog" aria-modal="true" aria-labelledby="budget-modal-title">
            <div className="flex items-center justify-between mb-5">
              <div id="budget-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-base">{modal === "new" ? "New Budget" : "Edit Budget"}</div>
              <button onClick={() => setModal(false)} className="text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="budget-category">Category</label>
              <CustomSelect
                value={form.category}
                onChange={v => { setForm(f => ({ ...f, category: v })); setErrors(e => ({ ...e, category: "" })); }}
                options={[{ value: "", label: "Select category" }, ...expenseCats.map(c => ({ value: c.name, label: c.name }))]}
                placeholder="Select category"
              />
              {errors.category && <div className="text-danger text-xs mt-1">{errors.category}</div>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="budget-limit">Limit (₱)</label>
                <input
                  id="budget-limit"
                  type="number"
                  placeholder="0.00"
                  value={form.limit_amount}
                  onChange={e => { setForm(f => ({ ...f, limit_amount: e.target.value })); setErrors(e => ({ ...e, limit_amount: "" })); }}
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
                />
                {errors.limit_amount && <div className="text-danger text-xs mt-1">{errors.limit_amount}</div>}
              </div>
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5">Month</label>
                <MonthPicker
                  value={form.month}
                  onChange={v => setForm(f => ({ ...f, month: v }))}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
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
