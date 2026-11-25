import React from "react";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyTwoTone";
import { makeStyles } from "../hooks/makeStyles";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    wrapper: {
      display: "flex",
      alignItems: "flex-end",
      gap: "12px",
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    avatarBox: {
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
    avatarIcon: {
      fontSize: "18px !important",
      color: "#7c5cfc",
    },
    bubble: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "12px 16px",
      backgroundColor: isDark ? "#1e2130" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      borderRadius: "18px 18px 18px 4px",
      boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.07)",
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      backgroundColor: "#7c5cfc",
      animation: "bounce 1.2s ease-in-out infinite",
      "@keyframes bounce": {
        "0%, 80%, 100%": { transform: "translateY(0)", opacity: 0.4 },
        "40%": { transform: "translateY(-6px)", opacity: 1 },
      },
    },
    dot0: {
      animationDelay: "0s",
    },
    dot1: {
      animationDelay: "0.18s",
    },
    dot2: {
      animationDelay: "0.36s",
    },
  };
});

const TypingIndicator: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {/* Bot icon */}
      <div className={classes.avatarBox}>
        <SmartToyRoundedIcon className={classes.avatarIcon} />
      </div>

      <div className={classes.bubble}>
        <div className={`${classes.dot} ${classes.dot0}`} />
        <div className={`${classes.dot} ${classes.dot1}`} />
        <div className={`${classes.dot} ${classes.dot2}`} />
      </div>
    </div>
  );
};

export default TypingIndicator;