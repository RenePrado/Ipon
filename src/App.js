import { useState, useEffect, useCallback } from "react";
import { LogOut, LayoutDashboard, ArrowUpDown, Wallet, Target, BarChart3, Settings as SettingsIcon, Sun, Moon, MessageCircle, User } from "lucide-react";
import { DEFAULT_CATEGORIES } from "./constants";
import { Auth } from "./components/Auth";
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
import { useNotifications } from "./hooks/useNotifications";
import { AIChatbot } from "./components/AIChatbot";
import { NotificationsBell } from "./components/common/NotificationsBell";
import { BottomNav } from "./components/common/BottomNav";
import { supabase } from "./services/supabase";
// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

const [aiChatOpen, setAiChatOpen] = useState(false);
  const { session, loading: authLoading, signOut, signingOut } = useAuth((msg, type) => setToast({ msg, type }));
  const { notifications, unreadCount, markAllRead, clearNotifications, removeNotification, setShowToast } = useNotifications(session);
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);
  useEffect(() => {
    setShowToast(showToast);
  }, [setShowToast, showToast]);
  const { transactions, budgets, goals, userProfile, loading: dataLoading, createTx, updateTx, deleteTx, createBudget, updateBudget, deleteBudget, createGoal, updateGoal, deleteGoal, depositGoal } = useData(session, showToast);
  const chatActions = { createTx, updateTx, deleteTx, createBudget, updateBudget, deleteBudget, createGoal, updateGoal, deleteGoal, depositGoal };
  const { messages, isTyping, isStreaming, showSuggestions, sendMessage, clearChat } = useChat(transactions, budgets, goals, userProfile, chatActions);
  const { theme, toggleTheme } = useTheme();
  const categories = DEFAULT_CATEGORIES;
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
      <aside className="fixed inset-y-0 left-0 w-[220px] border-r border-border dark:border-dark-border flex flex-col px-3 py-6 z-50 transition-transform duration-300 lg:translate-x-0 -translate-x-full lg:flex">
        <div className="flex items-center justify-between mb-8 px-3">
          <div className="text-base font-bold text-text-primary dark:text-dark-text-primary">Ipon</div>
        </div>
        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Overview</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "dashboard"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("dashboard")}
            aria-label="Navigate to Dashboard">
            <LayoutDashboard size={16} />Dashboard
          </button>
        </div>
        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Money</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "transactions"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("transactions")}
            aria-label="Navigate to Transactions">
            <ArrowUpDown size={16} />Transactions
          </button>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "budgets"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("budgets")}
            aria-label="Navigate to Budgets">
            <Wallet size={16} />Budgets
          </button>
        </div>
        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Grow</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "goals"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("goals")}
            aria-label="Navigate to Savings Goals">
            <Target size={16} />Savings Goals
          </button>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "reports"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
              : "border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
          }`} onClick={() => setPage("reports")}
            aria-label="Navigate to Reports">
            <BarChart3 size={16} />Reports
          </button>
        </div>
        <div className="mb-6">
          <div className="text-[10px] font-medium text-text-tertiary dark:text-dark-text-tertiary uppercase tracking-widest px-3 mb-2">Account</div>
          <button className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium transition-colors border-l-2 outline-none focus-visible:ring-1 focus-visible:ring-accent-primary focus-visible:ring-offset-0 rounded ${
            page === "settings"
              ? "border-accent-primary text-accent-primary bg-accent-primary/5"
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
      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col overflow-hidden">
        <div className="px-4 sm:px-8 py-6 border-b border-border dark:border-dark-border flex-shrink-0 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">{pageTitles[page]?.title}</div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">{pageTitles[page]?.sub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <NotificationsBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={markAllRead}
            onClear={clearNotifications}
            onRemove={removeNotification}
            toast={toast}
            onToastDone={() => setToast(null)}
          />
          <button
            className="lg:hidden p-2 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            onClick={() => setAiChatOpen(!aiChatOpen)}
            aria-label="AI Chat"
          >
            <MessageCircle size={20} />
          </button>
          <button
            className="lg:hidden p-2 rounded text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            onClick={() => setPage("settings")}
            aria-label="Settings"
          >
            <User size={20} />
          </button>
          </div>
        </div>
        <div className="p-4 sm:p-8 pb-20 lg:pb-8 flex-1 overflow-y-auto overflow-x-hidden animate-[fadeIn_0.3s_ease-out]" key={page}>
          <ErrorBoundary key={page}>
            {dataLoading ? <PageLoader /> : (
              <>
                {page === "dashboard" && <Dashboard transactions={transactions} categories={categories} onUpdate={updateTx} onDelete={deleteTx} />}
                {page === "transactions" && <Transactions transactions={transactions} categories={categories} onCreate={createTx} onUpdate={updateTx} onDelete={deleteTx} />}
                {page === "budgets" && <Budgets budgets={budgets} transactions={transactions} categories={categories} onCreate={createBudget} onUpdate={updateBudget} onDelete={deleteBudget} />}
                {page === "goals" && <Goals goals={goals} onCreate={createGoal} onUpdate={updateGoal} onDelete={deleteGoal} />}
                {page === "reports" && <Reports transactions={transactions} categories={categories} />}
                {page === "settings" && <Settings session={session} userProfile={userProfile} showToast={showToast} signOut={signOut} signingOut={signingOut} />}
              </>
            )}
          </ErrorBoundary>
        </div>
      </div>
      <AIChatbot messages={messages} isTyping={isTyping} isStreaming={isStreaming} showSuggestions={showSuggestions} sendMessage={sendMessage} clearChat={clearChat} isOpen={aiChatOpen} onToggle={() => setAiChatOpen(!aiChatOpen)} />
      {/* Bottom Navigation */}
      <BottomNav
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}