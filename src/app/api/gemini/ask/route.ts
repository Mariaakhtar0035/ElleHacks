import { NextRequest, NextResponse } from "next/server";
import { askNarrator, AskNarratorContext, type RecentMessage } from "@/lib/gemini";

function parseContext(body: Record<string, unknown>): AskNarratorContext | undefined {
  const ctx = body.context;
  if (!ctx || typeof ctx !== "object" || Array.isArray(ctx)) return undefined;
  const c = ctx as Record<string, unknown>;
  const spendTokens = c.spendTokens;
  const saveTokens = c.saveTokens;
  const growTokens = c.growTokens;
  if (
    typeof spendTokens !== "number" ||
    typeof saveTokens !== "number" ||
    typeof growTokens !== "number"
  ) {
    return undefined;
  }
  const result: AskNarratorContext = {
    spendTokens: Number(spendTokens),
    saveTokens: Number(saveTokens),
    growTokens: Number(growTokens),
  };
  if (typeof c.currentPage === "string") result.currentPage = c.currentPage;
  if (typeof c.assignedMissionsCount === "number") result.assignedMissionsCount = c.assignedMissionsCount;
  if (Array.isArray(c.assignedMissionTitles)) result.assignedMissionTitles = c.assignedMissionTitles.filter((t: unknown) => typeof t === "string");
  if (Array.isArray(c.completedMissionTitles)) result.completedMissionTitles = c.completedMissionTitles.filter((t: unknown) => typeof t === "string");
  if (typeof c.purchasedRewardsCount === "number") result.purchasedRewardsCount = c.purchasedRewardsCount;
  if (Array.isArray(c.purchasedRewardTitles)) result.purchasedRewardTitles = c.purchasedRewardTitles.filter((t: unknown) => typeof t === "string");
  if (typeof c.availableMissionsCount === "number") result.availableMissionsCount = c.availableMissionsCount;
  if (Array.isArray(c.availableMissions)) {
    result.availableMissions = (c.availableMissions as unknown[]).filter((m): m is { title: string; reward: number } => 
      typeof m === "object" && m !== null && typeof (m as Record<string, unknown>).title === "string" && typeof (m as Record<string, unknown>).reward === "number"
    ).map((m) => ({ title: m.title, reward: m.reward }));
  }
  if (Array.isArray(c.availableRewards)) {
    result.availableRewards = (c.availableRewards as unknown[]).filter((r): r is { title: string; cost: number } =>
      typeof r === "object" && r !== null && typeof (r as Record<string, unknown>).title === "string" && typeof (r as Record<string, unknown>).cost === "number"
    ).map((r) => ({ title: r.title, cost: r.cost }));
  }
  return result;
}

function parseRecentMessages(body: Record<string, unknown>): RecentMessage[] {
  const arr = body.recentMessages;
  if (!Array.isArray(arr)) return [];
  return (arr as unknown[])
    .slice(-4)
    .filter((m): m is { role: "user" | "assistant"; content: string } => {
      if (typeof m !== "object" || m === null) return false;
      const r = m as Record<string, unknown>;
      return (r.role === "user" || r.role === "assistant") && typeof r.content === "string";
    })
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 200) }));
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
    const recentMessages = parseRecentMessages(body);
    const hasOpenRouter = !!(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your_api_key_here");
    const hasGemini = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here");
    if (!hasOpenRouter && !hasGemini) {
      console.warn("[Ask Narrator] No AI key. Add OPENROUTER_API_KEY (recommended for MLH credits) or GEMINI_API_KEY in .env.local");
    }
    const answer = await askNarrator(studentName.trim(), question, context, recentMessages);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[Ask Narrator] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 }
    );
  }
}
