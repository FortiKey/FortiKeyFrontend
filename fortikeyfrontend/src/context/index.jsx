import React, { createContext, useState, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

// Create the context
const ToastContext = createContext();

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
    duration: 6000,
  });

  const showToast = (message, severity = "info", duration = 6000) => {
    setToast({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Convenience methods for different toast types
  const showSuccessToast = (message, duration) =>
    showToast(message, "success", duration);
  const showErrorToast = (message, duration) =>
    showToast(message, "error", duration);
  const showWarningToast = (message, duration) =>
    showToast(message, "warning", duration);
  const showInfoToast = (message, duration) =>
    showToast(message, "info", duration);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast,
      }}
    >
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
