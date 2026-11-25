import type { Message } from "../types/types";

// Message factory helpers

export const makeUserMessage = (content: string): Message => ({
  id: crypto.randomUUID(),
  role: "user",
  content,
  timestamp: new Date(),
});

export const makeAssistantMessage = (
  content: string,
  extras: Partial<Message> = {},
): Message => ({
  id: crypto.randomUUID(),
  role: "assistant",
  content,
  timestamp: new Date(),
  isStreaming: false,
  ...extras,
});

export const makeStreamingPlaceholder = (): Message => ({
  id: crypto.randomUUID(),
  role: "assistant",
  content: "",
  timestamp: new Date(),
  isStreaming: true,
});