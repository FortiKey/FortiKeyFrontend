import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { tokens } from "../theme";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // TODO: Replace with actual user data from your auth system
  const userName = "John Doe";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // TODO: Add sign out logic here
    handleClose();
    navigate("/signedout");
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
      <IconButton color="secondary" onClick={() => navigate("/generateqr")}>
        <PersonAddAlt1OutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Topbar;
