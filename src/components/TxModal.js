import { useState, useRef } from "react";

import { today } from "../lib/formatters";

import { useEscapeKey } from "../hooks/useEscapeKey";

import { useFocusTrap } from "../hooks/useFocusTrap";

import { X } from "lucide-react";

import { CustomSelect } from "./common/CustomSelect";

import { DatePicker } from "./common/DatePicker";



export function TxModal({ tx, categories, onSave, onClose }) {

  const [form, setForm] = useState({

    type: tx?.type || "expense",

    amount: tx?.amount || "",

    category: tx?.category || "",

    note: tx?.note || "",

    date: tx?.date || today(),

  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const set = (k, v) => {

    setForm(f => ({ ...f, [k]: v }));

    setErrors(e => ({ ...e, [k]: "" }));

  };

  const cats = categories.filter(c => c.type === form.type);



  const validate = () => {

    const newErrors = {};

    if (!form.amount || parseFloat(form.amount) <= 0) {

      newErrors.amount = "Amount must be greater than 0";

    }

    if (!form.date) {

      newErrors.date = "Date is required";

    }

    if (!form.category) {

      newErrors.category = "Category is required";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };



  const save = async () => {

    if (!validate()) return;

    setLoading(true);

    await onSave({ ...form, amount: parseFloat(form.amount) });

    setLoading(false);

  };



  const modalRef = useRef(null);

  useEscapeKey(onClose);

  useFocusTrap(modalRef, true);



  return (

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()}>

      <div ref={modalRef} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 w-full max-w-full sm:max-w-md mx-4 sm:mx-0 border border-border dark:border-dark-border" role="dialog" aria-modal="true" aria-labelledby="tx-modal-title">

        <div className="flex items-center justify-between mb-5">

          <div id="tx-modal-title" className="text-text-primary dark:text-dark-text-primary font-semibold text-base">{tx ? "Edit Transaction" : "Add Transaction"}</div>

          <button onClick={onClose} className="text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors" aria-label="Close">

            <X size={18} />

          </button>

        </div>



        <div className="flex gap-2 mb-4">

          {["income", "expense"].map(t => (

            <button

              key={t}

              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${

                form.type === t

                  ? t === "income"

                    ? "bg-success text-white"

                    : "bg-danger text-white"

                  : "border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2"

              }`}

              onClick={() => set("type", t)}

            >

              {t.charAt(0).toUpperCase() + t.slice(1)}

            </button>

          ))}

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

          <div>

            <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="tx-amount">Amount (₱)</label>

            <input

              id="tx-amount"

              type="number"

              placeholder="0.00"

              value={form.amount}

              onChange={e => set("amount", e.target.value)}

              className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"

            />

            {errors.amount && <div className="text-danger text-xs mt-1">{errors.amount}</div>}

          </div>

          <div>

            <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5">Date</label>

            <DatePicker

              value={form.date}

              onChange={v => set("date", v)}

            />

            {errors.date && <div className="text-danger text-xs mt-1">{errors.date}</div>}

          </div>

        </div>



        <div className="mb-4">

          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="tx-category">Category</label>

          <CustomSelect

            value={form.category}

            onChange={v => set("category", v)}

            options={[{ value: "", label: "Select category" }, ...cats.map(c => ({ value: c.name, label: c.name }))]}

            placeholder="Select category"

          />

          {errors.category && <div className="text-danger text-xs mt-1">{errors.category}</div>}

        </div>



        <div className="mb-5">

          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="tx-note">Note</label>

          <input

            id="tx-note"

            placeholder="Optional note..."

            value={form.note}

            onChange={e => set("note", e.target.value)}

            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"

          />

        </div>



        <div className="flex gap-3 justify-end">

          <button

            className="px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"

            onClick={onClose}

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

  );

}

