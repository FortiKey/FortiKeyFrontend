import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../theme";


const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <Box
      sx={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary.main,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {isLandingPage ? (
        // Landing page layout
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
              alignItems: "center",
              height: "100%",
              paddingTop: "8px",
            }}
          >
            <img
              alt="FortiKey Logo"
              src="/assets/FortiKeyLogo.png"
              style={{
                height: "120px",
                marginRight: "20px",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ marginBottom: "8px" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: colors.text.primary }}
              >
                FORTIKEY
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.text.secondary }}
              >
                Secure. Simple. Scalable.
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                maxWidth: "600px",
                marginBottom: "20px",
              }}
            >
              Enhance security effortlessly with our plug-and-play 2FA platform.
              Seamlessly integrate, manage with ease, and protect user accounts
              with an intuitive dashboard and robust API.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
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
        </Box>
      ) : (
        // Regular layout for other pages
        <>
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
