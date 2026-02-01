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
      <svg
        viewBox="0 0 64 64"
        className="w-[85%] h-[85%]"
        aria-hidden
      >
        {/* Top hat */}
        <ellipse cx="32" cy="18" rx="12" ry="3" fill="#0d9488" />
        <rect x="22" y="4" width="20" height="16" rx="2" fill="#0d9488" />
        <rect x="24" y="2" width="16" height="3" rx="1" fill="#14b8a6" />

        {/* Face / head */}
        <circle cx="32" cy="38" r="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Smart glasses */}
        <g className={isThinking ? "animate-pennyworth-glasses" : ""}>
          <rect x="18" y="34" width="12" height="8" rx="2" fill="none" stroke="#0f766e" strokeWidth="2" />
          <rect x="34" y="34" width="12" height="8" rx="2" fill="none" stroke="#0f766e" strokeWidth="2" />
          <line x1="30" y1="38" x2="34" y2="38" stroke="#0f766e" strokeWidth="1.5" />
          <line x1="16" y1="38" x2="18" y2="38" stroke="#0f766e" strokeWidth="1" />
          <line x1="46" y1="38" x2="48" y2="38" stroke="#0f766e" strokeWidth="1" />
        </g>

        {/* Eyes */}
        <circle cx="24" cy="37" r="2" fill="#1f2937" className={state === "idle" ? "animate-pennyworth-blink" : ""} />
        <circle cx="40" cy="37" r="2" fill="#1f2937" className={state === "idle" ? "animate-pennyworth-blink" : ""} />

        {/* Smile */}
        <path
          d="M 26 44 Q 32 50 38 44"
          fill="none"
          stroke="#1f2937"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={isEncouraging ? "animate-pennyworth-smile" : ""}
        />

        {/* Blazer collar / token pin area */}
        <path d="M 24 52 L 32 58 L 40 52" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="54" r="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" className={isThinking ? "animate-pennyworth-token-spin" : ""} />
        <circle cx="32" cy="54" r="2" fill="#fcd34d" />
      </svg>
    </div>
  );
}
