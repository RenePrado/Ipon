// ─── CALCULATIONS ──────────────────────────────────────────────────────────────
export const getCat = (name, categories) => (categories || []).find(c => c.name === name);

export const getPeriodData = (transactions, categories, period) => {
  const safeTransactions = transactions || [];
  const safeCategories = categories || [];
  const today = new Date();
  let currentData = {};
  let previousData = {};
  let currentTotal = 0;
  let previousTotal = 0;

  const processTx = (t, data, total) => {
    const cat = getCat(t.category, safeCategories);
    const name = cat?.name || "Other";
    const amount = parseFloat(t.amount) || 0;
    data[name] = (data[name] || 0) + amount;
    return total + amount;
  };

  const processCurrentTx = (t) => {
    currentTotal = processTx(t, currentData, currentTotal);
  };

  const processPreviousTx = (t) => {
    previousTotal = processTx(t, previousData, previousTotal);
  };

  if (period === "day") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const todayTx = safeTransactions.filter(t => t.date === todayStr && t.type === "expense");
    const yesterdayTx = safeTransactions.filter(t => t.date === yesterdayStr && t.type === "expense");

    todayTx.forEach(processCurrentTx);
    yesterdayTx.forEach(processPreviousTx);
  } else if (period === "week") {
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    for (let i = 0; i < 7; i++) {
      const thisDate = new Date(thisWeekStart);
      thisDate.setDate(thisWeekStart.getDate() + i);
      const thisDateStr = `${thisDate.getFullYear()}-${String(thisDate.getMonth() + 1).padStart(2, '0')}-${String(thisDate.getDate()).padStart(2, '0')}`;
      const lastDate = new Date(lastWeekStart);
      lastDate.setDate(lastWeekStart.getDate() + i);
      const lastDateStr = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`;

      const thisWeekTx = safeTransactions.filter(t => t.date === thisDateStr && t.type === "expense");
      const lastWeekTx = safeTransactions.filter(t => t.date === lastDateStr && t.type === "expense");

      thisWeekTx.forEach(processCurrentTx);
      lastWeekTx.forEach(processPreviousTx);
    }
  } else if (period === "month") {
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthTx = safeTransactions.filter(t => {
      const txDate = new Date(t.date);
      return t.type === "expense" && txDate >= thisMonthStart && txDate <= thisMonthEnd;
    });

    const lastMonthTx = safeTransactions.filter(t => {
      const txDate = new Date(t.date);
      return t.type === "expense" && txDate >= lastMonthStart && txDate <= lastMonthEnd;
    });

    thisMonthTx.forEach(processCurrentTx);
    lastMonthTx.forEach(processPreviousTx);
  }

  return { currentData, previousData, currentTotal, previousTotal };
};
