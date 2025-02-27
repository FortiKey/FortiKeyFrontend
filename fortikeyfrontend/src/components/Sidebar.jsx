import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../theme";
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarState, setSidebarState] = useState("hidden");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      setSidebarState("hidden");
      setIsCollapsed(true);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    switch (sidebarState) {
      case "hidden":
        setSidebarState("collapsed");
        setIsCollapsed(true);
        break;
      case "collapsed":
        setSidebarState("expanded");
        setIsCollapsed(false);
        break;
      case "expanded":
        setSidebarState("hidden");
        setIsCollapsed(true);
        break;
    }
  };

  // Calculate the left position for the menu button based on sidebar state
  const getMenuButtonPosition = () => {
    switch (sidebarState) {
      case "hidden":
        return "10px";
      case "collapsed":
        return "10px"; // When collapsed, keep at left edge
      case "expanded":
        return "10px"; // When expanded, keep at left edge
      default:
        return "10px";
    }
  };

  return (
    <>
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
            padding: "5px 20px 5px 20px",
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
          "& .pro-sidebar": {
            position: "fixed",
            height: "100vh",
            zIndex: 1000,
            transform:
              sidebarState === "hidden" ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
          },
          "& .pro-sidebar.collapsed": {
            width: isMobile ? "80px !important" : "80px",
          },
          "& .pro-sidebar:not(.collapsed)": {
            width: isMobile ? "250px !important" : "250px",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              icon={
                <MenuOutlinedIcon
                  style={{
                    color: theme.palette.secondary.main,
                    marginLeft: "-5px",
                  }}
                  onClick={toggleSidebar}
                />
              }
              style={{
                margin: "3px",
                color: `${colors.text.primary} !important`,
                marginTop: "10px",
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="1px"
                  onClick={toggleSidebar}
                  style={{ cursor: "pointer" }}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      alt="logo"
                      width="40px"
                      height="40px"
                      src={"../../assets/FortiKeyLogo.png"}
                      style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                    <Typography
                      variant="h4"
                      color={`${colors.neutral.main}`}
                      sx={{ ml: "5px" }}
                    >
                      Dashboard
                    </Typography>
                  </Box>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="15px" mt="10px">
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

      {/* Fixed menu button that appears only when sidebar is hidden */}
      {sidebarState === "hidden" && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            left: "20px",
            top: "25px",
            zIndex: 1001,
            color: theme.palette.secondary.main,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
