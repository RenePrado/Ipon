import { useState, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { fmt, fmtCompact } from "../../lib/formatters";
import { CATEGORY_COLORS } from "../../constants";
import { getPeriodData } from "../../lib/calculations";

const CHART_SIZE = 160;
const CY = CHART_SIZE / 2;
const INNER_RADIUS = 50;
const OUTER_RADIUS = 70;

const convertToChartData = (data) => {
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const renderActiveShape = (props) => {
  return (
    <g style={{ transition: "all 250ms ease-out" }}>
      <Sector
        cx={props.cx}
        cy={props.cy}
        innerRadius={props.innerRadius}
        outerRadius={props.outerRadius + 5}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        fill={props.fill}
        cornerRadius={props.cornerRadius}
        paddingAngle={props.paddingAngle}
        style={{ transition: "all 250ms ease-out" }}
      />
    </g>
  );
};

const DonutTooltipContent = ({ entry }) => {
  const color = CATEGORY_COLORS[entry.name] || "var(--color-category-other)";
  return (
    <div
      style={{
        background: "var(--color-tooltip-bg)",
        border: "1px solid var(--color-tooltip-border)",
        borderRadius: "8px",
        padding: "8px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ color: "var(--color-tooltip-text)", opacity: 0.6, fontSize: "12px", fontWeight: 500 }}>{entry.name}</span>
      </div>
      <div style={{ color: "var(--color-tooltip-text)", fontSize: "14px", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {fmtCompact(entry.value)}
      </div>
    </div>
  );
};

const DonutChart = ({ data, total, label, period }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const hoverTimer = useRef(null);
  const currentActive = useRef(null);
  const lastEntryRef = useRef(null);
  const [tooltipShown, setTooltipShown] = useState(false);

  const handleMouseEnter = useCallback((_, index) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (index !== currentActive.current) {
      currentActive.current = index;
      setActiveIndex(index);
      setTooltipShown(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      currentActive.current = null;
      setActiveIndex(null);
      setTooltipShown(false);
      hoverTimer.current = null;
    }, 150);
  }, []);

  if (total === 0) {
    return (
      <div className="text-center min-w-[140px] sm:min-w-[160px]">
        <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 mx-auto flex items-center justify-center border border-border dark:border-dark-border">
          <div>
            <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary uppercase">No data</div>
          </div>
        </div>
        <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary mt-2">{label}</div>
      </div>
    );
  }

  if (activeIndex !== null) {
    lastEntryRef.current = data[activeIndex];
  }

  return (
    <div className="text-center min-w-[140px] sm:min-w-[160px]">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={period}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={INNER_RADIUS}
              outerRadius={OUTER_RADIUS}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              activeIndex={activeIndex !== null ? [activeIndex] : []}
              activeShape={renderActiveShape}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || "var(--color-category-other)"}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                  style={{ transition: "opacity 250ms ease-out" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — always visible */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
          <div className="text-xl font-semibold tabular-nums text-text-primary dark:text-dark-text-primary">{fmt(total)}</div>
          <div className="text-[9px] text-text-tertiary dark:text-dark-text-tertiary uppercase">Total</div>
        </div>

        {/* Custom tooltip positioned outside the donut */}
        {tooltipShown && lastEntryRef.current && (
          <div
            className="absolute transition-all duration-200 ease-out"
            style={{
              left: `${CHART_SIZE + 10}px`,
              top: `${CY}px`,
              transform: "translate(0, -50%)",
              zIndex: 50,
              pointerEvents: "none",
              opacity: activeIndex !== null ? 1 : 0,
            }}
          >
            <DonutTooltipContent entry={lastEntryRef.current} />
          </div>
        )}
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
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider">Period Comparison</div>
        <div className="flex gap-2">
          {["day", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? "bg-accent-primary text-white"
                  : "border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-8 mb-5">
        <DonutChart
          data={previousChartData}
          total={previousTotal}
          label={period === "day" ? "Yesterday" : period === "week" ? "Last Week" : "Last Month"}
          period={period}
        />
        <DonutChart
          data={currentChartData}
          total={currentTotal}
          label={period === "day" ? "Today" : period === "week" ? "This Week" : "This Month"}
          period={period}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {allCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[cat] || "var(--color-category-other)" }} />
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

