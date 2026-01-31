import React from "react";

type HeaderColor = "blue" | "green" | "amber" | "purple" | "red";

interface GameCardProps {
  title?: string;
  headerColor?: HeaderColor;
  children: React.ReactNode;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

const headerColors: Record<HeaderColor, string> = {
  blue: "bg-blue-500 text-white border-b-blue-600",
  green: "bg-emerald-500 text-white border-b-emerald-600",
  amber: "bg-amber-500 text-white border-b-amber-600",
  purple: "bg-purple-500 text-white border-b-purple-600",
  red: "bg-red-500 text-white border-b-red-600",
};

export function GameCard({
  title,
  headerColor = "blue",
  children,
  badge,
  className = "",
  onClick,
}: GameCardProps) {
  return (
    <div
      className={`
        bg-white rounded-3xl border-4 border-gray-800 overflow-hidden
        shadow-[4px_4px_0_rgba(0,0,0,0.15)]
        transition-all duration-200
        hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {title && (
        <div
          className={`px-6 py-3 font-display font-bold text-lg border-b-4 ${headerColors[headerColor]} flex items-center justify-between`}
        >
          <span>{title}</span>
          {badge && (
            <span className="text-sm px-2 py-0.5 bg-white/20 rounded-lg">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
