import { useState, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { fmt, fmtCompact } from "../../lib/formatters";
import { CATEGORY_COLORS } from "../../constants";
import { getPeriodData } from "../../lib/calculations";

const CHART_SIZE = 160;
const CX = CHART_SIZE / 2;
const CY = CHART_SIZE / 2;
const INNER_RADIUS = 50;
const OUTER_RADIUS = 70;
const TOOLTIP_OFFSET = 20;
const TOOLTIP_W = 120;
const TOOLTIP_H = 52;

const convertToChartData = (data) => {
  return Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const computeSliceAngles = (data, total) => {
  let currentAngle = 0;
  return data.map((entry) => {
    const sliceAngle = (entry.value / total) * 360;
    const midAngle = currentAngle + sliceAngle / 2;
    currentAngle += sliceAngle;
    return { ...entry, midAngle };
  });
};

const getTooltipPlacement = (midAngle) => {
  const rad = (midAngle * Math.PI) / 180;
  const distance = OUTER_RADIUS + TOOLTIP_OFFSET;
  let x = CX + distance * Math.sin(rad);
  let y = CY - distance * Math.cos(rad);

  const angle = ((midAngle % 360) + 360) % 360;

  let transform;
  if (angle >= 315 || angle < 45) {
    transform = "translate(-50%, -100%)";
  } else if (angle >= 45 && angle < 135) {
    transform = "translate(0, -50%)";
  } else if (angle >= 135 && angle < 225) {
    transform = "translate(-50%, 0)";
  } else {
    transform = "translate(-100%, -50%)";
  }

  // Collision detection: estimate tooltip bounds after transform
  let estTop;
  if (angle >= 315 || angle < 45) {
    estTop = y - TOOLTIP_H;
  } else if (angle >= 45 && angle < 135) {
    estTop = y - TOOLTIP_H / 2;
  } else if (angle >= 135 && angle < 225) {
    estTop = y;
  } else {
    estTop = y - TOOLTIP_H / 2;
  }

  // Flip if tooltip would overflow container vertically
  const margin = 2;
  if (estTop < margin) {
    y = CY + distance * Math.cos(rad);
    transform = "translate(-50%, 0)";
  } else if (estTop + TOOLTIP_H > CHART_SIZE - margin) {
    y = CY - distance * Math.cos(rad);
    transform = "translate(-50%, -100%)";
  }

  return { x, y, transform };
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
        background: "#141824",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500 }}>{entry.name}</span>
      </div>
      <div style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 600, fontFamily: "monospace" }}>
        {fmtCompact(entry.value)}
      </div>
    </div>
  );
};

const DonutChart = ({ data, total, label, period }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const hoverTimer = useRef(null);
  const currentActive = useRef(null);

  const handleMouseEnter = useCallback((_, index) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (index !== currentActive.current) {
      currentActive.current = index;
      setActiveIndex(index);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      currentActive.current = null;
      setActiveIndex(null);
      hoverTimer.current = null;
    }, 80);
  }, []);

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

  const slicesWithAngles = computeSliceAngles(data, total);
  const placement =
    activeIndex !== null ? getTooltipPlacement(slicesWithAngles[activeIndex].midAngle) : null;

  return (
    <div className="text-center min-w-[160px]">
      <div className="relative w-40 h-40 mx-auto overflow-visible">
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
          <div className="text-xl font-bold font-mono text-text-primary dark:text-dark-text-primary">{fmt(total)}</div>
          <div className="text-[9px] text-text-tertiary dark:text-dark-text-tertiary uppercase">Total</div>
        </div>

        {/* Custom tooltip positioned outside the donut */}
        {activeIndex !== null && data[activeIndex] && placement && (
          <div
            className="absolute"
            style={{
              left: `${placement.x}px`,
              top: `${placement.y}px`,
              transform: placement.transform,
              zIndex: 50,
              pointerEvents: "none",
              willChange: "transform, opacity",
              opacity: 1,
              animation: "donutTooltipIn 200ms ease-out",
            }}
          >
            <DonutTooltipContent entry={data[activeIndex]} />
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
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm">Period Comparison</div>
        <div className="flex gap-2">
          {["day", "week", "month"].map((p) => (
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

