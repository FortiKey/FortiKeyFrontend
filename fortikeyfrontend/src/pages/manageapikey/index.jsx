import { Box, Button, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ManageAPIKeys = () => {
  const colors = tokens();
  const actualKey = "fk_live_3x7abcdef1234567890"; // What gets copied

  const handleGenerateNewKey = () => {
    if (
      window.confirm(
        "Are you sure you want to generate a new API key? This action cannot be undone."
      )
    ) {
      // Add API key generation logic here
      console.log("Generating new API key...");
    }
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
      </Box>
    </ThemeProvider>
  );
};

export default ManageAPIKeys;
