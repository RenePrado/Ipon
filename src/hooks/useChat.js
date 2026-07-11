import { useState, useCallback, useRef, useEffect } from "react";
import { thisMonth, prevMonth, today, fmt } from "../lib/formatters";
import { DEFAULT_CATEGORIES } from "../constants";
import { getCat } from "../lib/calculations";
import { reportError } from "../services/errorReporter";
import { supabase } from "../services/supabase";
const TOOL_DECLARATIONS = [
  {
    name: "addTransaction",
    description: "Add a new income or expense transaction. Use when the user asks to record a transaction.",
    parameters: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Transaction amount in Philippine Peso" },
        type: { type: "string", enum: ["income", "expense"], description: "Transaction type" },
        category: { type: "string", description: "Category name (e.g., Food, Transport, Salary)" },
        date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
        note: { type: "string", description: "Optional note or description" },
      },
      required: ["amount", "type", "category", "date"],
    },
  },
  {
    name: "updateTransaction",
    description: "Update an existing transaction by ID. Only include fields that need to change.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Transaction ID from the provided data" },
        amount: { type: "number", description: "Transaction amount in Philippine Peso" },
        type: { type: "string", enum: ["income", "expense"], description: "Transaction type" },
        category: { type: "string", description: "Category name" },
        date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
        note: { type: "string", description: "Optional note or description" },
      },
      required: ["id"],
    },
  },
  {
    name: "deleteTransaction",
    description: "Delete a transaction by ID.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Transaction ID from the provided data" },
      },
      required: ["id"],
    },
  },
  {
    name: "addBudget",
    description: "Create a new monthly budget for a category.",
    parameters: {
      type: "object",
      properties: {
        category: { type: "string", description: "Budget category name" },
        limit_amount: { type: "number", description: "Monthly budget limit in Philippine Peso" },
        month: { type: "string", description: "Budget month in YYYY-MM format" },
      },
      required: ["category", "limit_amount", "month"],
    },
  },
  {
    name: "updateBudget",
    description: "Update an existing budget by ID. Only include fields that need to change.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Budget ID from the provided data" },
        category: { type: "string", description: "Budget category name" },
        limit_amount: { type: "number", description: "Monthly budget limit in Philippine Peso" },
        month: { type: "string", description: "Budget month in YYYY-MM format" },
      },
      required: ["id"],
    },
  },
  {
    name: "deleteBudget",
    description: "Delete a budget by ID.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Budget ID from the provided data" },
      },
      required: ["id"],
    },
  },
  {
    name: "addGoal",
    description: "Create a new savings goal.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Goal name" },
        target_amount: { type: "number", description: "Target savings amount in Philippine Peso" },
        deadline: { type: "string", description: "Goal deadline in YYYY-MM-DD format" },
        current_amount: { type: "number", description: "Initial saved amount (default 0)" },
      },
      required: ["name", "target_amount", "deadline"],
    },
  },
  {
    name: "updateGoal",
    description: "Update an existing savings goal by ID. Only include fields that need to change.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Goal ID from the provided data" },
        name: { type: "string", description: "Goal name" },
        target_amount: { type: "number", description: "Target savings amount in Philippine Peso" },
        deadline: { type: "string", description: "Goal deadline in YYYY-MM-DD format" },
        current_amount: { type: "number", description: "Current saved amount in Philippine Peso" },
      },
      required: ["id"],
    },
  },
  {
    name: "deleteGoal",
    description: "Delete a savings goal by ID.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Goal ID from the provided data" },
      },
      required: ["id"],
    },
  },
  {
    name: "depositToGoal",
    description: "Add a deposit to a savings goal by ID.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Goal ID from the provided data" },
        amount: { type: "number", description: "Deposit amount in Philippine Peso" },
      },
      required: ["id", "amount"],
    },
  },
];

async function executeToolCall(call, actions) {
  const { name, args } = call;
  try {
    switch (name) {
      case "addTransaction":
        await actions.createTx({
          amount: args.amount,
          type: args.type,
          category: args.category,
          date: args.date,
          note: args.note || "",
        });
        return { success: true, message: `Transaction added: ${args.type} ${fmt(args.amount)}` };
      case "updateTransaction": {
        const { id, ...form } = args;
        await actions.updateTx(id, form);
        return { success: true, message: "Transaction updated" };
      }
      case "deleteTransaction":
        await actions.deleteTx(args.id);
        return { success: true, message: "Transaction deleted" };
      case "addBudget":
        await actions.createBudget({
          category: args.category,
          limit_amount: args.limit_amount,
          month: args.month,
        });
        return { success: true, message: `Budget created: ${args.category} limit ${fmt(args.limit_amount)}` };
      case "updateBudget": {
        const { id, ...form } = args;
        await actions.updateBudget(id, form);
        return { success: true, message: "Budget updated" };
      }
      case "deleteBudget":
        await actions.deleteBudget(args.id);
        return { success: true, message: "Budget deleted" };
      case "addGoal":
        await actions.createGoal({
          name: args.name,
          target_amount: args.target_amount,
          deadline: args.deadline,
          current_amount: args.current_amount || 0,
        });
        return { success: true, message: `Goal created: ${args.name} target ${fmt(args.target_amount)}` };
      case "updateGoal": {
        const { id, ...form } = args;
        await actions.updateGoal(id, form);
        return { success: true, message: "Goal updated" };
      }
      case "deleteGoal":
        await actions.deleteGoal(args.id);
        return { success: true, message: "Goal deleted" };
      case "depositToGoal":
        await actions.depositGoal(args.id, args.amount);
        return { success: true, message: `Deposited ${fmt(args.amount)} to goal` };
      default:
        return { success: false, message: `Unknown tool: ${name}` };
    }
  } catch (e) {
    return { success: false, message: e?.message || "Action failed" };
  }
}

function buildSystemPrompt(transactions, budgets, goals, userProfile) {
  const month = thisMonth();
  const prev = prevMonth();
  const monthTx = transactions.filter(t => t.date?.startsWith(month));
  const prevTx = transactions.filter(t => t.date?.startsWith(prev));

  const calcMonth = (txList) => {
    const income = txList.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = txList.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const balance = income - expense;
    const byCategory = {};
    txList.filter(t => t.type === "expense").forEach(t => {
      const cat = getCat(t.category, DEFAULT_CATEGORIES);
      const name = cat?.name || "Other";
      byCategory[name] = (byCategory[name] || 0) + Number(t.amount);
    });
    return { income, expense, balance, byCategory };
  };

  const cur = calcMonth(monthTx);
  const pre = calcMonth(prevTx);

  const allCategories = [...new Set([...Object.keys(cur.byCategory), ...Object.keys(pre.byCategory)])];
  const changes = allCategories.map(cat => {
    const curAmt = cur.byCategory[cat] || 0;
    const prevAmt = pre.byCategory[cat] || 0;
    if (prevAmt === 0 && curAmt > 0) return `- ${cat}: NEW this month (${fmt(curAmt)})`;
    if (curAmt === 0 && prevAmt > 0) return `- ${cat}: ZERO this month (was ${fmt(prevAmt)})`;
    const diff = curAmt - prevAmt;
    const pct = prevAmt > 0 ? Math.round((diff / prevAmt) * 100) : 0;
    const dir = diff > 0 ? "up" : "down";
    return `- ${cat}: ${dir} ${fmt(Math.abs(diff))} (${pct}%)`;
  }).join("\n");

  const budgetInfo = budgets.map(b => {
    const spent = monthTx.filter(t => t.type === "expense" && t.category === b.category).reduce((s, t) => s + Number(t.amount), 0);
    const pct = b.limit_amount > 0 ? Math.round((spent / b.limit_amount) * 100) : 0;
    return `- ${b.category}: Limit ${fmt(b.limit_amount)}, Spent ${fmt(spent)} (${pct}%)`;
  }).join("\n");

  const goalInfo = goals.map(g => {
    const pct = Number(g.target_amount) > 0 ? Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100) : 0;
    return `- ${g.name}: Target ${fmt(g.target_amount)}, Saved ${fmt(g.current_amount)} (${pct}%)`;
  }).join("\n");

  const txLines = transactions.slice(0, 50).map(t => {
    const cat = getCat(t.category, DEFAULT_CATEGORIES);
    return `- ID: ${t.id} | ${t.date} | ${t.type} | ${cat?.name || t.category} | ${fmt(t.amount)}${t.note ? ` | ${t.note}` : ""}`;
  }).join("\n") || "- No transactions";

  const budgetLines = budgets.map(b => `- ID: ${b.id} | ${b.category} | Limit ${fmt(b.limit_amount)} | Month ${b.month}`).join("\n") || "- No budgets";
  const goalLines = goals.map(g => `- ID: ${g.id} | ${g.name} | Target ${fmt(g.target_amount)} | Saved ${fmt(g.current_amount)} | Deadline ${g.deadline}`).join("\n") || "- No goals";

  return `You are Piso, a personal finance assistant for a Filipino user. You can answer questions AND perform actions on the user's financial data using the provided functions. Keep responses concise and conversational. Use Philippine Peso (₱) for all amounts.

Available actions (call the matching function when appropriate):
- addTransaction, updateTransaction, deleteTransaction
- addBudget, updateBudget, deleteBudget
- addGoal, updateGoal, deleteGoal, depositToGoal

When performing actions:
- If a user asks to add/edit/delete something, gather any missing required info (amount, category, date, etc.) before calling a function.
- For updates or deletes, use the exact IDs from the data below.
- Confirm completed actions with a brief summary.
- If the requested action is ambiguous or would delete data, ask the user to confirm first.

Format your responses using clean minimal markdown:
- Use **bold** for important numbers and category names
- Use bullet points (-) for lists
- Do NOT use headers or hash symbols (#) — the chat bubble is small
- Do NOT use triple backtick code blocks — this is a conversational assistant, not a coding tool
- Keep responses short and scannable

User: ${userProfile?.name || "User"}
Today: ${today()}
Current Month: ${month}
Previous Month: ${prev}
Available Categories: ${DEFAULT_CATEGORIES.map(c => c.name).join(", ")}

Current Month:
- Total Income: ${fmt(cur.income)}
- Total Expenses: ${fmt(cur.expense)}
- Net Balance: ${fmt(cur.balance)}
Expense Breakdown:
${Object.entries(cur.byCategory).map(([cat, amt]) => `- ${cat}: ${fmt(amt)}`).join("\n") || "- No expenses yet"}

Previous Month:
- Total Income: ${fmt(pre.income)}
- Total Expenses: ${fmt(pre.expense)}
- Net Balance: ${fmt(pre.balance)}
Expense Breakdown:
${Object.entries(pre.byCategory).map(([cat, amt]) => `- ${cat}: ${fmt(amt)}`).join("\n") || "- No expenses last month"}

Month over Month Changes:
${changes || "- No comparable data"}

Active Budgets:
${budgetInfo || "- No budgets set"}

Savings Goals:
${goalInfo || "- No savings goals set"}

Recent Transactions (use ID for updates/deletes):
${txLines}

Budget Records:
${budgetLines}

Goal Records:
${goalLines}`;
}

export function useChat(transactions, budgets, goals, userProfile, actions = {}) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const requestIdRef = useRef(0);
  const streamIntervalRef = useRef(null);
  const messagesRef = useRef(messages);
  const actionsRef = useRef(actions);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;
    setShowSuggestions(false);

    const currentRequestId = ++requestIdRef.current;
    const currentMessages = messagesRef.current;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      if (!supabase) {
        if (requestIdRef.current !== currentRequestId) return;
        setMessages(prev => [...prev, { role: "assistant", content: "AI chat is not configured. Please set up Supabase." }]);
        setIsTyping(false);
        return;
      }

      const systemPrompt = buildSystemPrompt(transactions, budgets, goals, userProfile);
      const history = currentMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 20000);
      });

      let chatHistory = history;
      let message = text;
      let responseText = "";

      let rounds = 0;
      while (rounds < 3) {
        const result = await Promise.race([
          supabase.functions.invoke("gemini-chat", {
            body: {
              systemPrompt,
              history: chatHistory,
              message,
              toolDeclarations: TOOL_DECLARATIONS,
            },
          }),
          timeoutPromise,
        ]);
        if (requestIdRef.current !== currentRequestId) return;

        if (result.error) {
          let errDetail = result.error.message || "Chat request failed";
          if (result.error.context) {
            try {
              const ctx = typeof result.error.context === "string"
                ? JSON.parse(result.error.context)
                : result.error.context;
              errDetail = ctx.error || ctx.message || errDetail;
            } catch (_) {}
          }
          throw new Error(errDetail);
        }

        const data = result.data;

        if (data.functionCalls && data.functionCalls.length > 0) {
          const functionResponses = [];
          for (const call of data.functionCalls) {
            const execResult = await executeToolCall(call, actionsRef.current);
            functionResponses.push({ functionResponse: { name: call.name, response: execResult } });
          }
          chatHistory = [
            ...chatHistory,
            { role: "user", parts: [{ text: message }] },
            { role: "model", parts: data.functionCalls.map(c => ({ functionCall: { name: c.name, args: c.args } })) },
          ];
          message = functionResponses;
          rounds++;
        } else {
          responseText = data.text || "";
          break;
        }
      }

      const assistantIndex = currentMessages.length + 1;
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
        : `I'm having trouble responding right now. Please try again in a moment.`;
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    }

    setIsStreaming(false);
    setIsTyping(false);
  }, [isTyping, transactions, budgets, goals, userProfile]);

  const clearChat = useCallback(() => {
    requestIdRef.current++;
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setMessages([]);
    setShowSuggestions(true);
    setIsTyping(false);
    setIsStreaming(false);
  }, []);

  return { messages, isTyping, isStreaming, showSuggestions, sendMessage, clearChat };
}
