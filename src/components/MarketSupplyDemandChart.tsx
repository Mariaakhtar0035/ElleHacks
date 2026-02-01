"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { Mission } from "@/types";

const MAX_MISSIONS = 8;
const TITLE_LENGTH = 14;

interface MarketSupplyDemandChartProps {
  missions: Mission[];
}

function truncate(s: string, len: number): string {
  if (s.length <= len) return s;
  return s.slice(0, len).trim() + "…";
}

export function MarketSupplyDemandChart({ missions }: MarketSupplyDemandChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...missions].sort(
      (a, b) => b.requestCount - a.requestCount,
    );
    return sorted.slice(0, MAX_MISSIONS).map((m) => ({
      name: truncate(m.title, TITLE_LENGTH),
      fullTitle: m.title,
      baseReward: m.baseReward,
      currentReward: m.currentReward,
      requestCount: m.requestCount,
    }));
  }, [missions]);

  const hasData = chartData.length > 0;

  if (!hasData) {
    return (
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <h3 className="text-lg font-bold mb-2 text-amber-900">
          Supply & Demand at a Glance
        </h3>
        <p className="text-amber-800 text-center py-8">
          Request missions to see supply & demand in action!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
      <h3 className="font-display font-bold text-xl text-amber-900 mb-4 text-center">
        Supply & Demand at a Glance
      </h3>
      <p className="text-sm text-amber-800 mb-4 text-center">
        Gray = full price (no requests). Orange = current price (popular = lower).
      </p>
      <div className="h-[280px] w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            barCategoryGap="20%"
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#92400e"
              style={{
                fontFamily: "var(--font-fredoka), sans-serif",
                fontWeight: 600,
              }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#92400e"
              style={{
                fontFamily: "var(--font-fredoka), sans-serif",
                fontWeight: 600,
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "2px solid #f59e0b",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0]?.payload as { fullTitle?: string; baseReward?: number; currentReward?: number; requestCount?: number } | undefined;
                if (!p) return null;
                return (
                  <div className="px-4 py-3 rounded-xl bg-white shadow-lg border-2 border-amber-200">
                    <p className="font-bold text-gray-900 mb-2">{p.fullTitle}</p>
                    <p className="text-sm text-gray-600">
                      Base price: {p.baseReward} tokens · Current: {p.currentReward} tokens
                    </p>
                    <p className="text-sm text-gray-600">
                      {p.requestCount} request{p.requestCount === 1 ? "" : "s"}
                    </p>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-fredoka), sans-serif",
                fontWeight: 600,
              }}
              iconType="square"
              iconSize={12}
            />
            <Bar
              dataKey="baseReward"
              name="Base price (full)"
              fill="#9ca3af"
              radius={[4, 4, 0, 0]}
              isAnimationActive
            />
            <Bar
              dataKey="currentReward"
              name="Current price"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
