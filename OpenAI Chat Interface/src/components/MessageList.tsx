import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import type { Message } from "../types/types";
import { makeStyles } from "../hooks/makeStyles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    messagesArea: {
      flex: 1,
      overflowY: "auto",
      padding: "32px 48px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      "&::-webkit-scrollbar": { width: 6 },
      "&::-webkit-scrollbar-track": { background: "transparent" },
      "&::-webkit-scrollbar-thumb": {
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
        borderRadius: 3,
      },
      "@media (max-width: 600px)": {
        padding: "32px 16px",
      },
    },
  };
});

interface Props {
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  isSpeechSupported: boolean;
}

const MessageList: React.FC<Props> = ({
  messages,
  isLoading,
  selectedModel,
  isSpeechSupported,
}) => {
  const classes = useStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className={classes.messagesArea}>
      {messages.length === 0 && !isLoading && (
        <EmptyState
          selectedModel={selectedModel}
          isSpeechSupported={isSpeechSupported}
        />
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && !messages.some((m) => m.isStreaming) && (
        <TypingIndicator />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;