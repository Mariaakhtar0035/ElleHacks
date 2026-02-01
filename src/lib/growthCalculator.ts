import type { BalanceHistoryEntry } from "@/types";

const WEEKLY_RATE = 0.02; // 2% weekly growth

export function calculateGrowth(principal: number, weeks: number): number {
  return Math.floor(principal * Math.pow(1 + WEEKLY_RATE, weeks));
}

export interface GrowthProjection {
  oneMonth: number;
  sixMonths: number;
  oneYear: number;
}

export function getProjections(currentGrow: number): GrowthProjection {
  return {
    oneMonth: calculateGrowth(currentGrow, 4),
    sixMonths: calculateGrowth(currentGrow, 26),
    oneYear: calculateGrowth(currentGrow, 52),
  };
}

export function getGrowthPercentage(principal: number, future: number): number {
  if (principal === 0) return 0;
  return Math.floor(((future - principal) / principal) * 100);
}

/**
 * Generates plausible 12-26 week history ending at current balances.
 * Used when a student has no balanceHistory. Forward simulation:
 * weekly earnings with spend/grow split, spend shows ups/downs, grow increases steadily.
 */
export function generateHistoryFromCurrent(
  spendTokens: number,
  growTokens: number
): BalanceHistoryEntry[] {
  const weeks = 16;
  if (spendTokens === 0 && growTokens === 0) {
    return Array.from({ length: weeks }, (_, i) => ({
      week: i + 1,
      spendBalance: 0,
      growBalance: 0,
    }));
  }
  const entries: BalanceHistoryEntry[] = [];
  let spendAcc = 0;
  const weeklySpend = spendTokens / weeks;
  for (let w = 1; w <= weeks; w++) {
    const t = w / weeks;
    // Spend: add weekly amount, but dip at week 6 and 12 (simulate purchases)
    const dip = (w === 6 || w === 11) ? -Math.floor(spendTokens * 0.15) : 0;
    spendAcc += Math.floor(weeklySpend * (0.8 + 0.4 * Math.sin(w * 0.5))) + dip;
    spendAcc = Math.max(0, Math.min(spendAcc, spendTokens));
    const growAcc = Math.floor(growTokens * (1 - Math.pow(1 - t, 1.2)));
    entries.push({
      week: w,
      spendBalance: spendAcc,
      growBalance: Math.max(0, Math.min(growAcc, growTokens)),
    });
  }
  // Ensure final week matches current balances
  entries[entries.length - 1] = {
    week: weeks,
    spendBalance: spendTokens,
    growBalance: growTokens,
  };
  return entries;
}

/**
 * Computes "If I Grew Everything" scenario from history.
 * For each week: infer earnings = max(0, total[i] - total[i-1] - grow[i-1]*0.02).
 * Simulate: whatIfGrow[0] = earnings[0], whatIfGrow[i] = whatIfGrow[i-1]*1.02 + earnings[i].
 * Returns array aligned with history weeks.
 */
export function computeWhatIfGrow(
  history: BalanceHistoryEntry[]
): number[] {
  if (history.length === 0) return [];
  const result: number[] = [];
  let whatIf = 0;
  let prevTotal = 0;
  let prevGrow = 0;
  for (let i = 0; i < history.length; i++) {
    const h = history[i];
    const total = h.spendBalance + h.growBalance;
    const growthOnPrev = prevGrow * WEEKLY_RATE;
    const earnings = Math.max(0, total - prevTotal - growthOnPrev);
    whatIf = whatIf * (1 + WEEKLY_RATE) + earnings;
    result.push(Math.floor(whatIf));
    prevTotal = total;
    prevGrow = h.growBalance;
  }
  return result;
}
