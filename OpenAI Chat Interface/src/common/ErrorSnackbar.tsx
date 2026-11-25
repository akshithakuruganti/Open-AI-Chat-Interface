import React from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { makeStyles } from "../hooks/makeStyles";

interface ErrorSnackbarProps {
  message: string | null;
  onDismiss: () => void;
}

const useStyles = makeStyles(() => ({
  snackbar: {
    maxWidth: 420,
  },
  alert: {
    width: "100%",
    fontSize: "0.82rem",
    alignItems: "flex-start",
    "& .MuiAlert-message": {
      wordBreak: "break-word",
    },
  },
}));

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ message, onDismiss }) => {
  const classes = useStyles();

  return (
    <Snackbar
      open={!!message}
      onClose={onDismiss}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      autoHideDuration={6000}
      className={classes.snackbar}
    >
      <Alert
        severity="error"
        onClose={onDismiss}
        action={
          <IconButton size="small" color="inherit" onClick={onDismiss}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        className={classes.alert}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;