import type { Message } from "../types/types";

const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL;

// Models that don't support the chat completions endpoint at all
const UNSUPPORTED_CHAT_MODELS = ["gpt-4o-realtime-preview", "whisper-1"];

// Models that require 'max_completion_tokens' instead of 'max_tokens'
const USES_MAX_COMPLETION_TOKENS = [
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
  "o1",
  "o1-mini",
  "o1-preview",
  "o3",
  "o3-mini",
  "o4-mini",
];

// Reasoning models spend tokens on internal reasoning before writing output
// give them a much larger budget so content is never empty.
const REASONING_MODELS = USES_MAX_COMPLETION_TOKENS;

const isUnsupportedChatModel = (model: string) =>
  UNSUPPORTED_CHAT_MODELS.some((m) => model.toLowerCase().includes(m));

const usesMaxCompletionTokens = (model: string) =>
  USES_MAX_COMPLETION_TOKENS.some((m) => model.toLowerCase().includes(m));

const isReasoningModel = (model: string) =>
  REASONING_MODELS.some((m) => model.toLowerCase().includes(m));

const getTokenLimit = (model: string) =>
  isReasoningModel(model) ? 16000 : 4096;

const buildBody = (messages: Message[], model: string, tokenParam: object) => ({
  model,
  messages: [
    {
      role: "system",
      content: [
        "You are a helpful chat assistant.",
        "IMPORTANT: This application has full ability to open AND close browser tabs programmatically.",
        "The host app intercepts open/close tab requests before they reach you.",
        "Never tell the user you cannot open or close browser tabs — the application handles this automatically.",
        "If for some reason a close request reaches you, simply confirm it was handled.",
        "",
        "═══════════════════════════════════════════",
        "RULE 1 — OPENING WEBSITES (highest priority)",
        "═══════════════════════════════════════════",
        "If the user's message is asking to open, visit, launch, play, navigate to,",
        "or go to any website, app, or game — you MUST respond with ONLY this:",
        "OPEN_URL:<full_url>",
        "",
        "Requirements:",
        "- Always include https:// in the URL",
        "- No extra text, no explanation, no punctuation after the URL",
        "- If you are unsure of the exact URL, pick the most popular official website",
        "",
        "Predefined URLs (always use these exact URLs):",
        "- ludo / ludo game / play ludo       → OPEN_URL:ludoking.com",
        "- chess / play chess                 → OPEN_URL:chess.com",
        "- snake game                         → OPEN_URL:https://playsnake.org",
        "OPEN_URL Examples:",
        "User: open ludo game   → OPEN_URL:https://poki.com/en/g/ludo-king",
        "User: I want to play chess → OPEN_URL:https://www.chess.com/play/online",
        "User: take me to youtube   → OPEN_URL:https://www.youtube.com",
        "User: open netflix         → OPEN_URL:https://www.netflix.com",
        "User: go to amazon.in      → OPEN_URL:https://www.amazon.in",
        "",
        "═══════════════════════════════════════",
        "RULE 2 — SONG LYRICS",
        "═══════════════════════════════════════",
        "When displaying song lyrics, you MUST include ALL sections of the song.",
        "Never truncate or summarize lyrics — always show the complete song.",
        "IMPORTANT: Every section MUST contain EXACTLY 4 lyric lines — no more, no less.",
        "",
        "Required structure (minimum 6–7 stanzas/sections):",
        "  [Intro]        — if the song has one (exactly 4 lines)",
        "  [Verse 1]      — always include (exactly 4 lines)",
        "  [Pre-Chorus]   — if the song has one (exactly 4 lines)",
        "  [Chorus]       — always include (exactly 4 lines)",
        "  [Verse 2]      — always include (exactly 4 lines)",
        "  [Pre-Chorus]   — repeat if applicable (exactly 4 lines)",
        "  [Chorus]       — repeat (exactly 4 lines)",
        "  [Bridge]       — always include if the song has one (exactly 4 lines)",
        "  [Chorus]       — final chorus if applicable (exactly 4 lines)",
        "  [Outro]        — if the song has one (exactly 4 lines)",
        "",
        "Formatting rules:",
        "- Do NOT prefix section headings (e.g. [Verse 1], [Chorus], [Bridge]) with ♪",
        "- Prefix EVERY lyric line with ♪",
        "- Each section must have EXACTLY 4 lines prefixed with ♪",
        "- Add a blank line between each section for readability",
        "",
        "Example format:",
        "  [Verse 1]",
        "  ♪ First line of verse one",
        "  ♪ Second line of verse one",
        "  ♪ Third line of verse one",
        "  ♪ Fourth line of verse one",
        "",
        "  [Chorus]",
        "  ♪ First line of chorus",
        "  ♪ Second line of chorus",
        "  ♪ Third line of chorus",
        "  ♪ Fourth line of chorus",
        "",
        "  [Bridge]",
        "  ♪ First line of bridge",
        "  ♪ Second line of bridge",
        "  ♪ Third line of bridge",
        "  ♪ Fourth line of bridge",
        "",
        "═══════════════════════════════════════",
        "RULE 3 — EVERYTHING ELSE",
        "═══════════════════════════════════════",
        "For all other requests, respond normally as a helpful, friendly assistant.",
        "Never output OPEN_URL for non-navigation requests.",
      ].join("\n"),
    },
    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
  ],
  ...tokenParam,
});

const extractContent = (data: any, model: string): string => {
  const choice = data.choices?.[0];
  const content = choice?.message?.content?.trim();

  if (!content) {
    if (choice?.finish_reason === "length") {
      throw new Error(
        `Model "${model}" ran out of tokens before producing a response. ` +
          "Try sending a shorter message.",
      );
    }
    return "No response from model";
  }

  return content;
};

export const sendMessage = async (
  messages: Message[],
  apiKey: string,
  model: string,
): Promise<string> => {
  if (isUnsupportedChatModel(model)) {
    throw new Error(
      `Model "${model}" does not support chat completions. Please select a different model.`,
    );
  }

  const limit = getTokenLimit(model);
  const tokenParam = usesMaxCompletionTokens(model)
    ? { max_completion_tokens: limit }
    : { max_tokens: limit };

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildBody(messages, model, tokenParam)),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Unknown model that still needs max_completion_tokens — retry automatically
    if (
      errorData?.error?.message?.includes("max_tokens") &&
      errorData?.error?.message?.includes("max_completion_tokens")
    ) {
      return retryWithCompletionTokens(messages, apiKey, model);
    }
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`,
    );
  }

  return extractContent(await response.json(), model);
};

// Fallback for models not yet in USES_MAX_COMPLETION_TOKENS
const retryWithCompletionTokens = async (
  messages: Message[],
  apiKey: string,
  model: string,
): Promise<string> => {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(
      buildBody(messages, model, { max_completion_tokens: 16000 }),
    ),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`,
    );
  }

  return extractContent(await response.json(), model);
};
