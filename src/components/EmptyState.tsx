import React from "react";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        bg-white rounded-3xl border-4 border-gray-800 p-12 text-center
        shadow-[4px_4px_0_rgba(0,0,0,0.1)]
        ${className}
      `}
    >
      <div className="text-7xl mb-4 bounce-in">{emoji}</div>
      <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
