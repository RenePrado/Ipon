import { useState, useCallback, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { thisMonth, fmt } from "../lib/formatters";
import { DEFAULT_CATEGORIES } from "../constants";
import { reportError } from "../services/errorReporter";

function buildSystemPrompt(transactions, budgets, goals, userProfile) {
  const month = thisMonth();
  const monthTx = transactions.filter(t => t.date?.startsWith(month));
  const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expense;

  const expenseByCategory = {};
  monthTx.filter(t => t.type === "expense").forEach(t => {
    const cat = DEFAULT_CATEGORIES.find(c => c.name === t.category);
    const name = cat?.name || "Other";
    expenseByCategory[name] = (expenseByCategory[name] || 0) + Number(t.amount);
  });

  const budgetInfo = budgets.map(b => {
    const spent = monthTx.filter(t => t.type === "expense" && t.category === b.category).reduce((s, t) => s + Number(t.amount), 0);
    const pct = b.limit_amount > 0 ? Math.round((spent / b.limit_amount) * 100) : 0;
    return `- ${b.category}: Limit ${fmt(b.limit_amount)}, Spent ${fmt(spent)} (${pct}%)`;
  }).join("\n");

  const goalInfo = goals.map(g => {
    const pct = Number(g.target_amount) > 0 ? Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100) : 0;
    return `- ${g.name}: Target ${fmt(g.target_amount)}, Saved ${fmt(g.current_amount)} (${pct}%)`;
  }).join("\n");

  return `You are Ipon, a personal finance assistant for a Filipino user. Answer questions using only the provided financial data. Keep responses concise and conversational. Use Philippine Peso (₱) for all amounts.

User: ${userProfile?.name || "User"}
Month: ${month}

Current Month Summary:
- Total Income: ${fmt(income)}
- Total Expenses: ${fmt(expense)}
- Net Balance: ${fmt(balance)}

Expense Breakdown by Category:
${Object.entries(expenseByCategory).map(([cat, amt]) => `- ${cat}: ${fmt(amt)}`).join("\n") || "- No expenses yet"}

Active Budgets:
${budgetInfo || "- No budgets set"}

Savings Goals:
${goalInfo || "- No savings goals set"}`;
}

export function useChat(transactions, budgets, goals, userProfile) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const requestIdRef = useRef(0);
  const streamIntervalRef = useRef(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    const currentRequestId = ++requestIdRef.current;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const key = process.env.REACT_APP_GEMINI_KEY;
      if (!key || key.trim() === "" || key === "undefined") {
        if (requestIdRef.current !== currentRequestId) return;
        setMessages(prev => [...prev, { role: "assistant", content: "AI chat is not configured. Please set up the Gemini API key." }]);
        setIsTyping(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const systemPrompt = buildSystemPrompt(transactions, budgets, goals, userProfile);
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Got it! I'm ready to help with your finances." }] },
          ...history,
        ],
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 20000);
      });

      const response = await Promise.race([chat.sendMessage(text), timeoutPromise]);

      if (requestIdRef.current !== currentRequestId) return;

      const responseText = response.response.text();

      const assistantIndex = messages.length + 1;
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantIndex] = { role: "assistant", content: "" };
        return updated;
      });
      setIsStreaming(true);

      let charIndex = 0;
      await new Promise(resolve => {
        streamIntervalRef.current = setInterval(() => {
          if (requestIdRef.current !== currentRequestId) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
            resolve();
            return;
          }

          charIndex++;
          const partial = responseText.slice(0, charIndex);
          setMessages(prev => {
            const updated = [...prev];
            if (updated[assistantIndex]) {
              updated[assistantIndex] = { role: "assistant", content: partial };
            }
            return updated;
          });

          if (charIndex >= responseText.length) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
            resolve();
          }
        }, 20);
      });

      if (requestIdRef.current !== currentRequestId) return;
    } catch (e) {
      if (requestIdRef.current !== currentRequestId) return;
      reportError('chat', e, { operation: 'sendMessage' });
      const errorMsg = e.message === "Request timeout"
        ? "I took too long to respond. Please try again."
        : `I'm having trouble responding right now. Please try again in a moment. [Debug: ${e.message}]`;
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    }

    setIsStreaming(false);
    setIsTyping(false);
  }, [messages, isTyping, transactions, budgets, goals, userProfile]);

  const clearChat = useCallback(() => {
    requestIdRef.current++;
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setMessages([]);
    setIsTyping(false);
    setIsStreaming(false);
  }, []);

  return { messages, isTyping, isStreaming, sendMessage, clearChat };
}
