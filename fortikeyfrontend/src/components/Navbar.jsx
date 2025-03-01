import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../theme";

/**
 * Navigation bar component for public pages
 *
 * Displays at the top of unauthenticated pages like landing page and login.
 * Adapts its layout based on the current page:
 * - Landing page: Shows expanded layout with company info
 * - Other pages: Shows compact layout with login/signup buttons
 */
const Navbar = () => {
  const colors = tokens();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <Box
      sx={{
        padding: { xs: "15px 20px", sm: "20px 40px" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary.main,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {isLandingPage ? (
        // Landing page layout - expanded with company description
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            {/* Company logo */}
            <img
              alt="FortiKey Logo"
              src="/assets/FortiKeyLogo.png"
              style={{
                height: "100px",
                marginRight: "10px",
              }}
            />

            {/* Company description - only shown on landing page */}
            <Box sx={{ maxWidth: "500px" }}>
              <Typography
                variant="h3"
                sx={{
                  color: colors.neutral.main,
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                FortiKey API Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Secure, scalable API key management for your applications.
                Monitor usage, control access, and streamline development.
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                marginRight: "10px",
                color: colors.secondary.main,
                borderColor: colors.secondary.main,
                "&:hover": {
                  borderColor: "#0056b3",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/createuser")}
              sx={{
                backgroundColor: colors.secondary.main,
                color: colors.primary.main,
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      ) : (
        // Non-landing page layout - compact with logo and buttons
        <>
          {/* Logo with home navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              alt="FortiKey Logo"
              src="/assets/FortiKeyLogo.png"
              style={{
                height: "100px",
                marginRight: "10px",
              }}
            />
          </Box>

          {/* Authentication buttons */}
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                marginRight: "10px",
                color: colors.secondary.main,
                borderColor: colors.secondary.main,
                "&:hover": {
                  borderColor: "#0056b3",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/createuser")}
              sx={{
                backgroundColor: colors.secondary.main,
                color: colors.primary.main,
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Navbar;
