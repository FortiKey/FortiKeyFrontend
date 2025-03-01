import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { tokens } from "../theme";
import authService from "../services/authservice";

/**
 * Top navigation bar component
 *
 * Displays at the top of all authenticated pages and provides:
 * - User profile menu with sign out functionality
 * - Help button for quick access to documentation
 * - Current user name display
 *
 * This component handles user session management and navigation
 * to key areas of the application.
 */
const Topbar = () => {
  const colors = tokens();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [userName, setUserName] = useState("User");

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUserName(`${user.firstName} ${user.lastName}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile menu open
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle profile menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await authService.logout();
      handleClose();
      navigate("/signedout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={{ xs: 2, sm: 3 }}
      sx={{
        backgroundColor: colors.primary.main,
      }}
    >
      {/* User profile button */}
      <IconButton
        color="secondary"
        onClick={handleClick}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <PersonOutlinedIcon />
      </IconButton>

      {/* Profile dropdown menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            backgroundColor: colors.primary.main,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        {/* User name display (non-clickable) */}
        <MenuItem
          sx={{
            pointerEvents: "none",
            color: colors.text.secondary,
            fontWeight: 500,
          }}
        >
          {userName}
        </MenuItem>

        {/* Sign out option */}
        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
            },
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>

      {/* Help button - navigates to API documentation */}
      <IconButton
        color="secondary"
        onClick={() => navigate("/apidocumentation")}
      >
        <HelpOutlineOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Topbar;
