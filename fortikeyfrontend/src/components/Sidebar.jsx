import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, Typography, IconButton } from "@mui/material";
import { tokens } from "../theme";
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import authService from "../services/authservice";

/**
 * Sidebar Navigation Component
 *
 * Provides the main navigation for the application dashboard.
 * Features:
 * - Collapsible sidebar with toggle button
 * - Hierarchical menu structure
 * - Visual indicators for active routes
 * - Role-based menu items (admin vs regular user)
 * - Consistent styling with the application theme
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isAdmin - Whether the current user has admin privileges
 */
const Sidebar = ({ isAdmin }) => {
  const colors = tokens();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarState, setSidebarState] = useState("hidden");
  const [isFortiKeyStaff, setIsFortiKeyStaff] = useState(false);

  // Check if user is FortiKey staff (admin)
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user && user.role === "admin") {
          setIsFortiKeyStaff(true);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, []);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // If transitioning from mobile to desktop, reset sidebar state
      if (!newIsMobile && isMobile) {
        setSidebarState("visible");
        setIsCollapsed(false);
      }

      // If transitioning to mobile, collapse sidebar
      if (newIsMobile && !isMobile) {
        setSidebarState("hidden");
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    if (sidebarState === "hidden") {
      setSidebarState("visible");
      setIsCollapsed(false);
    } else {
      setSidebarState("hidden");
      setIsCollapsed(true);
    }
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/signedout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Menu Item Component
   *
   * Renders a single menu item with consistent styling.
   * Handles active state and navigation.
   *
   * @param {Object} props - Component props
   * @param {string} props.title - Menu item text
   * @param {string} props.to - Route path for navigation
   * @param {JSX.Element} props.icon - Icon component to display
   * @param {string} props.selected - Currently selected menu item
   * @param {Function} props.setSelected - Function to update selected state
   */
  const Item = ({ title, to, icon, selected, setSelected }) => {
    const colors = tokens();

    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.neutral.main,
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary.main} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        height: "100%",
        position: { xs: "relative", md: "fixed" },
        zIndex: 10000,
        width: isCollapsed ? "0px" : "250px",
        transition: "width 0.3s ease",
      }}
    >
      {/* Mobile menu toggle button - only visible on mobile */}
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: "10px",
            left: sidebarState === "visible" ? "210px" : "10px",
            zIndex: 10001,
            backgroundColor: colors.secondary.main,
            color: colors.primary.main,
            "&:hover": {
              backgroundColor: "#0056b3",
            },
            transition: "left 0.3s ease",
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
      )}

      {/* Main sidebar component */}
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: isMobile ? "fixed" : "relative",
          left: isMobile ? (sidebarState === "visible" ? "0" : "-250px") : "0",
          height: "100vh",
          transition: "left 0.3s ease",
        }}
      >
        <Menu iconShape="square">
          {/* Sidebar header with logo and collapse button */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.neutral.main,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.neutral.main}>
                  FortiKey
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User profile section - only shown when sidebar is expanded */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`/assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.neutral.main}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin User
                </Typography>
                <Typography variant="h5" color={colors.text.secondary}>
                  FortiKey Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* Navigation menu items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Dashboard navigation */}
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* API Management section */}
            <Typography
              variant="h6"
              color={colors.text.secondary}
              sx={{ m: "15px 0 5px 20px" }}
            >
              API Management
            </Typography>
            <Item
              title="Manage API Keys"
              to="/manageapikey"
              icon={<ApiOutlinedIcon />}
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

            {/* Data section */}
            <Typography
              variant="h6"
              color={colors.text.secondary}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Usage Analytics"
              to="/usageanalytics"
              icon={<AnalyticsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* User Management section - only visible to admins */}
            {isAdmin && (
              <>
                <Typography
                  variant="h6"
                  color={colors.text.secondary}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  User Management
                </Typography>
                <Item
                  title="View Accounts"
                  to="/viewaccounts"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Admin Dashboard"
                  to="/admindashboard"
                  icon={<AdminPanelSettingsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            <Item
              title="Logout"
              to="#"
              icon={<LogoutOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={handleLogout}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
