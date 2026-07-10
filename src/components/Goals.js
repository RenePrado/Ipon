import { useState, useRef } from "react";
import { fmt } from "../lib/formatters";
import { ConfirmDialog } from "./common/ConfirmDialog";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Pencil, Plus, X } from "lucide-react";
import { DatePicker } from "./common/DatePicker";

export function Goals({ goals, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", target_amount: "", current_amount: "", deadline: "" });
  const [depositModal, setDepositModal] = useState(null);
  const [depositAmt, setDepositAmt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalGoals = goals.length;
  const totalSaved = goals.reduce((s, g) => s + Number(g.current_amount), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.target_amount), 0);

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
    const payload = { name: form.name, target_amount: parseFloat(form.target_amount), current_amount: parseFloat(form.current_amount || 0), deadline: form.deadline || null };
    if (modal && modal !== true) {
      await onUpdate(modal.id, payload);
    } else {
      await onCreate(payload);
    }
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

  const openNew = () => { setForm({ name: "", target_amount: "", current_amount: "", deadline: "" }); setErrors({}); setModal(true); };
  const openEdit = (g) => { setForm({ name: g.name, target_amount: String(g.target_amount), current_amount: String(g.current_amount), deadline: g.deadline || "" }); setErrors({}); setModal(g); };

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg border border-border dark:border-dark-border p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Total Goals</div>
              <div className="text-xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{totalGoals}</div>
            </div>
            <div className="w-px h-10 bg-border dark:bg-dark-border" />
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Total Saved</div>
              <div className="text-xl font-semibold tabular-nums text-accent-primary">{fmt(totalSaved)}</div>
            </div>
            <div className="w-px h-10 bg-border dark:bg-dark-border" />
            <div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-[11px] font-medium uppercase tracking-wider mb-1">Total Target</div>
              <div className="text-xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{fmt(totalTarget)}</div>
            </div>
          </div>
          <button
            className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
            onClick={openNew}
          >
            + New Goal
          </button>
        </div>
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-center">
          <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No savings goals yet</div>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Number(g.target_amount) > 0 ? Math.min((Number(g.current_amount) / Number(g.target_amount)) * 100, 100) : 0;
            const done = pct >= 100;
            return (
              <div
                key={g.id}
                className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">{g.name}</div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                      onClick={() => openEdit(g)}
                      aria-label="Edit goal"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-danger transition-colors"
                      onClick={() => setDeleteConfirm(g)}
                      aria-label="Delete goal"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Saved of target */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-base font-semibold tabular-nums text-accent-primary">{fmt(g.current_amount)}</span>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">of {fmt(g.target_amount)}</span>
                </div>

                {/* Progress bar */}
                <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-full overflow-hidden mb-3" style={{ height: '8px' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: done ? "var(--color-success)" : "var(--color-accent)"
                    }}
                  />
                </div>

                {/* Bottom row: percentage + deposit */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium tabular-nums ${done ? "text-success" : "text-accent-primary"}`}>
                    {Math.round(pct)}%
                  </span>
                  {done ? (
                    <span className="text-xs text-success font-medium">Completed</span>
                  ) : (
                    <button
                      className="px-2.5 py-1 rounded-md border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary text-xs font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors flex items-center gap-1"
                      onClick={() => setDepositModal(g)}
                    >
                      <Plus size={12} /> Deposit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div ref={goalModalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 w-full max-w-md border border-border dark:border-dark-border" role="dialog" aria-modal="true" aria-labelledby="goal-modal-title">
            <div className="flex items-center justify-between mb-5">
              <div id="goal-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-base">{modal && modal !== true ? "Edit Savings Goal" : "New Savings Goal"}</div>
              <button onClick={() => setModal(null)} className="text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="goal-name">Goal Name</label>
              <input
                id="goal-name"
                placeholder="e.g. MacBook, Vacation..."
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e => ({ ...e, name: "" })); }}
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
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
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
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
                  className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
                />
                {errors.current_amount && <div className="text-danger text-xs mt-1">{errors.current_amount}</div>}
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5">Deadline (optional)</label>
              <DatePicker
                value={form.deadline}
                onChange={v => setForm(f => ({ ...f, deadline: v }))}
                optional
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                onClick={() => setModal(null)}
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

      {depositModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && setDepositModal(null)}>
          <div ref={depositModalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 w-full max-w-md border border-border dark:border-dark-border" role="dialog" aria-modal="true" aria-labelledby="deposit-modal-title">
            <div className="flex items-center justify-between mb-5">
              <div id="deposit-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-base">Deposit to "{depositModal.name}"</div>
              <button onClick={() => setDepositModal(null)} className="text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="deposit-amount">Amount (₱)</label>
              <input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={depositAmt}
                onChange={e => setDepositAmt(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                onClick={() => setDepositModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
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
