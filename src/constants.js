// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const CURRENCY = "₱";

export const DEFAULT_CATEGORIES = [
  { name: "Salary", type: "income", icon: "💼", color: "#059669" },
  { name: "Freelance", type: "income", icon: "💻", color: "#0891B2" },
  { name: "Food", type: "expense", icon: "🍜", color: "#E07A5F" },
  { name: "Transport", type: "expense", icon: "🚌", color: "#4F6BED" },
  { name: "Bills", type: "expense", icon: "⚡", color: "#7C3AED" },
  { name: "Entertainment", type: "expense", icon: "🎮", color: "#9D7BB0" },
  { name: "Shopping", type: "expense", icon: "🛒", color: "#D4A23A" },
  { name: "Health", type: "expense", icon: "💊", color: "#0D9488" },
  { name: "Savings", type: "expense", icon: "🏦", color: "#4F6BED" },
];

export const CATEGORY_COLORS = DEFAULT_CATEGORIES.reduce((colors, category) => {
  colors[category.name] = category.color;
  return colors;
}, { Other: '#94A3B8' });
