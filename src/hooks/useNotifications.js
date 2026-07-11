import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../services/supabase";

export function useNotifications(session) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ownIdsRef = useRef(new Set());
  const showToastRef = useRef(null);

  const setShowToast = useCallback((fn) => {
    showToastRef.current = fn;
  }, []);

  useEffect(() => {
    if (!session || !supabase) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const uid = session.user.id;

    const load = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(50);
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    };
    load();

    const channel = supabase
      .channel(`notifications:${uid}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${uid}`,
        },
        (payload) => {
          const n = payload.new;
          setNotifications(prev => [n, ...prev].slice(0, 50));
          setUnreadCount(c => c + 1);

          if (!ownIdsRef.current.has(n.id) && showToastRef.current) {
            showToastRef.current(n.body || n.title, n.type === "danger" ? "error" : n.type);
          }
          ownIdsRef.current.delete(n.id);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

  const addNotification = useCallback(async (msg, type = "success") => {
    if (!session || !supabase) return;
    const title = type === "error" ? "Error" : "Update";
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: session.user.id,
        title,
        body: msg,
        type: type === "error" ? "danger" : type,
        source: "user",
      })
      .select()
      .single();

    if (!error && data) {
      ownIdsRef.current.add(data.id);
    }
  }, [session]);

  const markAllRead = useCallback(async () => {
    if (!session || !supabase || unreadCount === 0) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", session.user.id)
      .eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [session, unreadCount]);

  const removeNotification = useCallback(async (id) => {
    if (!session || !supabase) return;
    await supabase.from("notifications").delete().eq("id", id).eq("user_id", session.user.id);
    setNotifications(prev => {
      const removed = prev.find(n => n.id === id);
      if (removed && !removed.read) setUnreadCount(c => Math.max(0, c - 1));
      return prev.filter(n => n.id !== id);
    });
  }, [session]);

  const clearNotifications = useCallback(async () => {
    if (!session || !supabase || notifications.length === 0) return;
    await supabase.from("notifications").delete().eq("user_id", session.user.id);
    setNotifications([]);
    setUnreadCount(0);
  }, [session, notifications.length]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    clearNotifications,
    removeNotification,
    setShowToast,
  };
}
