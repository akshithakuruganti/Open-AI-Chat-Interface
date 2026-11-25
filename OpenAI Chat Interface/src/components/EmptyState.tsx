import React from "react";
import { Typography } from "@mui/material";
import { makeStyles } from "../hooks/makeStyles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    emptyState: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "16px",
      marginTop: "80px",
    },
    emptyIconBox: {
      width: 72,
      height: 72,
      borderRadius: "20px",
      border: "1px solid rgba(124,92,252,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      marginBottom: "8px",
      background: isDark
        ? "linear-gradient(135deg,rgba(124,92,252,0.2),rgba(192,132,252,0.2))"
        : "linear-gradient(135deg,rgba(124,92,252,0.12),rgba(192,132,252,0.12))",
    },
    emptyTitle: {
      color: isDark ? "#e2e8f0" : "#1e1b4b",
      fontWeight: "700 !important",
    },
    emptySubtitle: {
      color: "#64748b",
      maxWidth: 360,
      fontSize: "0.9rem !important",
    },
    modelHighlight: { color: "#c084fc", fontWeight: 600 },
    noSpeechText: { color: "#f87171", display: "block", marginTop: "4px" },
  };
});

interface Props {
  selectedModel: string;
  isSpeechSupported: boolean;
}

const EmptyState: React.FC<Props> = ({ selectedModel, isSpeechSupported }) => {
  const classes = useStyles();

  return (
    <div className={classes.emptyState}>
      <div className={classes.emptyIconBox}>💬</div>
      <Typography variant="h5" className={classes.emptyTitle}>
        How can I help you today?
      </Typography>
      <Typography className={classes.emptySubtitle}>
        {selectedModel ? (
          <>
            Using{" "}
            <span className={classes.modelHighlight}>{selectedModel}</span>. Type
            a message or use the microphone to speak.
          </>
        ) : (
          "Type a message or use the microphone to speak."
        )}
        {!isSpeechSupported && (
          <span className={classes.noSpeechText}>
            (Voice input not supported in this browser)
          </span>
        )}
      </Typography>
    </div>
  );
};

export default EmptyState;