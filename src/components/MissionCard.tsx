"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mission, MissionStatus } from "@/types";

/** Board-game palette: lighter tones + sky and brown. Each mission gets a stable unique color. */
const BAND_COLORS = [
  "red",
  "green",
  "blue",
  "amber",
  "orange",
  "purple",
  "sky",
  "brown",
] as const;

const BAND_CLASSES: Record<(typeof BAND_COLORS)[number], string> = {
  red: "bg-red-400 text-white",
  green: "bg-green-500 text-white",
  blue: "bg-blue-500 text-white",
  amber: "bg-amber-400 text-gray-900",
  orange: "bg-orange-400 text-gray-900",
  purple: "bg-purple-500 text-white",
  sky: "bg-sky-400 text-gray-900",
  brown: "bg-amber-700 text-white",
};

function getBandColorIndex(missionId: string): number {
  let hash = 0;
  for (let i = 0; i < missionId.length; i++) {
    hash = (hash << 5) - hash + missionId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % BAND_COLORS.length;
}

interface MissionCardProps {
  mission: Mission;
  variant?: "marketplace" | "myMission";
  studentId?: string;
  onRequest?: (missionId: string) => void;
  status?: MissionStatus;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  /** Optional message below button (e.g. "Complete and ask teacher to approve") */
  actionHint?: string;
  /** When variant is myMission and status is COMPLETED, optional callback to explain reward split */
  onExplainRewardSplit?: (mission: Mission) => void;
}

export function MissionCard({
  mission,
  variant = "marketplace",
  studentId,
  onRequest,
  status: statusProp,
  actionLabel,
  onAction,
  actionDisabled = false,
  actionHint,
  onExplainRewardSplit,
}: MissionCardProps) {
  const isMarketplace = variant === "marketplace";
  const alreadyRequested = isMarketplace && studentId ? mission.requestedBy.includes(studentId) : false;
  const isPopular = mission.requestCount > 2;
  const isHighDemand = mission.requestCount > 1 && mission.requestCount <= 2;

  const bandColorKey = mission.bandColor ?? BAND_COLORS[getBandColorIndex(mission.id)];
  const bandClasses = BAND_CLASSES[bandColorKey];

  const displayStatus = statusProp ?? mission.status;
  const showStatusBadge = !isMarketplace;

  const defaultActionLabel = isMarketplace
    ? alreadyRequested
      ? "✓ Already Requested"
      : "Request Mission"
    : actionLabel;

  return (
    <div
      className={`
        flex flex-col rounded-2xl border-2 border-gray-200 overflow-hidden
        shadow-lg transition-all duration-200
        card-hover-tilt
        min-h-[320px] aspect-3/4 w-full
      `}
    >
      {/* Top color band - ~25% height, unique color per mission, rounded top only, title centered */}
      <div
        className={`min-h-[25%] shrink-0 px-4 py-4 flex items-center justify-between gap-2 rounded-t-2xl ${bandClasses}`}
      >
        <div className="flex-1 flex justify-center min-w-0">
          <span className="font-display font-bold text-lg uppercase tracking-wider leading-tight text-center text-white">
            {mission.title}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
          {isMarketplace && isPopular && <Badge type="popular" />}
          {isMarketplace && isHighDemand && !isPopular && <Badge type="high_demand" />}
          {isMarketplace && isPopular && (
            <span className="text-xs px-2 py-0.5 bg-white/20 rounded-lg font-bold text-white">
              {mission.requestCount} want
            </span>
          )}
        </div>
      </div>

      {/* Card body - cream, paper feel */}
      <div className="card-paper flex-1 flex flex-col min-h-0 p-5 border-t-2 border-gray-200">
        {/* 1. Description */}
        <p className="text-gray-700 leading-relaxed text-sm shrink-0 pb-3 border-b border-gray-200">
          {mission.description}
        </p>

        {/* 2. Reward block - large number, icon, TOKEN REWARD */}
        <div className="py-4 border-b border-gray-200">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl py-3 px-4 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-extrabold text-3xl text-amber-900">
                {mission.currentReward}
              </span>
              <span className="text-2xl" aria-hidden="true">
                🪙
              </span>
            </div>
            <span className="font-display font-bold text-xs uppercase tracking-wide text-amber-800 mt-1">
              Token Reward
            </span>
            {mission.currentReward < mission.baseReward && (
              <p className="text-xs text-gray-500 mt-0.5">
                Base: {mission.baseReward}
              </p>
            )}
          </div>
        </div>

        {/* 3. Status badge */}
        {showStatusBadge && (
          <div className="py-3 border-b border-gray-200 flex justify-center">
            <Badge status={displayStatus} />
          </div>
        )}

        {/* 4. Action button */}
        <div className="pt-4 mt-auto flex flex-col gap-2">
          {isMarketplace && (
            <Button
              variant={alreadyRequested ? "secondary" : "primary"}
              onClick={() => onRequest?.(mission.id)}
              disabled={alreadyRequested}
              className="w-full"
            >
              {defaultActionLabel}
            </Button>
          )}
          {!isMarketplace && defaultActionLabel && onAction && (
            <Button
              variant={displayStatus === "COMPLETED" ? "secondary" : "primary"}
              onClick={onAction}
              disabled={actionDisabled}
              className="w-full"
            >
              {defaultActionLabel}
            </Button>
          )}
          {!isMarketplace && actionHint && (
            <p className="text-xs text-gray-600 text-center">{actionHint}</p>
          )}
          {!isMarketplace && displayStatus === "COMPLETED" && onExplainRewardSplit && (
            <button
              type="button"
              onClick={() => onExplainRewardSplit(mission)}
              className="text-xs font-display font-bold text-blue-600 hover:text-blue-800 underline underline-offset-1 mt-1"
            >
              Why did I get this split?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
