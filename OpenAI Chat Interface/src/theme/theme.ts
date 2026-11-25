import { createTheme } from "@mui/material/styles";

const shape = { borderRadius: 12 };

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f1117",
      paper: "#16181f",
    },
    primary: {
      main: "#7c5cfc",
      light: "#c084fc",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#64748b",
    },
    error: { main: "#ef4444" },
  },
  shape,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f1f5f9",
      paper: "#ffffff",
    },
    primary: {
      main: "#7c5cfc",
      light: "#c084fc",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    error: { main: "#ef4444" },
  },
  shape,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});
