"use client";

import React from "react";

const AVATAR_COLORS = [
  "from-blue-400 to-blue-600 text-white",
  "from-emerald-400 to-emerald-600 text-white",
  "from-amber-400 to-amber-600 text-amber-950",
  "from-purple-400 to-purple-600 text-white",
  "from-rose-400 to-rose-600 text-white",
  "from-teal-400 to-teal-600 text-white",
  "from-orange-400 to-orange-600 text-white",
  "from-indigo-400 to-indigo-600 text-white",
] as const;

const AVATAR_PASTEL_COLORS = [
  "from-blue-200 to-blue-300 text-blue-900",
  "from-emerald-200 to-emerald-300 text-emerald-900",
  "from-amber-200 to-amber-300 text-amber-900",
  "from-purple-200 to-purple-300 text-purple-900",
  "from-rose-200 to-rose-300 text-rose-900",
  "from-teal-200 to-teal-300 text-teal-900",
  "from-orange-200 to-orange-300 text-orange-900",
  "from-indigo-200 to-indigo-300 text-indigo-900",
] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface StudentAvatarProps {
  studentId: string;
  studentName: string;
  size?: "sm" | "md" | "lg";
  palette?: "default" | "pastel";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-lg",
  md: "w-14 h-14 text-2xl",
  lg: "w-20 h-20 text-4xl",
};

export function StudentAvatar({
  studentId,
  studentName,
  size = "md",
  palette = "default",
  className = "",
}: StudentAvatarProps) {
  const colors = palette === "pastel" ? AVATAR_PASTEL_COLORS : AVATAR_COLORS;
  const colorIndex = hashString(studentId) % colors.length;
  const colorClasses = colors[colorIndex];
  const initial = (studentName?.charAt(0) || "?").toUpperCase();
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div
      className={`shrink-0 rounded-full bg-linear-to-br border-2 border-white/80 shadow-md flex items-center justify-center font-display font-bold ${sizeClasses} ${colorClasses} ${className}`}
      role="img"
      aria-label={`${studentName}'s avatar`}
    >
      {initial}
    </div>
  );
}
