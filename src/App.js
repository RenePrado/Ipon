import { useState } from "react";
import { LogOut, LayoutDashboard, ArrowUpDown, Wallet, Target, BarChart3, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { DEFAULT_CATEGORIES } from "./constants";
import { Auth } from "./components/Auth";
import { Toast } from "./components/common/Toast";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Budgets } from "./components/Budgets";
import { Goals } from "./components/Goals";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PageLoader } from "./components/common/PageLoader";
import { useAuth } from "./hooks/useAuth";
import { useData } from "./hooks/useData";
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";
import { AIChatbot } from "./components/AIChatbot";
import { supabase } from "./services/supabase";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const { session, loading: authLoading, signOut, signingOut } = useAuth((msg, type) => setToast({ msg, type }));
  const { transactions, budgets, goals, userProfile, loading: dataLoading, createTx, updateTx, deleteTx, createBudget, updateBudget, deleteBudget, createGoal, updateGoal, deleteGoal } = useData(session, (msg, type) => setToast({ msg, type }));
  const { messages, isTyping, isStreaming, showSuggestions, sendMessage, clearChat } = useChat(transactions, budgets, goals, userProfile);
  const { theme, toggleTheme } = useTheme();
  const categories = DEFAULT_CATEGORIES;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
  };

  // ── Render
  if (!supabase) return (
    <div className="flex items-center justify-center min-h-screen bg-bg dark:bg-dark-bg p-8">
      <div className="max-w-md text-center">
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-lg mb-2">Configuration Error</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm">
          Supabase environment variables are missing. The app cannot start without a valid backend connection.
          Please ensure <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-elevated-2 dark:bg-dark-bg-elevated-2">REACT_APP_SUPABASE_URL</code> and <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-elevated-2 dark:bg-dark-bg-elevated-2">REACT_APP_SUPABASE_ANON_KEY</code> are set in your <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-elevated-2 dark:bg-dark-bg-elevated-2">.env</code> file.
        </div>
      </div>
    </div>
  );
  if (authLoading) return <div className="flex items-center justify-center min-h-screen bg-bg dark:bg-dark-bg"><div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <Auth onAuth={(s) => { if (s) window.location.reload(); }} />;

  const pageTitles = {
    dashboard: { title: "Dashboard", sub: userProfile.name ? `Welcome back, ${userProfile.name}` : `Welcome back, ${session.user.email}` },
    transactions: { title: "Transactions", sub: "Track your income and expenses" },
    budgets: { title: "Budgets", sub: "Set and monitor spending limits" },
    goals: { title: "Savings Goals", sub: "Work towards your financial goals" },
    reports: { title: "Reports", sub: "Analyze your financial activity" },
    settings: { title: "Settings", sub: "Manage your account preferences" },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg dark:bg-dark-bg">
      <aside className="w-[220px] border-r border-border dark:border-dark-border flex flex-col px-3 py-6 fixed h-full">
        <div className="text-base font-bold text-text-primary dark:text-dark-text-primary px-3 mb-8">Ipon</div>

        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Overview</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "dashboard"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("dashboard")}
            aria-label="Navigate to Dashboard">
            <LayoutDashboard size={16} />Dashboard
          </button>
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Money</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "transactions"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("transactions")}
            aria-label="Navigate to Transactions">
            <ArrowUpDown size={16} />Transactions
          </button>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "budgets"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("budgets")}
            aria-label="Navigate to Budgets">
            <Wallet size={16} />Budgets
          </button>
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Grow</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "goals"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("goals")}
            aria-label="Navigate to Savings Goals">
            <Target size={16} />Savings Goals
          </button>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "reports"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("reports")}
            aria-label="Navigate to Reports">
            <BarChart3 size={16} />Reports
          </button>
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Account</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
            page === "settings"
              ? "border-accent-primary text-accent-primary"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("settings")}
            aria-label="Navigate to Settings">
            <SettingsIcon size={16} />Settings
          </button>
        </div>

        <div className="mt-auto px-3 space-y-2">
          <button className="flex items-center gap-2.5 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors" onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="flex items-center gap-2.5 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={signOut} disabled={signingOut}
            aria-label="Sign Out">
            <LogOut size={16} />{signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-[220px] flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-border dark:border-dark-border flex-shrink-0">
          <div className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">{pageTitles[page]?.title}</div>
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">{pageTitles[page]?.sub}</div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto overflow-x-hidden animate-[fadeIn_0.3s_ease-out]" key={page}>
          <ErrorBoundary key={page}>
            {dataLoading ? <PageLoader /> : (
              <>
                {page === "dashboard" && <Dashboard transactions={transactions} categories={categories} />}
                {page === "transactions" && <Transactions transactions={transactions} categories={categories} onCreate={createTx} onUpdate={updateTx} onDelete={deleteTx} />}
                {page === "budgets" && <Budgets budgets={budgets} transactions={transactions} categories={categories} onCreate={createBudget} onUpdate={updateBudget} onDelete={deleteBudget} />}
                {page === "goals" && <Goals goals={goals} onCreate={createGoal} onUpdate={updateGoal} onDelete={deleteGoal} />}
                {page === "reports" && <Reports transactions={transactions} categories={categories} onNavigate={setPage} />}
                {page === "settings" && <Settings session={session} userProfile={userProfile} showToast={showToast} />}
              </>
            )}
          </ErrorBoundary>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <AIChatbot messages={messages} isTyping={isTyping} isStreaming={isStreaming} showSuggestions={showSuggestions} sendMessage={sendMessage} clearChat={clearChat} />
    </div>
  );
}