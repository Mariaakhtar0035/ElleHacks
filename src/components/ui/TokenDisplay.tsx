import React from "react";

interface TokenDisplayProps {
  amount: number;
  type: "spend" | "grow";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
  showLock?: boolean;
}

export function TokenDisplay({
  amount,
  type,
  size = "md",
  showLabel = true,
  animate = false,
  showLock = type === "grow",
}: TokenDisplayProps) {
  const sizeConfig = {
    sm: { chip: "w-10 h-10", text: "text-lg", icon: "text-base" },
    md: { chip: "w-14 h-14", text: "text-2xl", icon: "text-xl" },
    lg: { chip: "w-20 h-20", text: "text-4xl", icon: "text-3xl" },
  };

  const config = sizeConfig[size];

  const isSpend = type === "spend";

  return (
    <div className={`flex items-center gap-3 ${animate ? "coin-animation" : ""}`}>
      {/* Coin/Chip visual */}
      <div
        className={`relative ${config.chip} rounded-full flex items-center justify-center shadow-lg
          ${isSpend 
            ? "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-700/50 ring-2 ring-amber-200/50" 
            : "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 border-2 border-blue-700/50 ring-2 ring-blue-200/50"
          }`}
        title={type === "spend" ? "Spend Tokens" : "Grow Tokens"}
      >
        <span className={`${config.icon} drop-shadow-sm`}>
          {isSpend ? "🪙" : "🌱"}
        </span>
        {showLock && type === "grow" && (
          <span
            className="absolute -top-1 -right-1 text-xs bg-blue-700 text-white rounded-full p-0.5"
            title="Locked and growing! You can't spend these yet."
          >
            🔒
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span
          className={`font-display font-bold ${config.text} ${
            isSpend ? "text-amber-800" : "text-blue-800"
          }`}
        >
          {amount}
        </span>
        {showLabel && (
          <span className="text-sm text-gray-600 font-medium">
            {type === "spend" ? "Spend" : "Grow"} Tokens
          </span>
        )}
      </div>
    </div>
  );
}
