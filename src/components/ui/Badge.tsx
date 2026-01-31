import React from "react";
import { MissionStatus } from "@/types";

type BadgeType = MissionStatus | "popular" | "high_demand" | "locked" | "assigned";

interface BadgeProps {
  status?: MissionStatus;
  type?: BadgeType;
  className?: string;
  label?: string;
}

export function Badge({ status, type, className = "", label }: BadgeProps) {
  const badgeType = type ?? status ?? "AVAILABLE";

  const badgeConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    AVAILABLE: {
      bg: "bg-gray-200",
      text: "text-gray-800",
      label: "Available",
      icon: "○",
    },
    REQUESTED: {
      bg: "bg-amber-400",
      text: "text-amber-950",
      label: "Assigned",
      icon: "⏳",
    },
    IN_PROGRESS: {
      bg: "bg-blue-500",
      text: "text-white",
      label: "In Progress",
      icon: "▶",
    },
    COMPLETED: {
      bg: "bg-emerald-500",
      text: "text-white",
      label: "Completed",
      icon: "✓",
    },
    popular: {
      bg: "bg-amber-300",
      text: "text-amber-900",
      label: "Popular!",
      icon: "🔥",
    },
    high_demand: {
      bg: "bg-orange-200",
      text: "text-orange-900",
      label: "High Demand",
      icon: "📈",
    },
    locked: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Locked",
      icon: "🔒",
    },
    assigned: {
      bg: "bg-purple-200",
      text: "text-purple-900",
      label: "Assigned",
      icon: "👤",
    },
  };

  const config = badgeConfig[badgeType] ?? badgeConfig.AVAILABLE;
  const displayLabel = label ?? config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border-2 border-black/10 shadow-sm ${config.bg} ${config.text} ${className}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{displayLabel}</span>
    </span>
  );
}
