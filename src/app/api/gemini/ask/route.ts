import { NextRequest, NextResponse } from "next/server";
import { askNarrator, AskNarratorContext } from "@/lib/gemini";

function parseContext(body: Record<string, unknown>): AskNarratorContext | undefined {
  const ctx = body.context;
  if (!ctx || typeof ctx !== "object" || Array.isArray(ctx)) return undefined;
  const c = ctx as Record<string, unknown>;
  const spendTokens = c.spendTokens;
  const growTokens = c.growTokens;
  if (
    typeof spendTokens !== "number" ||
    typeof growTokens !== "number"
  ) {
    return undefined;
  }
  const result: AskNarratorContext = {
    spendTokens: Number(spendTokens),
    growTokens: Number(growTokens),
  };
  if (typeof c.currentPage === "string") result.currentPage = c.currentPage;
  if (typeof c.assignedMissionsCount === "number") result.assignedMissionsCount = c.assignedMissionsCount;
  if (Array.isArray(c.assignedMissionTitles)) result.assignedMissionTitles = c.assignedMissionTitles.filter((t: unknown) => typeof t === "string");
  if (Array.isArray(c.completedMissionTitles)) result.completedMissionTitles = c.completedMissionTitles.filter((t: unknown) => typeof t === "string");
  if (typeof c.purchasedRewardsCount === "number") result.purchasedRewardsCount = c.purchasedRewardsCount;
  if (Array.isArray(c.purchasedRewardTitles)) result.purchasedRewardTitles = c.purchasedRewardTitles.filter((t: unknown) => typeof t === "string");
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentName, question } = body;

    if (!studentName || typeof studentName !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid studentName" },
        { status: 400 }
      );
    }
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid question" },
        { status: 400 }
      );
    }

    const context = parseContext(body);
    const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here");
    if (!hasKey) {
      console.warn("[Ask Narrator] GEMINI_API_KEY not set or is placeholder. Add a key in .env.local and restart dev server.");
    }
    const answer = await askNarrator(studentName.trim(), question, context);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[Ask Narrator] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 }
    );
  }
}
