import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from "@mui/material";
import {
  SmartToy as ModelIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { fetchModels, type LLMModel } from "../services/modelService";
import { makeStyles } from "../hooks/makeStyles";

interface ModelSelectorProps {
  apiKey: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  compact?: boolean;
  onError?: (msg: string | null) => void;
}

const modelLabel = (id: string) => id.split("/").pop() ?? id;

const useStyles = makeStyles((theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    containerCompact: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
    labelRow: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    labelIcon: {
      fontSize: "13px !important",
      color: "#64748b",
    },
    labelText: {
      fontSize: "0.7rem",
      color: "#64748b",
      fontWeight: 600,
      letterSpacing: "0.8px",
      textTransform: "uppercase" as const,
    },
    selectRow: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    select: {
      backgroundColor: isDark ? "#12141c" : "#f0f2f9",
      borderRadius: "10px !important",
      color: isDark ? "#e2e8f0" : "#1e293b",
      transition: "background-color 0.2s",
      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
      "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
      "&:hover": {
        backgroundColor: isDark ? "#1a1d2e" : "#e8eaf4",
      },
      "&.Mui-disabled": {
        opacity: 0.5,
      },
      "& .MuiSelect-icon": {
        color: "#64748b",
      },
    },
    placeholderText: {
      fontSize: "0.8rem",
      color: "#94a3b8",
    },
    errorSelectText: {
      fontSize: "0.8rem",
      color: isDark ? "#f87171" : "#dc2626",
    },
    selectedText: {
      fontSize: "0.8rem",
      color: isDark ? "#e2e8f0" : "#1e293b",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    menuPaper: {
      backgroundColor: isDark ? "#1a1d2e" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
      borderRadius: "12px !important",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.5)"
        : "0 8px 24px rgba(0,0,0,0.1)",
      maxHeight: 320,
      marginTop: "4px",
      "& .MuiMenuItem-root": {
        fontSize: "0.82rem",
        color: isDark ? "#cbd5e1" : "#334155",
        padding: "6px 16px",
        "&:hover": {
          backgroundColor: "rgba(124,92,252,0.10)",
          color: isDark ? "#e2e8f0" : "#1e1b4b",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(124,92,252,0.12)",
          color: isDark ? "#c084fc" : "#7c5cfc",
          "&:hover": {
            backgroundColor: "rgba(124,92,252,0.18)",
          },
        },
      },
    },
    errorIcon: {
      color: isDark ? "#f87171" : "#ef4444",
      fontSize: "18px !important",
      flexShrink: 0,
    },
    tooltipPopper: {
      "& .MuiTooltip-tooltip": {
        fontSize: "0.75rem",
        maxWidth: 320,
        backgroundColor: "#1e1b2e",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#fca5a5",
      },
      "& .MuiTooltip-arrow": {
        color: "#1e1b2e",
      },
    },
  };
});

const ModelSelector: React.FC<ModelSelectorProps> = ({
  apiKey,
  selectedModel,
  onModelChange,
  compact = false,
  onError,
}) => {
  const classes = useStyles();

  const [models, setModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedForKey = useRef<string | null>(null);

  useEffect(() => {
    if (!apiKey || fetchedForKey.current === apiKey) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      onError?.(null);
      try {
        const fetched = await fetchModels(apiKey);
        if (cancelled) return;
        fetchedForKey.current = apiKey;
        setModels(fetched);
        if (fetched.length > 0) {
          const stillValid = fetched.some((m) => m.id === selectedModel);
          if (!stillValid) onModelChange(fetched[0].id);
        }
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : "Failed to load models";
        setError(msg);
        onError?.(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    setError(null);
    if (!apiKey) {
      setModels([]);
      fetchedForKey.current = null;
    } else {
      fetchedForKey.current = null;
    }
  }, [apiKey]);

  if (!apiKey) return null;

  return (
    <div
      className={`${classes.container} ${compact ? classes.containerCompact : ""}`}
    >
      {!compact && (
        <div className={classes.labelRow}>
          <ModelIcon className={classes.labelIcon} />
          <Typography className={classes.labelText}>Model</Typography>
        </div>
      )}

      <div className={classes.selectRow}>
        <FormControl size="small" fullWidth>
          <Select
            value={models.length > 0 && selectedModel ? selectedModel : ""}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={loading || models.length === 0}
            displayEmpty
            className={classes.select}
            renderValue={(val) => {
              if (loading)
                return (
                  <Typography className={classes.placeholderText}>
                    Loading models…
                  </Typography>
                );
              if (error)
                return (
                  <Typography className={classes.errorSelectText}>
                    Error loading models
                  </Typography>
                );
              if (!val)
                return (
                  <Typography className={classes.placeholderText}>
                    No models available
                  </Typography>
                );
              return (
                <Typography className={classes.selectedText}>
                  {modelLabel(val)}
                </Typography>
              );
            }}
            MenuProps={{
              PaperProps: { className: classes.menuPaper },
            }}
          >
            {models.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {modelLabel(m?.id)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Tooltip
            title={error}
            placement="bottom-end"
            arrow
            PopperProps={{ className: classes.tooltipPopper }}
          >
            <ErrorIcon className={classes.errorIcon} />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;