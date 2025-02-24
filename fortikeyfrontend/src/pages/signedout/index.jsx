import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";

const SignedOut = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.otherColor.main,
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: colors.primary.main,
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "16px",
              fontWeight: 600,
              color: colors.text.primary,
            }}
          >
            You've Been Signed Out
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "32px",
              color: colors.text.secondary,
            }}
          >
            Thank you for using FortiKey. You have been successfully signed out
            of your account.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: colors.secondary.main,
                color: colors.primary.main,
                padding: "12px",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Sign In Again
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                borderColor: colors.secondary.main,
                color: colors.secondary.main,
                padding: "12px",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0056b3",
                  backgroundColor: "rgba(0, 123, 255, 0.04)",
                },
              }}
            >
              Return to Home
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignedOut;
