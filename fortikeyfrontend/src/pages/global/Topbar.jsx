import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" justifyContent="flex-end" p={3}>
      <IconButton color="secondary">
        <SettingsOutlinedIcon />
      </IconButton>
      <IconButton color="secondary">
        <PersonOutlinedIcon />
      </IconButton>
      <IconButton color="secondary">
        <HelpOutlineOutlinedIcon />
      </IconButton>
      <IconButton color="secondary">
        <PersonAddAlt1OutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Topbar;
