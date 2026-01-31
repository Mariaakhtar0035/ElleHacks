export type MissionStatus = "AVAILABLE" | "REQUESTED" | "IN_PROGRESS" | "COMPLETED";

export interface Student {
  id: string;
  name: string;
  spendTokens: number;
  growTokens: number;
  assignedMissions: string[]; // mission IDs
  purchasedRewards: string[]; // reward IDs
}

/** Top band color for mission card (board-game palette) */
export type MissionBandColor = "red" | "green" | "blue" | "amber" | "orange" | "purple" | "sky" | "brown";

export const MISSION_BAND_COLORS: MissionBandColor[] = ["red", "green", "blue", "amber", "orange", "purple", "sky", "brown"];

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
}

export type ExplanationType = "SUPPLY_DEMAND" | "SPEND_VS_GROW" | "COMPOUND_GROWTH" | "MISSION_APPROVAL" | "NARRATOR";

export type NarratorPage = "dashboard" | "marketplace" | "missions" | "grow" | "shop";

export interface NarratorContext {
  page: NarratorPage;
  studentName: string;
  spendTokens?: number;
  growTokens?: number;
  missionCount?: number;
  availableMissions?: number;
  recentAction?: string;
}
