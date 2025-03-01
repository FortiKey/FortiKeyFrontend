import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * Toast Context
 *
 * Provides a global notification system for the application.
 * Allows components to display toast messages without managing their own state.
 */
const ToastContext = createContext();

/**
 * Toast Provider Component
 *
 * Wraps the application to provide toast notification functionality.
 * Manages the state and rendering of toast notifications.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to toast context
 */
export const ToastProvider = ({ children }) => {
  // State for toast visibility and configuration
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // "success", "error", "warning", "info"

  /**
   * Close the currently displayed toast
   *
   * @param {React.SyntheticEvent} event - The event that triggered the close
   * @param {string} reason - Reason for closing the toast
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /**
   * Show a success toast notification
   *
   * @param {string} msg - Message to display in the toast
   */
  const showSuccessToast = (msg) => {
    setMessage(msg);
    setSeverity("success");
    setOpen(true);
  };

  /**
   * Show an error toast notification
   *
   * @param {string} msg - Message to display in the toast
   */
  const showErrorToast = (msg) => {
    setMessage(msg);
    setSeverity("error");
    setOpen(true);
  };

  /**
   * Show a warning toast notification
   *
   * @param {string} msg - Message to display in the toast
   */
  const showWarningToast = (msg) => {
    setMessage(msg);
    setSeverity("warning");
    setOpen(true);
  };

  /**
   * Show an info toast notification
   *
   * @param {string} msg - Message to display in the toast
   */
  const showInfoToast = (msg) => {
    setMessage(msg);
    setSeverity("info");
    setOpen(true);
  };

  // Context value containing toast control functions
  const contextValue = {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast notification component */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use the toast context
 *
 * Provides easy access to toast notification functions from any component.
 *
 * @returns {Object} Toast notification functions
 * @throws {Error} If used outside of a ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
