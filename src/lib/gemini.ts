import { ExplanationType, NarratorPage } from "@/types";

const FALLBACK_TEXTS: Record<ExplanationType, string> = {
  SUPPLY_DEMAND: "When lots of students want the same mission, the reward goes down. It's like when a popular toy costs more!",
  SPEND_VS_GROW: "You earned tokens! 70% goes to Spend (use now) and 30% goes to Grow (saves for later).",
  COMPOUND_GROWTH: "Your Grow tokens earn 2% more every week. The longer you wait, the more you'll have!",
  MISSION_APPROVAL: "Great job! Your teacher approved your mission and you earned tokens.",
  NARRATOR: "Welcome! Let's learn about money together.",
};

const NARRATOR_FALLBACKS: Record<NarratorPage, string> = {
  dashboard: "Welcome back! Check out the marketplace for new missions to earn tokens.",
  marketplace: "Request missions to earn tokens. Remember, popular missions pay less!",
  missions: "Complete your missions and ask your teacher to approve them.",
  grow: "Your Grow tokens are earning 2% every week. Patience pays off!",
  shop: "Spend your tokens wisely. Save some for later too!",
};

function buildNarratorPrompt(studentName: string, context: any): string {
  const page = context.page as NarratorPage;
  const recentAction = context.recentAction || "";
  
  let contextDescription = "";
  
  switch (page) {
    case "dashboard":
      contextDescription = `${studentName} has ${context.spendTokens || 0} Spend tokens and ${context.growTokens || 0} Grow tokens. They have ${context.missionCount || 0} missions assigned.`;
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
    case "shop":
      contextDescription = `${studentName} has ${context.spendTokens || 0} Spend tokens to spend. ${recentAction}`;
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
    SPEND_VS_GROW: `Explain to ${studentName}, a 7-12 year old student, that they just earned ${context.totalReward} tokens, split into ${context.spendAmount} Spend tokens (can use now) and ${context.growAmount} Grow tokens (locked and growing). Use simple language. Keep it to 1-2 sentences.`,
    COMPOUND_GROWTH: `Explain to ${studentName}, a 7-12 year old student, how their ${context.currentGrow} Grow tokens will grow to ${context.futureAmount} tokens in ${context.timeframe} with 2% weekly compound growth. Make it exciting and simple. Keep it to 1-2 sentences.`,
    MISSION_APPROVAL: `Congratulate ${studentName}, a 7-12 year old student, for completing the mission "${context.missionTitle}" and earning ${context.reward} tokens. Make it encouraging and fun. Keep it to 1-2 sentences.`,
  };

  return prompts[type] || "";
}

// Use gemini-2.5-flash per Google AI quickstart (gemini-1.5-flash deprecated)
const GEMINI_MODEL = "gemini-2.5-flash";

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

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
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      if (type === "NARRATOR" && context.page) {
        return NARRATOR_FALLBACKS[context.page as NarratorPage] || FALLBACK_TEXTS.NARRATOR;
      }
      return FALLBACK_TEXTS[type];
    }

    const prompt = buildPrompt(type, studentName, context);
    const response = await callGeminiAPI(prompt);
    
    return response;
  } catch (error) {
    console.error("Gemini API error:", error);
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

export interface AskNarratorContext {
  spendTokens: number;
  growTokens: number;
  currentPage?: string;
  assignedMissionsCount?: number;
  assignedMissionTitles?: string[];
  completedMissionTitles?: string[];
  purchasedRewardsCount?: number;
  purchasedRewardTitles?: string[];
}

function buildAskNarratorContextString(ctx: AskNarratorContext | null, studentName: string): string {
  if (!ctx) return "No specific context is available about the student.";
  const parts: string[] = [];
  parts.push(`RIGHT NOW: ${studentName} has ${ctx.spendTokens} Spend tokens (use now) and ${ctx.growTokens} Grow tokens (saved, growing 2% weekly).`);
  parts.push(`Current page: ${ctx.currentPage || "unknown"}`);
  if (ctx.assignedMissionsCount !== undefined && ctx.assignedMissionsCount > 0) {
    parts.push(`Active missions (${ctx.assignedMissionsCount}): ${(ctx.assignedMissionTitles || []).slice(0, 3).join(", ") || "—"}`);
  }
  if (ctx.completedMissionTitles?.length) {
    parts.push(`Recently completed: ${ctx.completedMissionTitles.slice(0, 3).join(", ")}`);
  }
  if (ctx.purchasedRewardsCount !== undefined && ctx.purchasedRewardsCount > 0) {
    parts.push(`Purchases (${ctx.purchasedRewardsCount}): ${(ctx.purchasedRewardTitles || []).slice(0, 3).join(", ") || "—"}`);
  }
  return parts.join("\n");
}

function buildContextualFallback(ctx: AskNarratorContext | null, studentName: string): string {
  if (!ctx) return "I'm not sure right now. Ask your teacher or try again!";
  const { spendTokens, growTokens, currentPage } = ctx;
  if (currentPage === "shop" && spendTokens > 0) {
    return `Right now you have ${spendTokens} Spend tokens, ${studentName}! You could buy something in the shop or save them for later — it's your choice!`;
  }
  if (currentPage === "marketplace") {
    return `You have ${spendTokens} Spend and ${growTokens} Grow tokens. Missions are a great way to earn more — want to pick one and see what happens?`;
  }
  if (currentPage === "grow" && growTokens > 0) {
    return `Your ${growTokens} Grow tokens are growing 2% every week! The longer you wait, the more you'll have. Patience pays off!`;
  }
  return `You have ${spendTokens} Spend and ${growTokens} Grow tokens. What would you like to know about them?`;
}

export async function askNarrator(
  studentName: string,
  question: string,
  context?: AskNarratorContext | null
): Promise<string> {
  const trimmed = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!trimmed) {
    return ASK_FALLBACK;
  }

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      return buildContextualFallback(context ?? null, studentName);
    }

    const contextBlock = buildAskNarratorContextString(context ?? null, studentName);

    const prompt = `You are a friendly, encouraging financial narrator for a classroom economy game. You're talking to ${studentName}, a kid aged 7–12. Your goal is to help them understand money, saving, spending, earning, and investing using kid-friendly language.

## CRITICAL RULES

1. **Never tell students exactly what to do.** Always present 2–3 options with quick consequences so they stay in control. For example: "If you spend now, you'll have fewer tokens left. If you save, they'll grow! What feels right to you?" Never say "You should..." or "I recommend..."

2. **Use their numbers.** Mention their exact Spend and Grow token amounts when relevant. Personalize: "Right now you have ${context?.spendTokens ?? "X"} Spend tokens — here's what that could mean..."

3. **Off-task questions (jokes, unrelated topics):** Respond with a cute, friendly redirect. Example: "That's a fun question! 👀 But let's get back to your tokens — want to see what happens if you save them for next week?" Never say "I can't answer that" abruptly.

4. **Avoid generic phrases.** Do NOT say: "It depends," "Consider your goals," "Think about what matters to you," or "That's up to you." Instead give specific options and consequences.

5. **Tone:** Friendly, encouraging, supportive. Never judgmental. Simple language. 2–4 short sentences. Speak directly to ${studentName}.

## EXAMPLE (follow this style)

Q: "Should I spend tokens on this reward?"
A: "You have 80 Spend tokens right now — that reward costs 50. If you buy it, you'd have 30 left. If you save, your Grow tokens keep growing! What do you want to try?"

Q: "Why do I have two kinds of tokens?"
A: "Spend tokens are for right now — use them in the shop! Grow tokens are locked and earn 2% every week. It's like having a piggy bank that grows on its own. Pretty cool, right?"

## STUDENT CONTEXT (use these numbers and details)
${contextBlock}

## STUDENT'S QUESTION
"${trimmed}"

## YOUR RESPONSE`;

    const response = await callGeminiAPI(prompt, 250, 0.6);
    return response || buildContextualFallback(context ?? null, studentName);
  } catch (error) {
    console.error("Gemini ask error:", error);
    return buildContextualFallback(context ?? null, studentName);
  }
}
