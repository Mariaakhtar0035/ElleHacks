"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getStudent } from "@/lib/store";
import { Mission, MissionStatus } from "@/types";

/** Muted pastel header colors (soft blue/green/yellow tones) */
const BAND_COLORS = [
  "green",
  "darkBlue",
  "lightBlue",
  "red",
  "yellow",
  "orange",
  "brown",
  "purple",
] as const;

const BAND_CLASSES: Record<(typeof BAND_COLORS)[number], string> = {
  green: "bg-green-100 text-black",
  darkBlue: "bg-blue-100 text-black",
  lightBlue: "bg-sky-100 text-black",
  red: "bg-red-100 text-black",
  yellow: "bg-amber-100 text-black",
  orange: "bg-orange-100 text-black",
  brown: "bg-amber-200 text-black",
  purple: "bg-purple-100 text-black",
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
  variant?: "marketplace" | "myMission" | "teacher";
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
  /** Optional: pass assigned student name (e.g. from teacher view). If omitted, resolves from store when possible. */
  assignedStudentName?: string;
  /** Teacher variant: callbacks for Edit, Delete, Assign */
  onEdit?: (mission: Mission) => void;
  onDelete?: (mission: Mission) => void;
  onAssign?: (mission: Mission) => void;
  /** Marketplace: when reward dropped (Base: X), callback to explain why */
  onExplainPriceDrop?: (mission: Mission) => void;
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
  assignedStudentName: assignedStudentNameProp,
  onEdit,
  onDelete,
  onAssign,
  onExplainPriceDrop,
}: MissionCardProps) {
  const isMarketplace = variant === "marketplace";
  const isTeacher = variant === "teacher";
  const alreadyRequested =
    isMarketplace && studentId
      ? mission.requestedBy.includes(studentId)
      : false;
  const isPopular = mission.requestCount > 2;
  const isHighDemand = mission.requestCount > 1 && mission.requestCount <= 2;

  const rawKey =
    mission.bandColor ?? BAND_COLORS[getBandColorIndex(mission.id)];
  const bandColorKey =
    rawKey in BAND_CLASSES
      ? rawKey
      : BAND_COLORS[getBandColorIndex(mission.id)];
  const bandClasses =
    BAND_CLASSES[bandColorKey as (typeof BAND_COLORS)[number]];

  const displayStatus = statusProp ?? mission.status;
  const showStatusBadge = !isMarketplace || isTeacher;

  const assignedStudentName =
    assignedStudentNameProp ??
    (mission.assignedStudentId
      ? getStudent(mission.assignedStudentId)?.name
      : undefined);
  const requestedByNames = mission.requestedBy
    .map((id) => getStudent(id)?.name)
    .filter((n): n is string => !!n);

  const defaultActionLabel = isMarketplace
    ? alreadyRequested
      ? "✓ Already Requested"
      : "Request Mission"
    : actionLabel;

  return (
    <div className="flex flex-col min-h-[320px] w-full border-2 border-black bg-white">
      {/* Inner double-border panel */}
      <div className="flex flex-col flex-1 min-h-0 m-1 border border-black bg-white">
        {/* Header - muted pastel, thick black bottom border, two centered rows */}
        <div
          className={`shrink-0 px-4 py-3 border-b-2 border-black ${bandClasses}`}
        >
          <div className="text-center text-xs font-bold uppercase tracking-wider">
            Mission
          </div>
          <div className="text-center font-bold uppercase text-base tracking-wide mt-0.5 leading-tight">
            {mission.title}
          </div>
          {isMarketplace && (isPopular || isHighDemand) && (
            <div className="flex justify-center gap-2 mt-2">
              {isPopular && (
                <span className="text-xs font-bold uppercase px-2 py-0.5 border border-black bg-white">
                  Popular
                </span>
              )}
              {isHighDemand && !isPopular && (
                <span className="text-xs font-bold uppercase px-2 py-0.5 border border-black bg-white">
                  High Demand
                </span>
              )}
              {isPopular && (
                <span className="text-xs font-bold uppercase">
                  {mission.requestCount} want
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body - vertical list, left label right value */}
        <div className="flex-1 flex flex-col min-h-0 p-4 border-b border-black">
          <div className="flex justify-between items-start gap-4 text-sm mb-2">
            <span className="uppercase font-bold shrink-0">Description</span>
            <span className="text-right font-normal">
              {mission.description}
            </span>
          </div>

          {(isTeacher || assignedStudentName || mission.requestCount > 0) && (
            <div className="flex justify-between items-center gap-4 text-xs py-2 border-t border-black">
              <span className="uppercase font-bold shrink-0">
                {isTeacher ? "Assigned to" : "Claimed by"}
              </span>
              <span className="text-right font-normal">
                {assignedStudentName ? (
                  variant === "myMission" &&
                  mission.assignedStudentId === studentId ? (
                    "You"
                  ) : (
                    assignedStudentName
                  )
                ) : isTeacher ? (
                  "—"
                ) : (
                  requestedByNames.length > 0
                    ? requestedByNames.join(", ")
                    : mission.requestCount > 0
                      ? `${mission.requestCount} requested`
                      : "—"
                )}
              </span>
            </div>
          )}
        </div>

        {/* Center emphasis - large bold reward */}
        <div className="py-6 px-4 text-center border-b-2 border-black bg-white">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-black" aria-hidden="true">
              {mission.currentReward}
            </span>
            <span className="text-2xl" aria-hidden="true">
              🪙
            </span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider mt-1">
            Token Reward
          </div>
          {mission.currentReward < mission.baseReward && (
            <div className="text-xs font-medium mt-1 flex flex-col items-center gap-1">
              <span>Base: {mission.baseReward}</span>
              {isMarketplace && onExplainPriceDrop && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainPriceDrop(mission);
                  }}
                  className="text-amber-600 hover:text-amber-700 underline font-bold uppercase"
                >
                  Why less?
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer - status, button, hint */}
        <div className="p-4 text-center border-t border-black">
          {showStatusBadge && (
            <div className="mb-3 flex justify-center">
              <Badge
                status={displayStatus}
                className="rounded-none shadow-none border-black"
              />
            </div>
          )}
          {isMarketplace && (
            <Button
              variant={alreadyRequested ? "secondary" : "primary"}
              onClick={() => onRequest?.(mission.id)}
              disabled={alreadyRequested}
              className="w-full rounded-none shadow-none border-2 border-black"
            >
              {defaultActionLabel}
            </Button>
          )}
          {isTeacher && onEdit && onDelete && onAssign && (
            <div className="flex gap-2 mt-2">
              <Button
                variant="secondary"
                onClick={() => onEdit(mission)}
                className="flex-1 text-sm py-2 rounded-none shadow-none border-2 border-amber-200 bg-amber-50! text-gray-800! hover:bg-amber-100! hover:border-amber-300!"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => onDelete(mission)}
                className="flex-1 text-sm py-2 rounded-none shadow-none border-2 border-red-200 bg-red-50! text-gray-800! hover:bg-red-100! hover:border-red-300!"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => onAssign(mission)}
                className="flex-1 text-sm py-2 rounded-none shadow-none border-2 border-sky-200 bg-sky-50! text-gray-800! hover:bg-sky-100! hover:border-sky-300!"
              >
                {displayStatus === "COMPLETED" ? "Reset" : "Assign"}
              </Button>
            </div>
          )}
          {!isMarketplace && !isTeacher && defaultActionLabel && onAction && (
            <Button
              variant={displayStatus === "COMPLETED" ? "secondary" : "primary"}
              onClick={onAction}
              disabled={actionDisabled}
              className="w-full rounded-none shadow-none border-2 border-black"
            >
              {defaultActionLabel}
            </Button>
          )}
          {!isMarketplace && !isTeacher && actionHint && (
            <p className="text-xs font-medium uppercase mt-2">{actionHint}</p>
          )}
          {!isMarketplace &&
            !isTeacher &&
            displayStatus === "COMPLETED" &&
            onExplainRewardSplit && (
              <button
                type="button"
                onClick={() => onExplainRewardSplit(mission)}
                className="text-xs font-bold uppercase mt-2 underline"
              >
                Why did I get this split?
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
