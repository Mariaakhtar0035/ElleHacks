"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getFallbackText } from "@/lib/gemini";
import type { BalanceHistoryEntry } from "@/types";
import type { Reward } from "@/types";

interface SpendingBehaviorCardProps {
  studentName: string;
  history: BalanceHistoryEntry[];
  purchasedRewardItems: Reward[];
  currentSpend: number;
  currentSave: number;
  currentGrow: number;
  saveGoal?: number;
  availableRewards?: Array<{ title: string; cost: number }>;
}

const SPENDING_BEHAVIOR_FALLBACK = "Here's a tip: try saving a little before you spend. Your future self will thank you!";

export function SpendingBehaviorCard({
  studentName,
  history,
  purchasedRewardItems,
  currentSpend,
  currentSave,
  currentGrow,
  saveGoal,
  availableRewards = [],
}: SpendingBehaviorCardProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchInsight() {
      setLoading(true);
      try {
        const purchasedRewards = purchasedRewardItems.map((r) => ({ title: r.title, cost: r.cost }));
        const response = await fetch("/api/gemini/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "SPENDING_BEHAVIOR_INSIGHT",
            studentName,
            context: {
              history,
              purchasedRewards,
              currentSpend,
              currentSave,
              currentGrow,
              saveGoal,
              availableRewards,
            },
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (isMounted) setInsight(data.explanation ?? SPENDING_BEHAVIOR_FALLBACK);
      } catch {
        if (isMounted) setInsight(getFallbackText("SPENDING_BEHAVIOR_INSIGHT"));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchInsight();
    return () => { isMounted = false; };
  }, [studentName, history, purchasedRewardItems, currentSpend, currentSave, currentGrow, saveGoal, availableRewards]);

  const insightIcons = ["💡", "🎯", "💰", "🌟"];
  const insightColors = [
    "bg-amber-50 border-l-4 border-amber-500 text-amber-900",
    "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900",
    "bg-blue-50 border-l-4 border-blue-500 text-blue-900",
    "bg-purple-50 border-l-4 border-purple-500 text-purple-900",
  ];

  return (
    <Card borderColor="border-indigo-500" className="p-6 bg-gradient-to-br from-indigo-50/50 to-violet-50/50">
      <h2 className="font-display font-bold text-2xl text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
        <span className="text-3xl">🔮</span>
        Mrs. Pennyworth&apos;s Spending Insights
      </h2>
      {loading ? (
        <p className="text-indigo-600 font-medium text-sm md:text-base italic text-center py-4">
          <span className="text-2xl inline-block animate-pulse mr-2">✨</span>
          Analyzing your spending habits…
        </p>
      ) : insight ? (
        <div className="space-y-3">
          {((): string[] => {
            const lines = insight.split(/\n+/).filter(Boolean);
            const last = lines[lines.length - 1]?.trim();
            if (lines.length > 1 && last && !/[.!?]$/.test(last)) {
              return lines.slice(0, -1);
            }
            return lines;
          })().map((paragraph, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-3 rounded-xl ${insightColors[i % insightColors.length]}`}
            >
              <span className="text-xl shrink-0">{insightIcons[i % insightIcons.length]}</span>
              <p className="font-medium text-sm md:text-base">{paragraph}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-indigo-600 font-medium text-sm md:text-base text-center py-4">
          <span className="text-2xl mr-2">💡</span>
          {SPENDING_BEHAVIOR_FALLBACK}
        </p>
      )}
    </Card>
  );
}
