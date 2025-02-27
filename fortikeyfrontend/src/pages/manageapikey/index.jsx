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
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
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
                  minWidth: 0,
                  width: "100%",
                  "&:hover": {
                    backgroundColor: colors.primary.main,
                    borderColor: colors.secondary.main,
                    opacity: 0.9,
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
                  "&:hover": {
                    backgroundColor: colors.primary.main,
                    borderColor: colors.secondary.main,
                    opacity: 0.9,
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
