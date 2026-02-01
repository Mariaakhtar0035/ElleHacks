"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { BalanceHistoryEntry } from "@/types";

interface GrowthComparisonChartProps {
  history: BalanceHistoryEntry[];
  whatIfGrow: number[];
}

/**
 * Dual-line chart showing Spend vs Grow token history over time.
 * History is rendered by mapping each entry to chart data: week, spendBalance, growBalance.
 * Spend line (gold) shows ups and downs; Grow line (green) is smooth and steadily increasing.
 *
 * "What if" simulation: when "If I Grew Everything" is selected, overlays a dashed green line
 * computed by computeWhatIfGrow() - simulates 100% of earnings going to Grow with same
 * weekly earnings timing. See growthCalculator.computeWhatIfGrow for calculation details.
 */
export function GrowthComparisonChart({
  history,
  whatIfGrow,
}: GrowthComparisonChartProps) {
  const [showWhatIf, setShowWhatIf] = useState(false);

  // Map history to chart data. Spend shows raw values (ups/downs); grow is smooth.
  const chartData = history.map((h, i) => ({
    week: h.week,
    spend: h.spendBalance,
    save: h.saveBalance,
    grow: h.growBalance,
    whatIf: whatIfGrow[i] ?? 0,
  }));

  return (
    <div className="rounded-2xl border-2 border-gray-800 bg-linear-to-b from-amber-50 to-amber-100 p-6">
      <h3 className="font-display font-bold text-2xl text-gray-900 mb-2 text-center">
        Your Money Story
      </h3>

      {/* Time Machine toggle: My Real History vs If I Grew Everything */}
      <div
        className="flex flex-wrap justify-center gap-2 mb-6"
        role="tablist"
        aria-label="Time Machine: show real history or what-if scenario"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!showWhatIf}
          aria-pressed={!showWhatIf}
          onClick={() => setShowWhatIf(false)}
          className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all border-2 ${
            !showWhatIf
              ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
              : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400"
          }`}
        >
          My Real History
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showWhatIf}
          aria-pressed={showWhatIf}
          onClick={() => setShowWhatIf(true)}
          className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all border-2 ${
            showWhatIf
              ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
              : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400"
          }`}
        >
          If I Grew Everything
        </button>
      </div>

      {/* Recharts line chart: Spend (gold), Grow (green), What if (dashed when toggled) */}
      <div className="h-[300px] w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              stroke="#374151"
              style={{ fontFamily: "var(--font-fredoka), sans-serif", fontWeight: 600 }}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `Week ${v}`}
            />
            <YAxis
              stroke="#374151"
              style={{ fontFamily: "var(--font-fredoka), sans-serif", fontWeight: 600 }}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "2px solid #d1d5db",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
              labelFormatter={(label) => `Week ${label}`}
            />
            <Legend
              wrapperStyle={{ fontFamily: "var(--font-fredoka), sans-serif", fontWeight: 600 }}
              iconType="line"
              iconSize={12}
            />
            {/* Spend: gold, linear (ups and downs visible) */}
            <Line
              type="linear"
              dataKey="spend"
              name="🪙 Spend"
              stroke="#eab308"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              connectNulls
            />
            {/* Save: sky blue, steady */}
            <Line
              type="monotone"
              dataKey="save"
              name="💰 Save"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              connectNulls
            />
            {/* Grow: green, smooth and steadily increasing */}
            <Line
              type="monotone"
              dataKey="grow"
              name="🌱 Grow"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              connectNulls
            />
            {/* What if: dashed green overlay when toggle selected */}
            {showWhatIf && (
              <Line
                type="monotone"
                dataKey="whatIf"
                name="What if?"
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={true}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
