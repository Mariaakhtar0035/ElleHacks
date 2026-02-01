export type MissionStatus = "AVAILABLE" | "REQUESTED" | "IN_PROGRESS" | "COMPLETED";

/** Weekly balance snapshot for Spend vs Grow chart history */
export interface BalanceHistoryEntry {
  week: number;
  spendBalance: number;
  saveBalance: number;
  growBalance: number;
}

export interface Student {
  id: string;
  name: string;
  spendTokens: number;
  growTokens: number;
  saveTokens: number;
  assignedMissions: string[]; // mission IDs
  purchasedRewards: string[]; // reward IDs
  /** Optional; if missing, generated from current balances */
  balanceHistory?: BalanceHistoryEntry[];
  /** 4-digit PIN for student login */
  pin: string;
  /** Optional save goal in tokens; default 200 when undefined */
  saveGoal?: number;
}

/** Top band color for mission card (board-game sets) */
export type MissionBandColor = "green" | "darkBlue" | "lightBlue" | "red" | "yellow" | "orange" | "brown" | "purple";

export const MISSION_BAND_COLORS: MissionBandColor[] = ["green", "darkBlue", "lightBlue", "red", "yellow", "orange", "brown", "purple"];

export interface Mission {
  id: string;
  title: string;
  description: string;
  baseReward: number;
  currentReward: number;
  requestCount: number;
  requestedBy: string[]; // student IDs
  assignedStudentId?: string;
  status: MissionStatus;
  /** Optional: category/top color for card. If not set, derived from id. */
  bandColor?: MissionBandColor;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  soldOut?: boolean;
}

export interface TokenBalance {
  spend: number;
  grow: number;
  save: number;
}

export interface PendingReward {
  id: string;
  missionId: string;
  studentId: string;
  missionTitle: string;
  totalAmount: number;
}

export type ExplanationType = "SUPPLY_DEMAND" | "SPEND_VS_GROW" | "COMPOUND_GROWTH" | "MISSION_APPROVAL" | "NARRATOR" | "MONEY_STORY_INSIGHT" | "SPENDING_BEHAVIOR_INSIGHT" | "TRANSFER_INSIGHT";

export type NarratorPage = "dashboard" | "marketplace" | "missions" | "grow" | "save" | "shop";

export interface NarratorContext {
  page: NarratorPage;
  studentName: string;
  spendTokens?: number;
  growTokens?: number;
  saveTokens?: number;
  missionCount?: number;
  availableMissions?: number;
  recentAction?: string;
}
