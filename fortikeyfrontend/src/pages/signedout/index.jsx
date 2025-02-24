import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";
import { theme } from "../../theme";  

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
            bgcolor: "primary.main",
            borderRadius: 3,
            p: 5,
            boxShadow: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" color="text.primary" sx={{ mb: 2 }}>
            You've Been Signed Out
          </Typography>

          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Thank you for using FortiKey. You have been successfully signed out
            of your account.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "secondary.main",
                color: "primary.main",
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "secondary.dark",
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
                borderColor: "secondary.main",
                color: "secondary.main",
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "secondary.dark",
                  bgcolor: "secondary.lighter",
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
