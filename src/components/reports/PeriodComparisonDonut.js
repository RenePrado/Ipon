import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fmt } from "../../lib/formatters";
import { CATEGORY_COLORS } from "../../constants";
import { getPeriodData } from "../../lib/calculations";

// Convert data to Recharts format
const convertToChartData = (data) => {
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const renderDonut = (data, total, label, period) => {
  if (total === 0) {
    return (
      <div className="text-center min-w-[160px]">
        <div className="w-40 h-40 rounded-full bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 mx-auto flex items-center justify-center border-2 border-border dark:border-dark-border">
          <div>
            <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary uppercase">No data</div>
          </div>
        </div>
        <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary mt-2">{label}</div>
      </div>
    );
  }

  return (
    <div className="text-center min-w-[160px]">
      <div className="relative w-40 h-40 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={period}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || 'var(--color-category-other)'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => fmt(value)}
              contentStyle={{
                background: "var(--color-tooltip-bg)",
                border: "1px solid var(--color-tooltip-border)",
                borderRadius: "8px",
                color: "var(--color-tooltip-text)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-xl font-bold font-mono text-text-primary dark:text-dark-text-primary">{fmt(total)}</div>
          <div className="text-[9px] text-text-tertiary dark:text-dark-text-tertiary uppercase">Total</div>
        </div>
      </div>
      <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary mt-2">{label}</div>
    </div>
  );
};

export function PeriodComparisonDonut({ transactions, categories }) {
  const [period, setPeriod] = useState("month");

  const { currentData, previousData, currentTotal, previousTotal } = getPeriodData(transactions, categories, period);

  const currentChartData = convertToChartData(currentData);
  const previousChartData = convertToChartData(previousData);

  const allCategories = [...new Set([...Object.keys(currentData), ...Object.keys(previousData)])];

  return (
    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">
      <div className="flex justify-between items-center mb-5">
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm">Period Comparison</div>
        <div className="flex gap-2">
          {["day", "week", "month"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2.5 rounded-md text-xs font-medium transition-colors duration-300 ${
                period === p 
                  ? "bg-accent-primary text-white border-none" 
                  : "bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-secondary dark:text-dark-text-secondary border border-border dark:border-dark-border"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-around items-center gap-4 mb-5">
        {renderDonut(previousChartData, previousTotal, period === "day" ? "Yesterday" : period === "week" ? "Last Week" : "Last Month", period)}
        {renderDonut(currentChartData, currentTotal, period === "day" ? "Today" : period === "week" ? "This Week" : "This Month", period)}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {allCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[cat] || 'var(--color-category-other)' }} />
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
