import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "px-6 py-3 rounded-xl font-display font-bold text-base transition-all duration-200 opacity-100 select-none " +
    "border-2 shadow-md " +
    "hover:-translate-y-0.5 hover:shadow-lg " +
    "active:translate-y-0.5 active:shadow-sm " +
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:hover:translate-y-0 disabled:active:translate-y-0";

  const variantClasses = {
    primary:
      "bg-blue-500 text-white border-blue-500/80 hover:bg-blue-600 hover:border-blue-600",
    secondary:
      "bg-amber-100 text-gray-800 border-amber-300 hover:bg-amber-200 hover:border-amber-400",
    success:
      "bg-emerald-500 text-white border-emerald-500/80 hover:bg-emerald-600 hover:border-emerald-600",
    danger:
      "bg-red-500 text-white border-red-500/80 hover:bg-red-600 hover:border-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
