/**
 * OpenRouter API client - unified API for Gemini and other models.
 * Uses MLH/OpenRouter credits. Set OPENROUTER_API_KEY in .env.local
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  maxTokens = 384,
  temperature = 0.9
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "ElleHacks",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string; code?: string };
  };

  if (!response.ok) {
    const message = data?.error?.message || data?.error?.code || response.statusText;
    console.error("[OpenRouter] API error:", response.status, message);
    throw new Error(message || "OpenRouter API call failed");
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("No text in OpenRouter response");
  }

  return text;
}

export function hasOpenRouterKey(): boolean {
  const key = process.env.OPENROUTER_API_KEY;
  return !!(key && key !== "your_api_key_here");
}
