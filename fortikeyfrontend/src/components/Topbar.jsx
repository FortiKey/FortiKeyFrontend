import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { tokens } from "../theme";
import authService from "../services/authservice";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get current user data when component mounts
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      p={3}
      sx={{
        backgroundColor: colors.primary.main,
      }}
    >
      <IconButton
        color="secondary"
        onClick={handleClick}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <PersonOutlinedIcon />
      </IconButton>
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
        <MenuItem
          sx={{
            pointerEvents: "none",
            color: colors.text.secondary,
            fontWeight: 500,
          }}
        >
          {userName}
        </MenuItem>
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
