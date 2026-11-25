// hooks/useChatHistory.js
import { useState, useEffect } from "react";

const KEY = "chat_history_v1";
const MAX_BYTES = 4 * 1024 * 1024; // 4MB safety limit

export function useChatHistory() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      let toSave = messages;
      // Trim oldest messages if too large
      while (JSON.stringify(toSave).length > MAX_BYTES && toSave.length > 1) {
        toSave = toSave.slice(1);
      }
      localStorage.setItem(KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn("Chat history save failed:", e);
    }
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem(KEY);
    setMessages([]);
  };

  return { messages, setMessages, clearHistory };
}