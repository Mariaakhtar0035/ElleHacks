"use client";

import React from "react";

export type MrsPennyworthState =
  | "idle"
  | "thinking"
  | "speaking"
  | "encouraging"
  | "celebration";

interface MrsPennyworthAvatarProps {
  state?: MrsPennyworthState;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

export function MrsPennyworthAvatar({
  state = "idle",
  size = "md",
  className = "",
}: MrsPennyworthAvatarProps) {
  const sizeClass = SIZE_CLASSES[size];
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";
  const isEncouraging = state === "encouraging";
  const isCelebration = state === "celebration";

  return (
    <div
      className={`
        ${sizeClass} rounded-full overflow-hidden shrink-0
        bg-linear-to-b from-teal-100 to-teal-200
        border-2 border-teal-400/60
        flex items-center justify-center
        shadow-md
        ${state === "idle" ? "animate-pennyworth-idle" : ""}
        ${isThinking ? "animate-pennyworth-thinking" : ""}
        ${isSpeaking ? "animate-pennyworth-speaking" : ""}
        ${isEncouraging ? "animate-pennyworth-encouraging" : ""}
        ${isCelebration ? "animate-pennyworth-celebration" : ""}
        ${className}
      `}
      role="img"
      aria-label="Mrs. Pennyworth"
    >
      <img
        src="/mrs-pennyworth.png"
        alt="Mrs. Pennyworth"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
