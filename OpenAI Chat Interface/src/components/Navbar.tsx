import React from "react";
import { Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import ModelSelector from "./ModelSelector";
import ThemeToggle from "./ThemeToggle";
import { makeStyles } from "../hooks/makeStyles";
import type { ColorTokens } from "../types/types";

interface NavbarProps {
  c: ColorTokens;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  apiKey: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onModelError?: (msg: string | null) => void;
}

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    navbar: {
      height: 52,
      display: "flex",
      alignItems: "center",
      paddingLeft: "16px",
      paddingRight: "16px",
      gap: "16px",
      flexShrink: 0,
      zIndex: 200,
      boxShadow: isDark
        ? "0 2px 10px rgba(0,0,0,0.35)"
        : "0 2px 10px rgba(0,0,0,0.08)",
    },
    menuIconButton: {
      color: "#64748b",
      transition: "color 0.15s",
      "&:hover": {
        color: isDark ? "#e2e8f0" : "#1e1b4b",
        backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
      },
    },
    title: {
      color: isDark ? "#e2e8f0" : "#1e1b4b",
      fontWeight: "700 !important",
      fontSize: "1rem !important",
      letterSpacing: "0.5px",
      userSelect: "none",
    },
    rightSlot: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    modelSelectorWrapper: {
      minWidth: 220,
    },
  };
});

const Navbar: React.FC<NavbarProps> = ({
  c,
  onToggleSidebar,
  apiKey,
  selectedModel,
  onModelChange,
  onModelError,
}) => {
  const classes = useStyles();

  return (
    <div
      className={classes.navbar}
      style={{
        backgroundColor: c.navbar,
        borderBottom: `1px solid ${c.navBorder}`,
      }}
    >
      <IconButton
        onClick={onToggleSidebar}
        size="small"
        className={classes.menuIconButton}
      >
        <MenuIcon />
      </IconButton>

      <Typography className={classes.title}>Techsophy – LiteLLM</Typography>

      <div className={classes.rightSlot}>
        {apiKey && (
          <div className={classes.modelSelectorWrapper}>
            <ModelSelector
              apiKey={apiKey}
              selectedModel={selectedModel}
              onModelChange={onModelChange}
              onError={onModelError}
              compact
            />
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;