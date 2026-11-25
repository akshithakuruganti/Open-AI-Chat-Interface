import React from "react";
import { Typography } from "@mui/material";
import { makeStyles } from "../hooks/makeStyles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    statusBar: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
      padding: "6px 16px",
      borderRadius: "8px",
    },
    statusBarRecording: {
      backgroundColor: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.07)",
      border: `1px solid ${isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.22)"}`,
    },
    statusBarTranscribing: {
      backgroundColor: isDark
        ? "rgba(99,102,241,0.12)"
        : "rgba(99,102,241,0.07)",
      border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      animation: "pulse 1.2s ease-in-out infinite",
      "@keyframes pulse": {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.3 },
      },
    },
    statusDotRecording: { backgroundColor: "#ef4444" },
    statusDotTranscribing: { backgroundColor: "#818cf8" },
    statusTextRecording: { fontSize: "0.8rem", color: "#fca5a5" },
    statusTextTranscribing: { fontSize: "0.8rem", color: "#a5b4fc" },
  };
});

interface Props {
  isRecording: boolean;
  isTranscribing: boolean;
}

const VoiceStatusBar: React.FC<Props> = ({ isRecording, isTranscribing }) => {
  const classes = useStyles();

  if (!isRecording && !isTranscribing) return null;

  return (
    <div
      className={`${classes.statusBar} ${
        isTranscribing
          ? classes.statusBarTranscribing
          : classes.statusBarRecording
      }`}
    >
      <div
        className={`${classes.statusDot} ${
          isTranscribing
            ? classes.statusDotTranscribing
            : classes.statusDotRecording
        }`}
      />
      <Typography
        className={
          isTranscribing
            ? classes.statusTextTranscribing
            : classes.statusTextRecording
        }
      >
        {isTranscribing ? "Transcribing audio…" : "Listening… speak now"}
      </Typography>
    </div>
  );
};

export default VoiceStatusBar;