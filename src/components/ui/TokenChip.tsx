import React from "react";

interface TokenChipProps {
  amount: number;
  type?: "spend" | "grow";
  size?: "sm" | "md";
}

export function TokenChip({
  amount,
  type = "spend",
  size = "md",
}: TokenChipProps) {
  const isSpend = type === "spend";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-display font-bold
        ${isSpend 
          ? "bg-amber-100 border-2 border-amber-300 text-amber-900" 
          : "bg-blue-100 border-2 border-blue-300 text-blue-900"
        }
        ${size === "sm" ? "text-sm" : "text-base"}
      `}
    >
      <span>{isSpend ? "🪙" : "🌱"}</span>
      <span>{amount}</span>
    </div>
  );
}
