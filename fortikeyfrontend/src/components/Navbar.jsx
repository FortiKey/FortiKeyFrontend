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

  // Extract common button styling
  const outlinedButtonStyle = {
    marginRight: "10px",
    color: colors.secondary.main,
    borderColor: colors.secondary.main,
    "&:hover": {
      borderColor: "#0056b3",
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  };

  const containedButtonStyle = {
    backgroundColor: colors.secondary.main,
    color: colors.primary.main,
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  };

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
        // Landing page layout - expanded with company info
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Logo and company name */}
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
            <Typography
              variant="h3"
              color={colors.neutral.main}
              sx={{
                fontWeight: "bold",
                display: { xs: "none", sm: "block" },
              }}
            >
              FortiKey
            </Typography>
          </Box>

          {/* Authentication buttons */}
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={outlinedButtonStyle}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/createuser")}
              sx={containedButtonStyle}
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
              sx={outlinedButtonStyle}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/createuser")}
              sx={containedButtonStyle}
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
