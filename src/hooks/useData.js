import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase";
import { fmt } from "../lib/formatters";

export function useData(session, showToast) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const loadData = useCallback(async () => {
    if (!session) return;
    const uid = session.user.id;
    const [tx, bud, gls, profile] = await Promise.all([
      supabase.from("transactions").select("*").eq("user_id", uid).order("date", { ascending: false }),
      supabase.from("budgets").select("*").eq("user_id", uid),
      supabase.from("savings_goals").select("*").eq("user_id", uid),
      supabase.from("profiles").select("name").eq("id", uid).single(),
    ]);
    setTransactions(tx.data || []);
    setBudgets(bud.data || []);
    setGoals(gls.data || []);
    setUserProfile(profile.data || { name: "" });
    setLoading(false);
  }, [session]);
  useEffect(() => {
    if (!session) return;
    loadData();
    // Set up real-time subscriptions
    const uid = session.user.id;
    // Transactions subscription
    const txChannel = supabase
      .channel(`transactions:${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${uid}`
        },
        () => loadData()
      )
      .subscribe();
    // Budgets subscription
    const budgetChannel = supabase
      .channel(`budgets:${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${uid}`
        },
        () => loadData()
      )
      .subscribe();
    // Goals subscription
    const goalsChannel = supabase
      .channel(`goals:${uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals',
          filter: `user_id=eq.${uid}`
        },
        () => loadData()
      )
      .subscribe();
    // Cleanup subscriptions on unmount or session change
    return () => {
      txChannel.unsubscribe();
      budgetChannel.unsubscribe();
      goalsChannel.unsubscribe();
    };
  }, [session, loadData]);
  const createTx = useCallback(async (form) => {
    if (!form.amount || parseFloat(form.amount) <= 0) { showToast("Amount must be greater than 0", "error"); return; }
    if (!form.category) { showToast("Category is required", "error"); return; }
    const { error } = await supabase.from("transactions").insert({ ...form, user_id: session.user.id });
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Transaction added: ${fmt(form.amount)} ${form.type} for ${form.category} on ${form.date}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const updateTx = useCallback(async (id, form) => {
    if (!form.amount || parseFloat(form.amount) <= 0) { showToast("Amount must be greater than 0", "error"); return; }
    if (!form.category) { showToast("Category is required", "error"); return; }
    const { error } = await supabase.from("transactions").update(form).eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Transaction updated: ${fmt(form.amount)} ${form.type} for ${form.category}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const deleteTx = useCallback(async (id) => {
    if (id == null) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Transaction deleted", "success");
    await loadData();
  }, [session, loadData, showToast]);
  const createBudget = useCallback(async (form) => {
    if (!form.limit_amount || parseFloat(form.limit_amount) <= 0) { showToast("Budget limit must be greater than 0", "error"); return; }
    if (!form.category) { showToast("Category is required", "error"); return; }
    const { error } = await supabase.from("budgets").insert({ ...form, user_id: session.user.id });
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Budget created: ${fmt(form.limit_amount)} for ${form.category} in ${form.month}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const deleteBudget = useCallback(async (id) => {
    const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Budget deleted", "success");
    await loadData();
  }, [session, loadData, showToast]);
  const updateBudget = useCallback(async (id, form) => {
    if (!form.limit_amount || parseFloat(form.limit_amount) <= 0) { showToast("Budget limit must be greater than 0", "error"); return; }
    if (!form.category) { showToast("Category is required", "error"); return; }
    const { error } = await supabase.from("budgets").update(form).eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Budget updated: ${fmt(form.limit_amount)} for ${form.category}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const createGoal = useCallback(async (form) => {
    if (!form.target_amount || parseFloat(form.target_amount) <= 0) { showToast("Target amount must be greater than 0", "error"); return; }
    if (!form.name?.trim()) { showToast("Goal name is required", "error"); return; }
    const { error } = await supabase.from("savings_goals").insert({ ...form, user_id: session.user.id });
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Goal created: ${form.name} with target of ${fmt(form.target_amount)}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const updateGoal = useCallback(async (id, form) => {
    const { error } = await supabase.from("savings_goals").update(form).eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Goal updated: ${form.name || "Savings goal"}`, "success");
    await loadData();
  }, [session, loadData, showToast]);
  const deleteGoal = useCallback(async (id) => {
    const { error } = await supabase.from("savings_goals").delete().eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast("Goal deleted", "success");
    await loadData();
  }, [session, loadData, showToast]);
  const depositGoal = useCallback(async (id, amount) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) { showToast("Goal not found", "error"); return; }
    const deposit = parseFloat(amount);
    if (isNaN(deposit) || deposit <= 0) { showToast("Deposit amount must be greater than 0", "error"); return; }
    const newAmount = Math.min(Number(goal.current_amount) + deposit, Number(goal.target_amount));
    const { error } = await supabase.from("savings_goals").update({ current_amount: newAmount }).eq("id", id).eq("user_id", session.user.id);
    if (error) { showToast(error.message, "error"); return; }
    showToast(`Deposited ${fmt(deposit)} to ${goal.name}`, "success");
    await loadData();
  }, [session, goals, loadData, showToast]);
  return {
    transactions,
    budgets,
    goals,
    userProfile,
    loading,
    createTx,
    updateTx,
    deleteTx,
    createBudget,
    updateBudget,
    deleteBudget,
    createGoal,
    updateGoal,
    deleteGoal,
    depositGoal,
  };
}
