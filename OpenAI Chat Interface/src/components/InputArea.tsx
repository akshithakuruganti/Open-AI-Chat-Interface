import React from "react";
import {
  Typography,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  HourglassEmpty as HourglassIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "../hooks/makeStyles";
import VoiceStatusBar from "./VoiceStatusBar";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    inputArea: {
      paddingLeft: "48px",
      paddingRight: "48px",
      paddingBottom: "24px",
      paddingTop: "12px",
      "@media (max-width: 600px)": {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    inputPaper: {
      display: "flex",
      alignItems: "flex-end",
      gap: "8px",
      padding: "10px 12px",
      borderRadius: "14px",
      backgroundColor: isDark ? "#1e2130" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
      boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
      "&:focus-within": {
        borderColor: "rgba(124,92,252,0.5)",
        boxShadow: "0 0 0 3px rgba(124,92,252,0.07)",
      },
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    textField: {
      "& .MuiInputBase-root": {
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontSize: "0.95rem",
        paddingTop: "4px",
        paddingBottom: "4px",
      },
      "& .MuiInputBase-input::placeholder": {
        color: isDark ? "#4b5563" : "#a0aec0",
        opacity: 1,
      },
    },
    iconsRow: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      flexShrink: 0,
    },
    micButtonRecording: {
      color: "#ef4444",
      backgroundColor: "rgba(239,68,68,0.12)",
      transition: "all 0.2s",
    },
    micButtonTranscribing: {
      color: "#818cf8",
      backgroundColor: "rgba(129,140,248,0.12)",
      transition: "all 0.2s",
    },
    micButtonIdle: {
      color: "#64748b",
      "&:hover": {
        backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
        color: isDark ? "#e2e8f0" : "#0f172a",
      },
      transition: "all 0.2s",
    },
    sendButtonActive: {
      background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
      color: "#fff",
      "&:hover": {
        background: "linear-gradient(135deg,#6d4ef0,#b06bfa)",
        transform: "scale(1.05)",
      },
      transition: "all 0.2s",
    },
    sendButtonDisabled: {
      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
      color: isDark ? "#374151" : "#94a3b8",
      transition: "all 0.2s",
    },
    spinIcon: {
      animation: "spin 1s linear infinite",
      "@keyframes spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
    footerText: {
      color: isDark ? "#374151" : "#a0aec0",
      fontSize: "0.7rem !important",
      textAlign: "center",
      marginTop: "8px",
    },
  };
});

interface Props {
  inputText: string;
  onChangeInput: (value: string) => void;
  onSend: () => void;
  onVoiceToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  canSend: boolean;
  isSpeechSupported: boolean;
  navBorder: string;
  bg: string;
}

const InputArea: React.FC<Props> = ({
  inputText,
  onChangeInput,
  onSend,
  onVoiceToggle,
  onKeyDown,
  isLoading,
  isRecording,
  isTranscribing,
  canSend,
  isSpeechSupported,
  navBorder,
  bg,
}) => {
  const classes = useStyles();

  return (
    <div
      className={classes.inputArea}
      style={{ borderTop: `1px solid ${navBorder}`, backgroundColor: bg }}
    >
      <VoiceStatusBar isRecording={isRecording} isTranscribing={isTranscribing} />

      <Paper elevation={0} className={classes.inputPaper}>
        <TextField
          multiline
          maxRows={6}
          fullWidth
          variant="standard"
          placeholder={
            isRecording
              ? "Recording… click stop when done"
              : isTranscribing
                ? "Transcribing your audio…"
                : "Message Chat Interface…"
          }
          value={inputText}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading || isTranscribing}
          InputProps={{ disableUnderline: true }}
          className={classes.textField}
        />

        <div className={classes.iconsRow}>
          {isSpeechSupported && (
            <IconButton
              onClick={onVoiceToggle}
              disabled={isLoading || isTranscribing}
              size="small"
              className={
                isRecording
                  ? classes.micButtonRecording
                  : isTranscribing
                    ? classes.micButtonTranscribing
                    : classes.micButtonIdle
              }
            >
              {isTranscribing ? (
                <HourglassIcon className={classes.spinIcon} />
              ) : isRecording ? (
                <StopIcon />
              ) : (
                <MicIcon />
              )}
            </IconButton>
          )}

          <IconButton
            onClick={onSend}
            disabled={!canSend}
            size="small"
            className={canSend ? classes.sendButtonActive : classes.sendButtonDisabled}
          >
            <SendIcon style={{ fontSize: 18 }} />
          </IconButton>
        </div>
      </Paper>

      <Typography className={classes.footerText}>
        Enter to send · Shift+Enter for new line · Click mic to speak
      </Typography>
    </div>
  );
};

export default InputArea;