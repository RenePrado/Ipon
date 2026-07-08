import { GoogleGenerativeAI } from "@google/generative-ai";
import { thisMonth } from "../lib/formatters";
import { reportError } from "./errorReporter";

export async function generateAIInsight(transactions, categories) {
  const key = process.env.REACT_APP_GEMINI_KEY;
  if (!key || key.trim() === "" || key === "undefined") {
    return { success: false, error: "AI insights are not configured" };
  }

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const month = thisMonth();
  const monthTx = transactions.filter(t => t.date?.startsWith(month));

  if (monthTx.length === 0) {
    return { success: false, error: "Add some transactions this month to get AI insights." };
  }

  const summary = {};
  monthTx.forEach(t => {
    const cat = categories.find(c => c.name === t.category);
    const key = `${t.type}:${cat?.name || "Other"}`;
    summary[key] = (summary[key] || 0) + Number(t.amount);
  });

  const prompt = `You're a friendly personal finance advisor helping a friend. Here's their spending summary for ${month} in Philippine Peso (₱):\n${JSON.stringify(summary, null, 2)}\n\nWrite 2-3 quick, practical tips in a casual conversational tone. Like you're texting a friend. No numbered lists. Just natural advice. Keep it under 80 words.`;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), 15000);
  });

  const apiPromise = model.generateContent(prompt);

  try {
    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    if (response.response.text()) {
      return { success: true, insight: response.response.text() };
    } else {
      return { success: false, error: "No insight returned. Try adding more transactions." };
    }
  } catch (e) {
    reportError('ai', e, { operation: 'generateAIInsight' });
    if (e.message === "Request timeout") {
      return { success: false, error: "AI insights took too long to load. Please try again." };
    } else {
      return { success: false, error: "AI insight unavailable: " + e.message };
    }
  }
}
