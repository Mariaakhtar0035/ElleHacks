import { ExplanationType, NarratorPage } from "@/types";
import { callOpenRouter, hasOpenRouterKey } from "./openrouter";

const FALLBACK_TEXTS: Record<ExplanationType, string> = {
  SUPPLY_DEMAND: "When lots of students want the same mission, the reward goes down. It's like when a popular toy costs more!",
  SPEND_VS_GROW: "You earned tokens! Some go to Spend (use now), some to Save, and some to Grow (locked and growing).",
  COMPOUND_GROWTH: "Your Grow tokens earn 2% more every week. The longer you wait, the more you'll have!",
  MISSION_APPROVAL: "Great job! Your teacher approved your mission and you earned tokens.",
  NARRATOR: "Welcome! Let's learn about money together.",
};

const NARRATOR_FALLBACKS: Record<NarratorPage, string> = {
  dashboard: "Welcome back! Check out the marketplace for new missions to earn tokens.",
  marketplace: "Request missions to earn tokens. Remember, popular missions pay less!",
  missions: "Complete your missions and ask your teacher to approve them.",
  grow: "Your Grow tokens are earning 2% every week. Patience pays off!",
  save: "Saving helps you reach goals. Even small amounts add up over time!",
  shop: "Spend your tokens wisely. Save some for later and grow some too!",
};

function buildNarratorPrompt(studentName: string, context: any): string {
  const page = context.page as NarratorPage;
  const recentAction = context.recentAction || "";
  
  let contextDescription = "";
  
  switch (page) {
    case "dashboard":
      contextDescription = `${studentName} has ${context.spendTokens || 0} Spend tokens, ${context.saveTokens || 0} Save tokens, and ${context.growTokens || 0} Grow tokens. They have ${context.missionCount || 0} missions assigned.`;
      break;
    case "marketplace":
      contextDescription = `${studentName} is viewing ${context.availableMissions || 0} available missions. ${recentAction}`;
      break;
    case "missions":
      contextDescription = `${studentName} is checking their assigned missions. ${recentAction}`;
      break;
    case "grow":
      contextDescription = `${studentName} has ${context.growTokens || 0} Grow tokens that are growing 2% weekly. ${recentAction}`;
      break;
    case "save":
      contextDescription = `${studentName} has ${context.saveTokens || 0} Save tokens set aside for goals. ${recentAction}`;
      break;
    case "shop":
      contextDescription = `${studentName} has ${context.spendTokens || 0} Spend tokens to spend and ${context.saveTokens || 0} Save tokens set aside. ${recentAction}`;
      break;
  }
  
  return `You are a friendly, encouraging financial narrator for a classroom economy game. You're guiding ${studentName}, a 7-12 year old student. They are on the ${page} page. ${contextDescription}

Give ONE short, personalized, encouraging sentence that:
- Speaks directly to ${studentName} using their name
- Is fun and kid-friendly
- Relates to what they're doing or could do next
- Teaches a simple money lesson if possible

Keep it to exactly 1 sentence, under 20 words.`;
}

function buildPrompt(
  type: ExplanationType,
  studentName: string,
  context: any
): string {
  if (type === "NARRATOR") {
    return buildNarratorPrompt(studentName, context);
  }
  
  const prompts: Record<string, string> = {
    SUPPLY_DEMAND: `Explain to ${studentName}, a 7-12 year old student, why the mission reward decreased from ${context.baseReward} to ${context.currentReward} tokens because ${context.requestCount} students requested it. Use simple language and make it fun. Keep it to 1-2 sentences.`,
    SPEND_VS_GROW: `Explain to ${studentName}, a 7-12 year old student, that they just earned ${context.totalReward} tokens, split into ${context.spendAmount} Spend tokens (can use now), ${context.saveAmount} Save tokens (set aside), and ${context.growAmount} Grow tokens (locked and growing). Use simple language. Keep it to 1-2 sentences.`,
    COMPOUND_GROWTH: `Explain to ${studentName}, a 7-12 year old student, how their ${context.currentGrow} Grow tokens will grow to ${context.futureAmount} tokens in ${context.timeframe} with 2% weekly compound growth. Make it exciting and simple. Keep it to 1-2 sentences.`,
    MISSION_APPROVAL: `Congratulate ${studentName}, a 7-12 year old student, for completing the mission "${context.missionTitle}" and earning ${context.reward} tokens. Make it encouraging and fun. Keep it to 1-2 sentences.`,
  };

  return prompts[type] || "";
}

// Use gemini-2.5-flash-lite for highest free tier (15 RPM, 1000 RPD)
// Fallback: gemini-2.0-flash (10 RPM, 250 RPD)
const GEMINI_MODEL = "gemini-2.5-flash-lite";

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

let chatInFlightCount = 0;
let chatDoneResolver: (() => void) | null = null;

function waitForChatToFinish(): Promise<void> {
  if (chatInFlightCount === 0) return Promise.resolve();
  if (!chatDoneResolver) {
    return new Promise((resolve) => {
      chatDoneResolver = resolve;
    });
  }
  return new Promise((resolve) => {
    const existingResolver = chatDoneResolver;
    chatDoneResolver = () => {
      existingResolver?.();
      resolve();
    };
  });
}

function beginChatCall() {
  chatInFlightCount += 1;
}

function endChatCall() {
  chatInFlightCount = Math.max(0, chatInFlightCount - 1);
  if (chatInFlightCount === 0 && chatDoneResolver) {
    const resolve = chatDoneResolver;
    chatDoneResolver = null;
    resolve();
  }
}

async function callGeminiAPI(
  prompt: string,
  maxOutputTokens = 100,
  temperature = 0.7
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "your_api_key_here") {
    console.error("[Gemini] Missing or placeholder API key. Set GEMINI_API_KEY in .env.local");
    throw new Error("No API key");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
    safetySettings: SAFETY_SETTINGS,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || data?.error?.code || response.statusText;
    console.error("[Gemini] API error:", response.status, message);
    if (data?.error?.status === "INVALID_ARGUMENT") {
      console.error("[Gemini] Invalid arg - model may not exist. Try gemini-2.5-flash if 2.0 fails.");
    }
    throw new Error(message || "API call failed");
  }

  const promptFeedback = data.promptFeedback;
  if (promptFeedback?.blockReason) {
    console.error("[Gemini] Prompt blocked:", promptFeedback.blockReason, promptFeedback);
    throw new Error(`Prompt blocked: ${promptFeedback.blockReason}`);
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  
  if (!text) {
    const finishReason = candidate?.finishReason || "UNKNOWN";
    const safetyRatings = candidate?.safetyRatings;
    console.error("[Gemini] No text. finishReason:", finishReason, "safetyRatings:", safetyRatings);
    if (finishReason === "SAFETY") {
      throw new Error("Response blocked by safety filters");
    }
    throw new Error(finishReason || "No text in response");
  }

  return text.trim();
}

export async function generateExplanation(
  type: ExplanationType,
  studentName: string,
  context: any
): Promise<string> {
  try {
    await waitForChatToFinish();

    const prompt = buildPrompt(type, studentName, context);

    // #region agent log
    const useOR = hasOpenRouterKey();
    fetch('http://127.0.0.1:7242/ingest/f38e6ae9-aec7-427b-b7e9-fa2897140ff4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gemini.ts:generateExplanation',message:'Provider check',data:{hasOpenRouterKey:useOR,hasKeySet:!!process.env.OPENROUTER_API_KEY},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    if (useOR) {
      const response = await callOpenRouter(
        [{ role: "user", content: prompt }],
        150,
        0.8
      );
      return response;
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      if (type === "NARRATOR" && context.page) {
        return NARRATOR_FALLBACKS[context.page as NarratorPage] || FALLBACK_TEXTS.NARRATOR;
      }
      return FALLBACK_TEXTS[type];
    }

    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error("Explanation API error:", error);
    if (type === "NARRATOR" && context.page) {
      return NARRATOR_FALLBACKS[context.page as NarratorPage] || FALLBACK_TEXTS.NARRATOR;
    }
    return FALLBACK_TEXTS[type];
  }
}

export function getFallbackText(type: ExplanationType): string {
  return FALLBACK_TEXTS[type];
}

export function getNarratorFallback(page: NarratorPage): string {
  return NARRATOR_FALLBACKS[page];
}

const ASK_FALLBACK = "I'm not sure right now. Ask your teacher or try again!";

const MAX_QUESTION_LENGTH = 200;

export interface AvailableReward {
  title: string;
  cost: number;
}

export interface AvailableMission {
  title: string;
  reward: number;
}

export interface AskNarratorContext {
  spendTokens: number;
  saveTokens: number;
  growTokens: number;
  currentPage?: string;
  assignedMissionsCount?: number;
  assignedMissionTitles?: string[];
  completedMissionTitles?: string[];
  purchasedRewardsCount?: number;
  purchasedRewardTitles?: string[];
  availableMissionsCount?: number;
  availableMissions?: AvailableMission[];
  availableRewards?: AvailableReward[];
}

export interface RecentMessage {
  role: "user" | "assistant";
  content: string;
}

function buildAskNarratorContextString(ctx: AskNarratorContext | null): string {
  if (!ctx) return "No context available.";
  const parts: string[] = [];
  parts.push(`- Spend tokens: ${ctx.spendTokens}`);
  parts.push(`- Save tokens: ${ctx.saveTokens}`);
  parts.push(`- Grow tokens: ${ctx.growTokens} (locked, grows 2% weekly)`);
  parts.push(`- Current page: ${ctx.currentPage || "unknown"}`);
  const assigned = (ctx.assignedMissionTitles || []).slice(0, 5);
  parts.push(`- Active missions: ${assigned.length ? assigned.join(", ") : "None"}`);
  const available = (ctx.availableMissions || []).slice(0, 5);
  parts.push(`- Available missions: ${available.length ? available.map((m) => `${m.title} (${m.reward} tokens)`).join("; ") : "None"}`);
  const rewards = (ctx.availableRewards || []).slice(0, 5);
  parts.push(`- Rewards (with costs): ${rewards.length ? rewards.map((r) => `${r.title} (${r.cost})`).join("; ") : "None"}`);
  const completed = (ctx.completedMissionTitles || []).slice(0, 3);
  if (completed.length) parts.push(`- Recently completed: ${completed.join(", ")}`);
  const purchased = (ctx.purchasedRewardTitles || []).slice(0, 3);
  if (purchased.length) parts.push(`- Purchased: ${purchased.join(", ")}`);
  return parts.join("\n");
}

function buildRecentConversationBlock(messages: RecentMessage[]): string {
  if (!messages.length) return "";
  return (
    "Recent conversation:\n" +
    messages
      .map((m) => (m.role === "user" ? `Student: "${m.content}"` : `Mrs. Pennyworth: "${m.content}"`))
      .join("\n") +
    "\n\n"
  );
}

function buildContextualFallback(ctx: AskNarratorContext | null, studentName: string): string {
  if (!ctx) return "I'm not sure right now. Ask your teacher or try again!";
  const { spendTokens, saveTokens, growTokens, currentPage } = ctx;
  if (currentPage === "shop" && spendTokens > 0) {
    return `Right now you have ${spendTokens} Spend tokens, ${studentName}! You could buy something in the shop or save them for later — it's your choice!`;
  }
  if (currentPage === "marketplace") {
    return `You have ${spendTokens} Spend, ${saveTokens} Save, and ${growTokens} Grow tokens. Missions are a great way to earn more — want to pick one and see what happens?`;
  }
  if (currentPage === "grow" && growTokens > 0) {
    return `Your ${growTokens} Grow tokens are growing 2% every week! The longer you wait, the more you'll have. Patience pays off!`;
  }
  return `You have ${spendTokens} Spend, ${saveTokens} Save, and ${growTokens} Grow tokens. What would you like to know about them?`;
}

export async function askNarrator(
  studentName: string,
  question: string,
  context?: AskNarratorContext | null,
  recentMessages?: RecentMessage[]
): Promise<string> {
  const trimmed = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!trimmed) {
    return ASK_FALLBACK;
  }

  try {
    const contextBlock = buildAskNarratorContextString(context ?? null);
    const conversationBlock = buildRecentConversationBlock(recentMessages || []);

    const systemPrompt = `You are Mrs. Pennyworth, a friendly, fun financial guide for a kid-friendly classroom economy game (Monopoly-themed). Speak directly to ${studentName}, age 7–12. Be enthusiastic, playful, and encouraging like a friendly financial coach.

Rules:
1. Keep answers fun, short (1–3 sentences), and kid-friendly. Under 3 sentences.
2. Always reference actual tokens, missions, or rewards from the data above.
3. Provide 2–3 options or suggestions for what the student can do next.
4. Rephrase differently each time—use varied phrasing, playful Monopoly-themed comments, or different ways to describe token balances. Never repeat the same wording.
5. Include a simple financial lesson when relevant (e.g., saving, compound growth, supply & demand).

Scenario guides:
- Greetings ("hi", "hello") → warm reply, optionally ask what they want to do. No token dump.
- Spending ("Can I buy X?") → check Spend tokens, compare to cost, show what they can afford. Give options.
- Missions ("Which missions can I do?") → list available missions with rewards. Explain 70% Spend, 30% Grow.
- Grow tokens → explain current vs future amount (2% weekly), show excitement for waiting. Tie to piggy bank or bank interest.`;

    const userContent = `${conversationBlock}Use their current data:
${contextBlock}

Answer the question: "${trimmed}"

Respond now—be specific, use their numbers, and vary your phrasing from any previous reply.`;

    const useOpenRouter = hasOpenRouterKey();
    const useGemini =
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here";

    if (!useOpenRouter && !useGemini) {
      return buildContextualFallback(context ?? null, studentName);
    }

    beginChatCall();
    try {
      if (useOpenRouter) {
        const response = await callOpenRouter(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          384,
          0.9
        );
        return response || buildContextualFallback(context ?? null, studentName);
      }
      const prompt = `${systemPrompt}

${userContent}`;
      const response = await callGeminiAPI(prompt, 384, 0.9);
      return response || buildContextualFallback(context ?? null, studentName);
    } catch (error) {
      console.error("Ask narrator error:", error);
      return buildContextualFallback(context ?? null, studentName);
    } finally {
      endChatCall();
    }
  } catch (error) {
    console.error("Ask narrator error:", error);
    return buildContextualFallback(context ?? null, studentName);
  }
}
