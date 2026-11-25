import React from "react";
import { Avatar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Message } from "../types/types";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyTwoTone";
import { parseMarkdown } from "../utils/markdownParser";
import { makeStyles } from "../hooks/makeStyles";
import { useState } from "react";
import { VolumeUp as SingIcon, Stop as StopIcon } from "@mui/icons-material";
import { synthesizeSpeech } from "../services/ttsService";

interface MessageBubbleProps {
  message: Message;
}

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    wrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: "12px",
      width: "100%",
    },
    wrapperUser: {
      justifyContent: "flex-end",
    },
    wrapperAssistant: {
      justifyContent: "flex-start",
    },
    botAvatarBox: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      backgroundColor: isDark ? "#2a2f45" : "#ede9fe",
      border: "2px solid rgba(124,92,252,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    botIcon: {
      fontSize: "18px !important",
      color: isDark ? "#a78bfa" : "#7c5cfc",
    },
    bubbleColumn: {
      maxWidth: "72%",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    bubbleColumnUser: {
      alignItems: "flex-end",
    },
    bubbleColumnAssistant: {
      alignItems: "flex-start",
    },
    bubbleUser: {
      padding: "10px 16px",
      borderRadius: "18px 18px 4px 18px",
      background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
      border: "none",
      boxShadow: "0 4px 16px rgba(124,92,252,0.25)",
      color: "#ffffff",
      fontSize: "0.9rem",
      lineHeight: 1.6,
      wordBreak: "break-word",
      "& p": { margin: 0 },
      "& p + p": { marginTop: "8px" },
      "& code": {
        fontFamily: "monospace",
        fontSize: "0.82rem",
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: "1px 5px",
        borderRadius: "4px",
      },
      "& pre": {
        backgroundColor: isDark ? "#0f1117" : "#f1f5f9",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "10px",
        padding: "12px",
        overflowX: "auto",
        marginTop: "8px",
        marginBottom: 0,
        "& code": { backgroundColor: "transparent", padding: 0 },
      },
      "& ul, & ol": { paddingLeft: "20px", margin: "4px 0" },
      "& li": { marginBottom: "2px" },
      "& a": { color: "#e9d5ff", textDecoration: "underline" },
      "& strong": { fontWeight: 700 },
      "& em": { fontStyle: "italic" },
      "& blockquote": {
        borderLeft: "3px solid rgba(124,92,252,0.5)",
        paddingLeft: "12px",
        marginLeft: 0,
        color: isDark ? "#94a3b8" : "#64748b",
      },
    },
    bubbleAssistant: {
      padding: "10px 16px",
      borderRadius: "18px 18px 18px 4px",
      backgroundColor: isDark ? "#1e2130" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      boxShadow: isDark
        ? "0 2px 8px rgba(0,0,0,0.2)"
        : "0 1px 4px rgba(0,0,0,0.07)",
      color: isDark ? "#e2e8f0" : "#1e293b",
      fontSize: "0.9rem",
      lineHeight: 1.6,
      wordBreak: "break-word",
      "& p": { margin: 0 },
      "& p + p": { marginTop: "8px" },
      "& code": {
        fontFamily: "monospace",
        fontSize: "0.82rem",
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        padding: "1px 5px",
        borderRadius: "4px",
      },
      "& pre": {
        backgroundColor: isDark ? "#0f1117" : "#f1f5f9",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "10px",
        padding: "12px",
        overflowX: "auto",
        marginTop: "8px",
        marginBottom: 0,
        "& code": { backgroundColor: "transparent", padding: 0 },
      },
      "& ul, & ol": { paddingLeft: "20px", margin: "4px 0" },
      "& li": { marginBottom: "2px" },
      "& a": {
        color: isDark ? "#a78bfa" : "#7c5cfc",
        textDecoration: "underline",
      },
      "& strong": { fontWeight: 700 },
      "& em": { fontStyle: "italic" },
      "& blockquote": {
        borderLeft: "3px solid rgba(124,92,252,0.5)",
        paddingLeft: "12px",
        marginLeft: 0,
        color: isDark ? "#94a3b8" : "#64748b",
      },
    },
    cursor: {
      display: "inline-block",
      width: "2px",
      height: "1em",
      marginLeft: "2px",
      verticalAlign: "text-bottom",
      animation: "blink 0.8s step-start infinite",
      "@keyframes blink": {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0 },
      },
    },
    cursorUser: {
      backgroundColor: "#ffffff",
    },
    cursorAssistant: {
      backgroundColor: isDark ? "#e2e8f0" : "#1e293b",
    },
    timestamp: {
      fontSize: "0.58rem",
      color: isDark ? "#475569" : "#94a3b8",
      padding: "0 4px",
    },
    userAvatar: {
      width: "32px !important",
      height: "32px !important",
      backgroundColor: "rgba(124,92,252,0.12)",
      border: "2px solid rgba(124,92,252,0.4)",
      color: isDark ? "#a78bfa" : "#7c5cfc",
      flexShrink: 0,
    },
    singRow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginTop: "8px",
      paddingTop: "8px",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
    },
    singButton: {
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "0.75rem",
      color: isDark ? "#a78bfa" : "#7c5cfc",
      border: `1px solid ${isDark ? "rgba(167,139,250,0.3)" : "rgba(124,92,252,0.3)"}`,
      backgroundColor: isDark
        ? "rgba(124,92,252,0.08)"
        : "rgba(124,92,252,0.06)",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: isDark
          ? "rgba(124,92,252,0.16)"
          : "rgba(124,92,252,0.12)",
      },
    },
    singButtonActive: {
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.3)",
      backgroundColor: "rgba(239,68,68,0.08)",
      "&:hover": {
        backgroundColor: "rgba(239,68,68,0.14)",
      },
    },
  };
});

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isUser = message.role === "user";

  const cleanMessageContent = message.content
    .split("\n")
    .filter(
      (line) =>
        !/\bI\s+(?:can(?:'t|not)|don't)\s+sing\b/i.test(line) &&
        !/\bI\s+can't\s+sing\s+it\s+out\s+loud\b/i.test(line),
    )
    .join("\n")
    .trim();

  const formattedContent = parseMarkdown(
    cleanMessageContent || message.content,
  );
  const [isSinging, setIsSinging] = useState(false);

  const handleSing = async () => {
    if (isSinging) {
      window.speechSynthesis.cancel();
      setIsSinging(false);
      return;
    }
    setIsSinging(true);
    try {
      await synthesizeSpeech(message.content);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSinging(false);
    }
  };

  return (
    <div
      className={`${classes.wrapper} ${isUser ? classes.wrapperUser : classes.wrapperAssistant}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className={classes.botAvatarBox}>
          <SmartToyRoundedIcon className={classes.botIcon} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`${classes.bubbleColumn} ${isUser ? classes.bubbleColumnUser : classes.bubbleColumnAssistant}`}
      >
        <div className={isUser ? classes.bubbleUser : classes.bubbleAssistant}>
          <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          {message.isStreaming && (
            <span
              className={`${classes.cursor} ${isUser ? classes.cursorUser : classes.cursorAssistant}`}
            />
          )}
          {!isUser &&
            (message.isSong || /[♪♫]/.test(message.content)) &&
            !message.isStreaming && (
              <div className={classes.singRow}>
                <button
                  className={`${classes.singButton} ${isSinging ? classes.singButtonActive : ""}`}
                  onClick={handleSing}
                >
                  {isSinging ? (
                    <>
                      <StopIcon style={{ fontSize: 14 }} /> Stop singing
                    </>
                  ) : (
                    <>
                      <SingIcon style={{ fontSize: 14 }} /> Sing it aloud
                    </>
                  )}
                </button>
              </div>
            )}
        </div>

        {/* Timestamp */}
        <Typography className={classes.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </div>

      {/* User avatar */}
      {isUser && (
        <Avatar className={classes.userAvatar}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
