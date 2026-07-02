import { useState, useRef } from "react";
import { fmt } from "../lib/formatters";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusTrap } from "../hooks/useFocusTrap";

export function Goals({ goals, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", target_amount: "", current_amount: "", deadline: "" });
  const [depositModal, setDepositModal] = useState(null);
  const [depositAmt, setDepositAmt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.name) {
      newErrors.name = "Goal name is required";
    }
    if (!form.target_amount || parseFloat(form.target_amount) <= 0) {
      newErrors.target_amount = "Target must be greater than 0";
    }
    if (form.current_amount && parseFloat(form.current_amount) < 0) {
      newErrors.current_amount = "Current amount cannot be negative";
    }
    if (form.target_amount && form.current_amount && parseFloat(form.target_amount) <= parseFloat(form.current_amount)) {
      newErrors.target_amount = "Target must be greater than current amount";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setLoading(true);
    await onCreate({ name: form.name, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount || 0), deadline: form.deadline || null });
    setModal(null); setForm({ name: "", target_amount: "", current_amount: "", deadline: "" }); setErrors({});
    setLoading(false);
  };

  const deposit = async () => {
    if (!depositAmt) return;
    setLoading(true);
    const newAmt = Math.min(Number(depositModal.current_amount) + parseFloat(depositAmt), Number(depositModal.target_amount));
    await onUpdate(depositModal.id, { current_amount: newAmt });
    setDepositModal(null); setDepositAmt("");
    setLoading(false);
  };

  const goalModalRef = useRef(null);
  const depositModalRef = useRef(null);
  useEscapeKey(() => {
    if (depositModal) setDepositModal(null);
    else if (modal) setModal(null);
  });
  useFocusTrap(goalModalRef, !!modal);
  useFocusTrap(depositModalRef, !!depositModal);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
          onClick={() => setModal(true)}
        >
          + New Goal
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.length === 0 && (
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3 text-text-tertiary dark:text-dark-text-tertiary">◇</div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">No savings goals yet. Set a goal to start working toward something.</div>
              <button 
                className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
                onClick={() => setModal(true)}
              >
                + Set a goal
              </button>
            </div>
          </div>
        )}
        {goals.map(g => {
          const pct = Number(g.target_amount) > 0 ? Math.min((Number(g.current_amount) / Number(g.target_amount)) * 100, 100) : 0;
          const done = pct >= 100;
          const remaining = Number(g.target_amount) - Number(g.current_amount);

          return (
            <div key={g.id} className={`rounded-lg p-4 border transition-colors ${
              done
                ? "bg-success/10 dark:bg-success/10 border-success/40 dark:border-success/40"
                : "bg-bg-elevated dark:bg-dark-bg-elevated border-border dark:border-dark-border"
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">{g.name}</div>
                    {done && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success text-white">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mt-1">
                    Target: {fmt(g.target_amount)}
                  </div>
                  <div className="mt-1">
                    <span className={`font-mono text-xs font-semibold ${
                      done 
                        ? "text-success" 
                        : "text-accent-secondary"
                    }`}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                </div>
                <button 
                  className="p-2.5 rounded hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 text-danger text-sm transition-colors" 
                  onClick={() => setDeleteConfirm(g)} 
                  aria-label="Delete goal"
                >
                  ✕
                </button>
              </div>
              
              {/* Horizontal Progress Strip */}
              <div className="mb-3">
                <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${pct}%`, 
                      background: done 
                        ? "var(--color-success)" 
                        : "var(--color-accent-secondary)" 
                    }} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs">
                  {done ? "Completed!" : `${fmt(remaining)} remaining`}
                </div>
                {!done && (
                  <button 
                    className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors duration-300" 
                    onClick={() => setDepositModal(g)}
                  >
                    + Deposit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div ref={goalModalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-6 w-full max-w-md border border-border dark:border-dark-border shadow-lg" role="dialog" aria-modal="true" aria-labelledby="goal-modal-title">
            <div id="goal-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-4">New Savings Goal</div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="goal-name">Goal Name</label>
              <input 
                id="goal-name" 
                placeholder="e.g. MacBook, Vacation..." 
                value={form.name} 
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e => ({ ...e, name: "" })); }}
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              {errors.name && <div className="text-danger text-xs mt-1">{errors.name}</div>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="goal-target">Target (₱)</label>
                <input 
                  id="goal-target" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.target_amount} 
                  onChange={e => { setForm(f => ({ ...f, target_amount: e.target.value })); setErrors(e => ({ ...e, target_amount: "" })); }}
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                {errors.target_amount && <div className="text-danger text-xs mt-1">{errors.target_amount}</div>}
              </div>
              <div>
                <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="goal-current">Already Saved (₱)</label>
                <input 
                  id="goal-current" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.current_amount} 
                  onChange={e => { setForm(f => ({ ...f, current_amount: e.target.value })); setErrors(e => ({ ...e, current_amount: "" })); }}
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                {errors.current_amount && <div className="text-danger text-xs mt-1">{errors.current_amount}</div>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="goal-deadline">Deadline (optional)</label>
              <input 
                id="goal-deadline" 
                type="date" 
                value={form.deadline} 
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors" 
                onClick={() => setModal(null)}
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

      {depositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setDepositModal(null)}>
          <div ref={depositModalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-6 w-full max-w-md border border-border dark:border-dark-border shadow-lg" role="dialog" aria-modal="true" aria-labelledby="deposit-modal-title">
            <div id="deposit-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-4">Deposit to "{depositModal.name}"</div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="deposit-amount">Amount (₱)</label>
              <input 
                id="deposit-amount" 
                type="number" 
                placeholder="0.00" 
                value={depositAmt} 
                onChange={e => setDepositAmt(e.target.value)} 
                autoFocus
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors" 
                onClick={() => setDepositModal(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
                onClick={deposit} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Goal"
          message="Are you sure you want to delete this goal? This cannot be undone."
          onConfirm={() => { onDelete(deleteConfirm.id); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
