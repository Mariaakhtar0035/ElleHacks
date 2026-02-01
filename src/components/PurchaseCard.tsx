"use client";

import { useState } from "react";
import { TokenChip } from "@/components/ui/TokenChip";
import type { Reward } from "@/types";

interface PurchaseCardProps {
  reward: Reward;
}

export function PurchaseCard({ reward }: PurchaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Simplify description to first 60 chars
  const shortDescription = reward.description.substring(0, 60);
  const needsTruncation = reward.description.length > 60;

  return (
    <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-3 flex flex-col hover:shadow-md transition-shadow">
      {/* Icon and title */}
      <div className="text-center mb-2">
        <div className="text-4xl mb-2">{reward.icon}</div>
        <h3 className="font-display font-bold text-gray-900 text-sm line-clamp-2">
          {reward.title}
        </h3>
      </div>

      {/* Description - expandable */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs text-gray-700 mb-2 leading-snug">
          {isExpanded ? reward.description : shortDescription}
          {needsTruncation && !isExpanded && "..."}
        </p>

        {/* Expand/collapse button */}
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-emerald-600 font-display font-bold hover:text-emerald-800 transition-colors mb-2 self-start"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Cost */}
      <TokenChip amount={reward.cost} type="spend" size="sm" />
    </div>
  );
}
