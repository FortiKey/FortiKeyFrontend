import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { useToast } from "../../context";
import apiService from "../../services/apiservice";

/**
 * Manage API Keys Page Component
 *
 * Provides functionality to view, copy, and generate API keys.
 * Includes a confirmation dialog for generating new keys.
 * Uses the toast notification system for user feedback.
 */
const ManageAPIKeys = () => {
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  // State management
  const [apiKey, setApiKey] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the current API key on component mount
    fetchApiKey();
  }, []);

  /**
   * Fetches the current API key from the backend
   */
  const fetchApiKey = async () => {
    try {
      setLoading(true);
      setError("");
      const key = await apiService.getCurrentKey();
      setApiKey(key);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
      setError("Failed to load your API key. Please try again.");
      showErrorToast("Failed to load your API key");
    } finally {
      setLoading(false);
    }
  };

  // Extract common button styling
  const apiKeyButtonStyle = {
    backgroundColor: colors.primary.main,
    color: colors.secondary.main,
    borderColor: colors.secondary.main,
    whiteSpace: "nowrap",
    width: "100%",
    maxWidth: "350px",
    "&:hover": {
      backgroundColor: "rgba(0, 123, 255, 0.04)",
      color: colors.secondary.main,
      borderColor: colors.secondary.main,
    },
  };

  // Extract dialog button styling
  const dialogButtonStyle = {
    padding: "6px 16px",
    textTransform: "uppercase",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const cancelButtonStyle = {
    ...dialogButtonStyle,
    backgroundColor: "#007FFF",
    color: "white",
    "&:hover": { backgroundColor: "#0066CC" },
  };

  const generateButtonStyle = {
    ...dialogButtonStyle,
    backgroundColor: "#DC3545",
    color: "white",
    "&:hover": { backgroundColor: "#C82333" },
  };

  /**
   * Opens the confirmation dialog for generating a new API key
   */
  const handleGenerateNewKey = () => {
    setConfirmDialogOpen(true);
  };

  /**
   * Handles the confirmation to generate a new API key
   * Makes an API call to generate a new key
   */
  const handleGenerateConfirm = async () => {
    try {
      setGenerating(true);
      setError("");
      const newKey = await apiService.generateNewKey();
      setApiKey(newKey);
      setConfirmDialogOpen(false);
      showSuccessToast("New API key generated successfully!");
    } catch (error) {
      console.error("Failed to generate new API key:", error);
      setError("Failed to generate new API key. Please try again.");
      showErrorToast("Failed to generate new API key");
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Copies the API key to the clipboard
   * Provides user feedback via toast notifications
   */
  const handleCopyKey = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        showSuccessToast("API key copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy API key:", err);
        showErrorToast("Failed to copy API key. Please try again.");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: colors.primary.main, minHeight: "100vh" }}>
        <Box m="20px">
          {/* Page header */}
          <Header
            title="Manage API Key"
            subtitle="View and manage your API key for FortiKey integration"
          />

          {/* Error message if present */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              p: { xs: 2, sm: 4 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: { xs: "flex-end", sm: "flex-start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                alignItems: { xs: "flex-end", sm: "flex-start" },
              }}
            >
              {/* Loading state */}
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: "350px",
                    p: 2,
                  }}
                >
                  <CircularProgress size={30} color="secondary" />
                </Box>
              ) : (
                <>
                  {/* API key display with copy functionality */}
                  <Button
                    variant="outlined"
                    onClick={handleCopyKey}
                    sx={{
                      ...apiKeyButtonStyle,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {apiKey || "No API key available"}
                  </Button>

                  {/* Generate new key button */}
                  <Button
                    variant="outlined"
                    onClick={handleGenerateNewKey}
                    sx={apiKeyButtonStyle}
                    disabled={loading}
                  >
                    Generate New API Key
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => !generating && setConfirmDialogOpen(false)}
          PaperProps={{
            style: {
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "400px",
              border: `1px solid ${colors.secondary.main}`,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#007FFF",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Generate New API Key
            </Typography>
          </DialogTitle>
          <Box p={2}>
            {/* Dialog content with warning message */}
            <Typography
              sx={{
                textAlign: "center",
                mb: 3,
                color: "rgba(0, 0, 0, 0.7)",
                fontSize: "16px",
              }}
            >
              Are you sure you want to generate a new API key? This action
              cannot be undone.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {/* Cancel button */}
              <Button
                onClick={() => setConfirmDialogOpen(false)}
                sx={cancelButtonStyle}
                disabled={generating}
              >
                Cancel
              </Button>
              {/* Generate button */}
              <Button
                onClick={handleGenerateConfirm}
                sx={generateButtonStyle}
                disabled={generating}
              >
                {generating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Generate"
                )}
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageAPIKeys;
