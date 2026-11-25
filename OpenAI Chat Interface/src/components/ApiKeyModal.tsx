import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  VpnKey as VpnKeyIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { makeStyles } from "../hooks/makeStyles";

interface ApiKeyModalProps {
  currentApiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    dialogPaper: {
      backgroundColor: isDark ? "#1a1d2a" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(124,92,252,0.25)" : "rgba(124,92,252,0.2)"}`,
      borderRadius: "20px",
      minWidth: 400,
      boxShadow: isDark
        ? "0 24px 64px rgba(0,0,0,0.6)"
        : "0 24px 64px rgba(0,0,0,0.12)",
    },
    backdrop: {
      backdropFilter: "blur(6px)",
      backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(15,17,23,0.4)",
    },
    iconHeader: {
      display: "flex",
      justifyContent: "center",
      paddingTop: theme.spacing(3.5),
    },
    iconBox: {
      width: 52,
      height: 52,
      borderRadius: "14px",
      background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 24px rgba(124,92,252,0.35)",
    },
    iconStyle: {
      color: "#fff",
      fontSize: "26px !important",
    },
    dialogTitle: {
      color: isDark ? "#f1f5f9" : "#1e1b4b",
      fontWeight: "700 !important",
      textAlign: "center",
      fontSize: "1.2rem !important",
      paddingTop: `${theme.spacing(1.5)} !important`,
      paddingBottom: `${theme.spacing(0.5)} !important`,
    },
    dialogContent: {
      paddingLeft: `${theme.spacing(3.5)} !important`,
      paddingRight: `${theme.spacing(3.5)} !important`,
    },
    subtitle: {
      color: "#64748b",
      fontSize: "0.85rem",
      textAlign: "center",
      marginBottom: `${theme.spacing(2.5)} !important`,
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        backgroundColor: isDark ? "#0f1117" : "#f8fafc",
        borderRadius: "12px",
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontSize: "0.9rem",
        fontFamily: "monospace",
        "& fieldset": {
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(124,92,252,0.4)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#7c5cfc",
        },
      },
      "& input::placeholder": {
        color: isDark ? "#4b5563" : "#94a3b8",
        opacity: 1,
      },
    },
    visibilityIcon: {
      color: "#64748b",
      "&:hover": {
        color: isDark ? "#a78bfa" : "#7c5cfc",
      },
    },
    dialogActions: {
      paddingLeft: `${theme.spacing(3.5)} !important`,
      paddingRight: `${theme.spacing(3.5)} !important`,
      paddingBottom: `${theme.spacing(3)} !important`,
      gap: theme.spacing(1),
    },
    cancelButton: {
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      color: isDark ? "#94a3b8" : "#64748b",
      borderRadius: "10px !important",
      textTransform: "none !important" as "none",
      fontWeight: "600 !important",
      "&:hover": {
        borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      },
    },
    saveButton: {
      background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
      borderRadius: "10px !important",
      textTransform: "none !important" as "none",
      fontWeight: "700 !important",
      boxShadow: "0 4px 16px rgba(124,92,252,0.35)",
      "&:hover": {
        background: "linear-gradient(135deg,#6d4ef0,#b06bfa)",
      },
      "&.Mui-disabled": {
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        color: isDark ? "#374151" : "#94a3b8",
      },
    },
  };
});

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  currentApiKey,
  onSave,
  onClose,
}) => {
  const classes = useStyles();
  const [apiKeyTemp, setApiKeyTemp] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => onSave(apiKeyTemp.trim());

  return (
    <Dialog
      open
      onClose={() => currentApiKey && onClose()}
      PaperProps={{ className: classes.dialogPaper }}
      BackdropProps={{ className: classes.backdrop }}
    >
      {/* Icon header */}
      <Box className={classes.iconHeader}>
        <Box className={classes.iconBox}>
          <VpnKeyIcon className={classes.iconStyle} />
        </Box>
      </Box>
      <DialogTitle className={classes.dialogTitle}>
        Enter your API Key
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography className={classes.subtitle}>
          Your key is stored locally and only sent to the API endpoint.
        </Typography>

        <TextField
          fullWidth
          autoFocus
          type={showKey ? "text" : "password"}
          placeholder="sk-..."
          value={apiKeyTemp}
          onChange={(e) => setApiKeyTemp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          variant="outlined"
          className={classes.textField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowKey((p) => !p)}
                  edge="end"
                  size="small"
                  className={classes.visibilityIcon}
                >
                  {showKey ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          className={classes.saveButton}
        >
          Save Key
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyModal;
