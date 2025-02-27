import { Box, Button, Typography, Dialog, DialogTitle } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";

const ManageAPIKeys = () => {
  const colors = tokens();
  const actualKey = "fk_live_3x7abcdef1234567890"; // What gets copied
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleGenerateNewKey = () => {
    setConfirmDialogOpen(true);
  };

  const handleGenerateConfirm = () => {
    // Add API key generation logic here
    console.log("Generating new API key...");
    setConfirmDialogOpen(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(actualKey).catch((err) => {
      console.error("Failed to copy API key:", err);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: colors.primary.main, minHeight: "100vh" }}>
        <Box m="20px">
          <Header
            title="Manage API Key"
            subtitle="View and manage your API key for FortiKey integration"
          />
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
              <Button
                variant="outlined"
                onClick={handleCopyKey}
                sx={{
                  backgroundColor: colors.primary.main,
                  color: colors.secondary.main,
                  borderColor: colors.secondary.main,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  maxWidth: "350px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 123, 255, 0.04)",
                    color: colors.secondary.main,
                    borderColor: colors.secondary.main,
                  },
                }}
              >
                {actualKey}
              </Button>

              <Button
                variant="outlined"
                onClick={handleGenerateNewKey}
                sx={{
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
                }}
              >
                Generate New API Key
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
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
              <Button
                onClick={() => setConfirmDialogOpen(false)}
                sx={{
                  backgroundColor: "#007FFF",
                  color: "white",
                  padding: "6px 16px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#0066CC" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateConfirm}
                sx={{
                  backgroundColor: "#DC3545",
                  color: "white",
                  padding: "6px 16px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#C82333" },
                }}
              >
                Generate
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageAPIKeys;
