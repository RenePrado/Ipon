import { useState, useCallback } from "react";
import { generateAIInsight } from "../services/ai";

const CACHE_KEY = "ipon_ai_insight";
const CACHE_TTL = 24 * 60 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.text || !parsed.timestamp) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(text) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ text, timestamp: Date.now() }));
  } catch {
    // ignore storage errors
  }
}

export function useAI(transactions, categories) {
  const [insight, setInsight] = useState(() => readCache()?.text || "");
  const [insightError, setInsightError] = useState("");
  const [insightStale, setInsightStale] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);

  const loadInsight = useCallback(async (force = false) => {
    setInsightLoading(true);
    setInsightError("");
    setInsightStale(false);

    if (!force) {
      const cached = readCache();
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setInsight(cached.text);
        setInsightLoading(false);
        return;
      }
    }

    const result = await generateAIInsight(transactions, categories);

    if (result.success) {
      setInsight(result.insight);
      setInsightStale(false);
      writeCache(result.insight);
    } else {
      const cached = readCache();
      if (cached) {
        setInsight(cached.text);
        setInsightStale(true);
        setInsightError(result.error);
      } else {
        setInsightError(result.error);
      }
    }

    setInsightLoading(false);
  }, [transactions, categories]);

  return { insight, insightError, insightStale, insightLoading, loadInsight };
}
