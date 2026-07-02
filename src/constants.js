// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const CURRENCY = "₱";

export const DEFAULT_CATEGORIES = [
  { name: "Salary", type: "income", icon: "💼", color: "#22C55E" },
  { name: "Freelance", type: "income", icon: "💻", color: "#10B981" },
  { name: "Food", type: "expense", icon: "🍜", color: "#EF4444" },
  { name: "Transport", type: "expense", icon: "🚌", color: "#3B82F6" },
  { name: "Bills", type: "expense", icon: "⚡", color: "#8B5CF6" },
  { name: "Entertainment", type: "expense", icon: "🎮", color: "#EC4899" },
  { name: "Shopping", type: "expense", icon: "🛒", color: "#F59E0B" },
  { name: "Health", type: "expense", icon: "💊", color: "#14B8A6" },
  { name: "Savings", type: "expense", icon: "🏦", color: "#0EA5E9" },
];

export const CATEGORY_COLORS = DEFAULT_CATEGORIES.reduce((colors, category) => {
  colors[category.name] = category.color;
  return colors;
}, { Other: '#9E9E9E' });
