import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  borderColor?: string;
}

export function Card({ children, className = "", onClick, borderColor = "border-gray-200" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border-2 ${borderColor} overflow-hidden
        shadow-lg transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
