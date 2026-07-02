import { CURRENCY } from "../constants";

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
export const fmt = (n) => `${CURRENCY}${(Number(n) || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtSigned = (n) => { const v = Number(n) || 0; return `${v < 0 ? "-" : "+"}${CURRENCY}${Math.abs(v).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; };
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const thisMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
