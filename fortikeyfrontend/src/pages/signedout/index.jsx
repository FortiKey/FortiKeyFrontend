import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../global/Navbar";

const SignedOut = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
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
            backgroundColor: "white",
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
              color: "#1a1a1a",
            }}
          >
            You've Been Signed Out
          </Typography>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "32px",
              color: "#666",
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
                backgroundColor: "#007BFF",
                color: "white",
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
                borderColor: "#007BFF",
                color: "#007BFF",
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
