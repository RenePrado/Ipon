import { LayoutDashboard, ArrowUpDown, Wallet, Target, FileText } from "lucide-react";

export function BottomNav({ currentPage, onPageChange }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ArrowUpDown },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "budgets", label: "Budgets", icon: Wallet },
    { id: "goals", label: "Goals", icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-elevated dark:bg-dark-bg-elevated border-t border-border dark:border-dark-border lg:hidden z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "text-accent-primary"
                  : "text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
