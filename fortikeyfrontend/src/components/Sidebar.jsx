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
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import authService from "../services/authservice";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Access the sidebar's collapsed state
  useEffect(() => {
    const sidebar = document.querySelector(".pro-sidebar");
    if (sidebar) {
      setIsCollapsed(sidebar.classList.contains("collapsed"));
    }

    // Observer to detect when collapsed class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsCollapsed(sidebar.classList.contains("collapsed"));
        }
      });
    });

    if (sidebar) {
      observer.observe(sidebar, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

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
      {!isCollapsed && <Typography>{title}</Typography>}
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
  const [isFortiKeyUser, setIsFortiKeyUser] = useState(false);
  const [companyName, setCompanyName] = useState("Company Name");

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

  useEffect(() => {
    // Check if the user is from FortiKey
    const checkUserOrganization = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsFortiKeyUser(user && user.organization === "FortiKey");
        setCompanyName(
          user && user.organization ? user.organization : "Company Name"
        );
      } catch (error) {
        console.error("Error checking user organization:", error);
        setIsFortiKeyUser(false);
      }
    };

    checkUserOrganization();
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
      default:
        // Default case to handle any unexpected state
        setSidebarState("hidden");
        setIsCollapsed(true);
        break;
    }
  };

  // Default menu items - always shown in the correct order
  const menuItems = [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: <HomeOutlinedIcon />,
    },
    {
      title: "View Accounts",
      to: "/viewaccounts",
      icon: <PeopleOutlinedIcon />,
    },
    {
      title: "Usage Analytics",
      to: "/usageanalytics",
      icon: <AnalyticsOutlinedIcon />,
    },
    {
      title: "API Documentation",
      to: "/apidocumentation",
      icon: <MenuBookOutlinedIcon />,
    },
    {
      title: "Manage API Keys",
      to: "/manageapikey",
      icon: <ApiOutlinedIcon />,
    },
  ];

  // Add Admin Dashboard item only for FortiKey users
  if (isFortiKeyUser) {
    menuItems.push({
      title: "Admin",
      to: "/admindashboard",
      icon: <SupervisorAccountOutlinedIcon />,
    });
  }

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
          "& .pro-inner-item": {
            color: `${colors.text.primary} !important`,
            padding: "5px 15px !important",
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
            {!isCollapsed && (
              <Box mt="0px" mb="10px">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb="5px"
                  height="52px"
                >
                  <img
                    alt="logo"
                    width="40px"
                    height="40px"
                    src={"../../assets/FortiKeyLogo.png"}
                    style={{ borderRadius: "50%" }}
                  />
                  <Typography
                    variant="h4"
                    color={colors.neutral.main}
                    sx={{ ml: "10px" }}
                  >
                    Dashboard
                  </Typography>
                </Box>

                <Box
                  textAlign="center"
                  border={`2px solid #007BFF`}
                  borderRadius={"10px"}
                  sx={{
                    width: "fit-content",
                    margin: "5px auto",
                    padding: "3px 15px",
                  }}
                >
                  <Typography
                    variant="h5"
                    color="#007BFF"
                    sx={{ fontWeight: "500" }}
                  >
                    {companyName}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              paddingLeft={isCollapsed ? undefined : "10%"}
              paddingTop={isCollapsed ? "52px" : "0px"}
            >
              {menuItems.map((item) => (
                <Item
                  key={item.title}
                  title={item.title}
                  to={item.to}
                  icon={item.icon}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
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

      {/* Position the burger menu button inside the purple area and above the home button */}
      <IconButton
        sx={{
          position: "fixed",
          top: "50px", // Keep vertical position inside purple area
          left: "15px", // Adjusted left to align with home button below
          zIndex: 1001,
          color: colors.secondary.main,
          backgroundColor: "transparent",
          padding: "8px",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
        }}
        onClick={toggleSidebar}
      >
        <MenuOutlinedIcon />
      </IconButton>
    </>
  );
};

export default Sidebar;
