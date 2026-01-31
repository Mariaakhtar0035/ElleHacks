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
