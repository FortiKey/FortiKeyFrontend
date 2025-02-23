import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.primary.main }}
      onClick={() => {
        setSelected(title);
        if (onClick) {
          onClick();
        }
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        border: `1px solid ${colors.neutral.main}`,
        borderTop: "none",
        "& .pro-sidebar-inner": {
          background: `${colors.primary.main} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-sidebar-item": {
          padding: "10px 20px 20px 20px",
          color: `${colors.text.primary} !important`,
        },
        "& .pro-inner-item": {
          color: `${colors.text.primary} !important`,
        },
        "& .pro-inner-item:hover": {
          color: `${colors.neutral.main} !important`,
        },
        "& .pro-menu-item.active, & .pro-menu-item.active .pro-inner-item": {
          color: `${colors.neutral.main} !important`,
          fontWeight: "bold !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "3px",
              color: `${colors.text.primary} !important`,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="1px"
              >
                <Box display="flex" alignItems="center">
                  <img
                    alt="logo"
                    width="50px"
                    height="50px"
                    src={"../../assets/FortiKeyLogo.png"}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                  <Typography
                    variant="h3"
                    color={`${colors.neutral.main}`}
                    sx={{ ml: "1px" }}
                  >
                    Dashboard
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                textAlign="center"
                border={`2px solid #007BFF`}
                borderRadius={"10px"}
                sx={{
                  width: "fit-content",
                  margin: "0 auto",
                  padding: "5px 15px",
                }}
              >
                <Typography
                  variant="h5"
                  color="#007BFF"
                  sx={{ fontWeight: "500" }}
                >
                  Company Name
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="View Accounts"
              to="/viewaccounts"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usage Analytics"
              to="/usageanalytics"
              icon={<AnalyticsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="API Documentation"
              to="/apidocumentation"
              icon={<MenuBookOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage API Key"
              to="/manageapikey"
              icon={<ApiOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Add User"
              to="/generateqr"
              icon={<PersonAddAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Admin Dashboard"
              to="/admindashboard"
              icon={<SupervisorAccountOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"} marginTop="auto">
            <Item
              title="Sign Out"
              to="/signedout"
              icon={<LogoutOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={() => {
                navigate("/signedout");
              }}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
