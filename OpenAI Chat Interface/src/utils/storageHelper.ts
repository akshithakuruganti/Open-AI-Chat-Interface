import type { Message } from "../types/types";

// Storage keys

export const STORAGE_KEY = "chat_api_key";
export const MODEL_STORAGE_KEY = "chat_selected_model";
export const CHAT_HISTORY_KEY = "chat_history_v1";

// Load

export const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((m: Message) => ({
      ...m,
      timestamp: new Date(m.timestamp),
      isStreaming: false,
    }));
  } catch {
    return [];
  }
};

export const loadApiKey = (): string => localStorage.getItem(STORAGE_KEY) || "";

export const loadSelectedModel = (): string =>
  localStorage.getItem(MODEL_STORAGE_KEY) || "";

// Save

/** Persists messages to localStorage, trimming oldest entries if quota is tight. */
export const saveMessages = (messages: Message[]): void => {
  try {
    let toSave = messages.filter((m) => !m.isStreaming);
    while (
      JSON.stringify(toSave).length > 4 * 1024 * 1024 &&
      toSave.length > 1
    ) {
      toSave = toSave.slice(1);
    }
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage quota exceeded – fail silently
  }
};

export const saveApiKey = (key: string): void =>
  localStorage.setItem(STORAGE_KEY, key);

export const saveSelectedModel = (model: string): void =>
  localStorage.setItem(MODEL_STORAGE_KEY, model);

export const clearMessages = (): void =>
  localStorage.removeItem(CHAT_HISTORY_KEY);
