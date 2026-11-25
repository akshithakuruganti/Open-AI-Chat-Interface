import { useCallback, useRef } from "react";
import {
  isReminderRequest,
  parseReminderFromMessage,
  scheduleReminder,
} from "../services/reminderService";
import { sendMessage } from "../services/chatService";
import {
  extractURLFromIntent,
  extractCloseURLFromIntent,
  toFullURL,
  isSingRequest,
} from "../utils/urlHelper";
import {
  makeUserMessage,
  makeAssistantMessage,
  makeStreamingPlaceholder,
} from "../utils/messageHelper";
import type { Message } from "../types/types";

interface UseChatSendOptions {
  apiKey: string;
  selectedModel: string;
  messages: Message[];
  onNeedApiKey: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setInputText: (v: string) => void;
}

export const useChatSend = ({
  apiKey,
  selectedModel,
  messages,
  onNeedApiKey,
  setMessages,
  setIsLoading,
  setError,
  setInputText,
}: UseChatSendOptions) => {
  const openedWindowsRef = useRef<Map<string, Window>>(new Map());

  const handleSend = useCallback(
    async (inputText: string) => {
      const text = inputText.trim();
      if (!text) return;

      if (!apiKey) {
        onNeedApiKey();
        return;
      }

      // ── 1. Close-URL detection ─────────────────────────────────────────────
      const detectedCloseURL = extractCloseURLFromIntent(
        text,
        openedWindowsRef.current,
      );
      if (detectedCloseURL) {
        const fullURL = toFullURL(detectedCloseURL);

        let win = openedWindowsRef.current.get(fullURL);
        if (!win) {
          for (const [key, w] of openedWindowsRef.current.entries()) {
            if (
              key.includes(detectedCloseURL) ||
              detectedCloseURL.includes(new URL(key).hostname)
            ) {
              win = w;
              openedWindowsRef.current.delete(key);
              break;
            }
          }
        } else {
          openedWindowsRef.current.delete(fullURL);
        }

        let responseMsg: string;
        if (win && !win.closed) {
          win.close();
          responseMsg = `Closed the tab for **${fullURL}** ✓`;
        } else if (win && win.closed) {
          responseMsg = `The tab for **${fullURL}** was already closed.`;
        } else {
          responseMsg = `No open tab found for **${fullURL}**. It may have been closed manually or opened outside this chat.`;
        }

        setInputText("");
        setMessages((prev) => [
          ...prev,
          makeUserMessage(text),
          makeAssistantMessage(responseMsg),
        ]);
        return;
      }

      // ── 2. Open-URL detection ──────────────────────────────────────────────
      const detectedURL = extractURLFromIntent(text);
      if (detectedURL) {
        const fullURL = toFullURL(detectedURL);
        const newWin = window.open(fullURL, "_blank");
        if (newWin) openedWindowsRef.current.set(fullURL, newWin);

        setInputText("");
        setMessages((prev) => [
          ...prev,
          makeUserMessage(text),
          makeAssistantMessage(`Opening **${fullURL}** in a new tab ↗`),
        ]);
        return;
      }

      // ── 3. Reminder detection ──────────────────────────────────────────────
      if (isReminderRequest(text)) {
        const parsed = parseReminderFromMessage(text);
        if (parsed) {
          const { message } = await scheduleReminder(parsed);
          setMessages((prev) => [
            ...prev,
            makeUserMessage(text),
            makeAssistantMessage(message),
          ]);
          setInputText("");
          return;
        }
      }

      // ── 4. Normal LLM flow ────────────────────────────────────────────────
      const userMessage = makeUserMessage(text);
      const placeholder = makeStreamingPlaceholder();

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setError(null);
      setIsLoading(true);
      setMessages((prev) => [...prev, placeholder]);

      try {
        const allMessages = [...messages, userMessage];
        const reply = await sendMessage(allMessages, apiKey, selectedModel);

        // Handle LLM-driven URL open
        const openURLMatch = reply.match(/^OPEN_URL:(\S+)$/m);
        if (openURLMatch) {
          const fullURL = toFullURL(openURLMatch[1]);
          const newWin = window.open(fullURL, "_blank");
          if (newWin) openedWindowsRef.current.set(fullURL, newWin);
        }

        // Typewriter streaming
        let index = 0;
        const interval = setInterval(() => {
          index++;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholder.id
                ? { ...m, content: reply.slice(0, index) }
                : m,
            ),
          );

          if (index >= reply.length) {
            clearInterval(interval);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === placeholder.id
                  ? {
                      ...m,
                      isStreaming: false,
                      isSong:
                        isSingRequest(text) &&
                        (reply.includes("♪") ||
                          reply.includes("[") ||
                          reply.includes("Verse") ||
                          reply.includes("Chorus")),
                    }
                  : m,
              ),
            );
            setIsLoading(false);
          }
        }, 12);
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setIsLoading(false);
      }
    },
    [
      apiKey,
      selectedModel,
      messages,
      onNeedApiKey,
      setMessages,
      setIsLoading,
      setError,
      setInputText,
    ],
  );

  return { handleSend, openedWindowsRef };
};
