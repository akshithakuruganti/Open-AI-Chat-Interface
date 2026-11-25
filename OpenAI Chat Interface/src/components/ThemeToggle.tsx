import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";
import { makeStyles } from "../hooks/makeStyles";

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    iconButton: {
      color: "#64748b",
      transition: "color 0.15s, background-color 0.15s",
      "&:hover": {
        color: isDark ? "#e2e8f0" : "#0f172a",
        backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
      },
    },
    icon: {
      fontSize: "20px !important",
    },
  };
});

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  const classes = useStyles();

  return (
    <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton onClick={toggleTheme} size="small" className={classes.iconButton}>
        {mode === "dark" ? (
          <LightMode className={classes.icon} />
        ) : (
          <DarkMode className={classes.icon} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;