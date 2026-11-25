import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiDivider from "@mui/material/Divider";
import MuiList from "@mui/material/List";
import MuiListItem from "@mui/material/ListItem";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiTypography from "@mui/material/Typography";
import MuiSwitch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {
  Add as AddIcon,
  VpnKey as VpnKeyIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

// Constants
const DRAWER_WIDTH = 240;
const ICON_COL = 40; // spacing(7) = 56px → 56-16 = 40

// Prop interfaces for styled components
interface DarkProps {
  isDark: boolean;
}
interface OpenProps {
  sidebarOpen: boolean;
}
interface ApiProps {
  hasKey: boolean;
  isDark: boolean;
}
interface TextProps {
  sidebarOpen: boolean;
}

// Drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    backgroundColor: theme.palette.mode === "dark" ? "#16181f" : "#ffffff",
    borderRight:
      theme.palette.mode === "dark"
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid rgba(0,0,0,0.08)",
    overflowX: "hidden",
    ...(!open && {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7),
      },
    }),
  },
}));

// List
const List = styled(MuiList)({
  paddingTop: 12,
  paddingBottom: 16,
});

// New Chat ListItem
const NewChatItem = styled(MuiListItem)({
  paddingLeft: 8,
  paddingRight: 8,
  marginBottom: 16,
});

const NewChatButton = styled(MuiListItemButton, {
  shouldForwardProp: (prop) => prop !== "isDark",
})<DarkProps>(({ isDark }) => ({
  borderRadius: 8,
  color: isDark ? "#c084fc" : "#000000",
  border: "1px solid rgba(124,92,252,0.45)",
  backgroundColor: "rgba(124,92,252,0.08)",
  paddingLeft: 0,
  paddingRight: 0,
  minHeight: 40,
  "&:hover": {
    backgroundColor: "rgba(124,92,252,0.18)",
    color: isDark ? "#ffffff" : "#1e1b4b",
  },
}));

const NewChatIconRoot = styled(MuiListItemIcon)({
  minWidth: ICON_COL,
  display: "flex",
  justifyContent: "center",
  color: "inherit",
});

const NewChatText = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen",
})<TextProps>(({ sidebarOpen }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  color: "inherit",
  opacity: sidebarOpen ? 1 : 0,
  transition: "opacity 0.18s ease",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

// Divider
const Divider = styled(MuiDivider, {
  shouldForwardProp: (prop) => prop !== "isDark",
})<DarkProps>(({ isDark }) => ({
  marginLeft: 8,
  marginRight: 8,
  marginTop: 8,
  marginBottom: 8,
  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
}));

// API Key ListItem
const ApiKeyItem = styled(MuiListItem)({
  paddingLeft: 8,
  paddingRight: 8,
});

const ApiKeyButton = styled(MuiListItemButton, {
  shouldForwardProp: (prop) => prop !== "isDark",
})<DarkProps>(({ isDark }) => ({
  borderRadius: 8,
  color: isDark ? "#c9d1d9" : "#475569",
  paddingLeft: 0,
  paddingRight: 0,
  minHeight: 40,
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(255,255,255,0.07)"
      : "rgba(124,92,252,0.06)",
    color: isDark ? "#ffffff" : "#1e1b4b",
  },
}));

const ApiKeyIconRoot = styled(MuiListItemIcon)({
  minWidth: ICON_COL,
  display: "flex",
  justifyContent: "center",
  color: "inherit",
});

const ApiKeyIconWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
});

const ApiKeyDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasKey" && prop !== "isDark",
})<ApiProps>(({ hasKey, isDark }) => ({
  position: "absolute",
  top: -3,
  right: -3,
  width: 7,
  height: 7,
  borderRadius: "50%",
  backgroundColor: hasKey ? "#22c55e" : "#ef4444",
  border: `1.5px solid ${isDark ? "#16181f" : "#ffffff"}`,
  boxShadow: hasKey
    ? "0 0 5px rgba(34,197,94,0.85)"
    : "0 0 5px rgba(239,68,68,0.7)",
}));

const ApiKeyText = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen",
})<TextProps>(({ sidebarOpen }) => ({
  fontSize: "0.9rem",
  fontWeight: 400,
  color: "inherit",
  flex: 1,
  opacity: sidebarOpen ? 1 : 0,
  transition: "opacity 0.18s ease",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const ApiKeySwitch = styled(MuiSwitch, {
  shouldForwardProp: (prop) => prop !== "isDark",
})<DarkProps>(({ isDark }) => ({
  marginRight: 8,
  flexShrink: 0,
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#22c55e",
  },
  "& .MuiSwitch-track": {
    backgroundColor: isDark ? "#374151" : "#cbd5e1",
  },
}));

// Model Selector Box
const ModelSelectorBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen",
})<OpenProps>(({ sidebarOpen }) => ({
  paddingLeft: 8,
  paddingRight: 8,
  overflow: "hidden",
  opacity: sidebarOpen ? 1 : 0,
  pointerEvents: sidebarOpen ? "auto" : "none",
  transition: "opacity 0.18s ease",
}));

// Component
interface SidebarProps {
  sidebarOpen: boolean;
  apiKey: string;
  onNewChat: () => void;
  onClearHistory: () => void;
  onOpenApiKey: () => void;
  modelSelectorSlot?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  apiKey,
  onNewChat,
  onClearHistory,
  onOpenApiKey,
  modelSelectorSlot,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Drawer variant="permanent" open={sidebarOpen}>
      <List disablePadding>
        {/* New Chat */}
        <Tooltip title={!sidebarOpen ? "New chat" : ""} placement="right" arrow>
          <NewChatItem disablePadding>
            <NewChatButton onClick={onNewChat} isDark={isDark}>
              <NewChatIconRoot>
                <AddIcon style={{ fontSize: 20 }} />
              </NewChatIconRoot>
              <NewChatText noWrap sidebarOpen={sidebarOpen}>
                New chat
              </NewChatText>
            </NewChatButton>
          </NewChatItem>
        </Tooltip>

        {/* Clear History */}
        <Tooltip
          title={!sidebarOpen ? "Clear history" : ""}
          placement="right"
          arrow
        >
          <NewChatItem disablePadding>
            <NewChatButton
              onClick={onClearHistory}
              isDark={isDark}
              style={{
                borderColor: "rgba(239,68,68,0.4)",
                backgroundColor: "rgba(239,68,68,0.07)",
                color: isDark ? "#fca5a5" : "#dc2626",
              }}
            >
              <NewChatIconRoot>
                <DeleteIcon style={{ fontSize: 20 }} />
              </NewChatIconRoot>
              <NewChatText noWrap sidebarOpen={sidebarOpen}>
                Clear history
              </NewChatText>
            </NewChatButton>
          </NewChatItem>
        </Tooltip>

        {/* Divider */}
        <Divider isDark={isDark} />

        {/* API Key */}
        <Tooltip title={!sidebarOpen ? "API Key" : ""} placement="right" arrow>
          <ApiKeyItem disablePadding>
            <ApiKeyButton onClick={onOpenApiKey} isDark={isDark}>
              <ApiKeyIconRoot>
                <ApiKeyIconWrapper>
                  <VpnKeyIcon style={{ fontSize: 20 }} />
                  <ApiKeyDot hasKey={!!apiKey} isDark={isDark} />
                </ApiKeyIconWrapper>
              </ApiKeyIconRoot>

              <ApiKeyText noWrap sidebarOpen={sidebarOpen}>
                API Key
              </ApiKeyText>

              {sidebarOpen && (
                <ApiKeySwitch
                  checked={!!apiKey}
                  onChange={onOpenApiKey}
                  size="small"
                  isDark={isDark}
                />
              )}
            </ApiKeyButton>
          </ApiKeyItem>
        </Tooltip>

        {/* Model Selector Slot */}
        {modelSelectorSlot && (
          <>
            <Divider isDark={isDark} />
            <ModelSelectorBox sidebarOpen={sidebarOpen}>
              {modelSelectorSlot}
            </ModelSelectorBox>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
