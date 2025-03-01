import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";

/**
 * Signed Out Page Component
 *
 * Displays a confirmation page after user logout.
 * Features:
 * - Clear logout confirmation message
 * - Options to return to login or landing page
 * - Consistent styling with the application theme
 * - Responsive layout for different screen sizes
 *
 * This page serves as a clean transition point after authentication
 * has been terminated, providing clear navigation options for the user.
 */
const SignedOut = () => {
  const navigate = useNavigate();
  const colors = tokens();

  // Extract common button styling
  const primaryButtonStyle = {
    bgcolor: "secondary.main",
    color: "primary.main",
    py: 1.5,
    px: 3,
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      bgcolor: "#0069d9",
    },
  };

  const secondaryButtonStyle = {
    borderColor: "secondary.main",
    color: "secondary.main",
    py: 1.5,
    px: 3,
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      borderColor: "#0069d9",
      bgcolor: "rgba(0, 123, 255, 0.04)",
    },
  };

  /**
   * Navigate to login page
   * Redirects the user to the login screen
   */
  const handleLoginClick = () => {
    navigate("/login");
  };

  /**
   * Navigate to landing page
   * Redirects the user to the main landing page
   */
  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.otherColor.main,
      }}
    >
      {/* Navigation bar */}
      <Navbar />

      {/* Main content container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "20px 10px", sm: "40px 20px" },
        }}
      >
        {/* Sign out confirmation card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            bgcolor: "primary.main",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            boxShadow: 1,
            textAlign: "center",
          }}
        >
          {/* Sign out message */}
          <Typography
            variant="h2"
            color="secondary.main"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            You've Been Signed Out
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: "18px" }}
          >
            Thank you for using FortiKey. You have been successfully signed out
            of your account.
          </Typography>

          {/* Navigation buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 2,
            }}
          >
            {/* Return to login button */}
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={primaryButtonStyle}
            >
              Return to Login
            </Button>

            {/* Return to home button */}
            <Button
              variant="outlined"
              onClick={handleHomeClick}
              sx={secondaryButtonStyle}
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
