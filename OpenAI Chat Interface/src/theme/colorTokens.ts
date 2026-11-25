import type { ColorTokens } from "../types/types";

export function buildColorTokens(isDark: boolean): ColorTokens {
  return {
    bg: isDark ? "#0f1117" : "#f0f2f9",
    navbar: isDark ? "#16181f" : "#ffffff",
    navBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
    navText: isDark ? "#e2e8f0" : "#1e1b4b",
    menuIcon: isDark ? "#64748b" : "#64748b",
    menuIconHoverText: isDark ? "#e2e8f0" : "#1e1b4b",
    menuIconHoverBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
    inputBg: isDark ? "#1e2130" : "#ffffff",
    inputBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    inputFocusBorder: "rgba(124,92,252,0.5)",
    inputFocusShadow: "rgba(124,92,252,0.07)",
    placeholder: isDark ? "#4b5563" : "#a0aec0",
    inputText: isDark ? "#e2e8f0" : "#1e293b",
    footerText: isDark ? "#374151" : "#a0aec0",
    scrollThumb: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
    emptyIconBg: isDark
      ? "linear-gradient(135deg,rgba(124,92,252,0.2),rgba(192,132,252,0.2))"
      : "linear-gradient(135deg,rgba(124,92,252,0.12),rgba(192,132,252,0.12))",
    emptyIconBorder: isDark ? "rgba(124,92,252,0.3)" : "rgba(124,92,252,0.3)",
    emptyTitle: isDark ? "#e2e8f0" : "#1e1b4b",
    emptySubtitle: isDark ? "#64748b" : "#64748b",
    recordingBg: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.07)",
    recordingBorder: isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.22)",
    transcribingBg: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.07)",
    transcribingBorder: isDark
      ? "rgba(99,102,241,0.3)"
      : "rgba(99,102,241,0.2)",
    alertBg: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.06)",
    alertText: isDark ? "#fca5a5" : "#dc2626",
    alertBorder: isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.22)",
    alertIcon: isDark ? "#f87171" : "#ef4444",
  };
}