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

const GEMINI_MODEL = "gemini-1.5-flash";

async function callGeminiAPI(prompt: string, maxOutputTokens = 100): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("No API key");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || data?.error?.code || response.statusText;
    console.error("Gemini API error:", response.status, message, data?.error);
    throw new Error(message || "API call failed");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    const blockReason = data.candidates?.[0]?.finishReason;
    console.error("Gemini API no text:", blockReason, data);
    throw new Error(blockReason || "No text in response");
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

export async function askNarrator(studentName: string, question: string): Promise<string> {
  const trimmed = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!trimmed) {
    return ASK_FALLBACK;
  }

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      return ASK_FALLBACK;
    }

    const prompt = `You are a friendly financial guide for a classroom economy game. You're talking to ${studentName}, a kid aged 7-12. They ask: "${trimmed}"

Answer in 1-3 short sentences, simply and fun. No bullet lists. Keep it kid-friendly.`;

    const response = await callGeminiAPI(prompt, 150);
    return response || ASK_FALLBACK;
  } catch (error) {
    console.error("Gemini ask error:", error);
    return ASK_FALLBACK;
  }
}
