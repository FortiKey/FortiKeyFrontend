import { Box, Button, Grid, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import PieChart from "../../components/PieChart";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useToast } from "../../context";

/**
 * Dashboard Component
 *
 * Main landing page after user login. Provides navigation to all major
 * application features and displays a summary of key metrics.
 *
 * Features:
 * - Navigation grid with icons for all main application sections
 * - Key status overview with pie chart visualization
 * - Quick access buttons for frequently used features
 * - Toast notifications for navigation feedback
 *
 * This component serves as the central hub of the application,
 * providing users with an overview of their API key status and
 * easy access to all functionality.
 */
const Dashboard = () => {
  const colors = tokens();
  const navigate = useNavigate();
  const { showInfoToast } = useToast();

  /**
   * Navigation buttons configuration
   * Defines the properties for each navigation button including
   * title, path, icon, and color styling
   */
  const navButtons = [
    {
      title: "Manage API Keys",
      path: "/manageapikey",
      icon: <VpnKeyOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.secondary.main,
    },
    {
      title: "User Accounts",
      path: "/viewaccounts",
      icon: <AccountCircleOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.pieChart.authorized,
    },
    {
      title: "Usage Analytics",
      path: "/usageanalytics",
      icon: <BarChartOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.pieChart.apiUsage,
    },
    {
      title: "Admin Dashboard",
      path: "/admindashboard",
      icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.neutral.main,
    },
    {
      title: "API Documentation",
      path: "/apidocumentation",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.pieChart.unauthorized,
    },
  ];

  /**
   * Navigate to API Key Management page
   * Shows a toast notification during navigation
   */
  const navigateToManageKeys = () => {
    showInfoToast("Navigating to API Key Management");
    navigate("/manageapikey");
  };

  /**
   * Navigate to API Documentation page
   * Shows a toast notification during navigation
   */
  const navigateToDocumentation = () => {
    showInfoToast("Opening API Documentation");
    navigate("/apidocumentation");
  };

  /**
   * Navigate to Usage Analytics page
   * Shows a toast notification during navigation
   */
  const navigateToAnalytics = () => {
    showInfoToast("Viewing usage analytics");
    navigate("/usageanalytics");
  };

  return (
    <Box
      sx={{
        m: "20px",
        bgcolor: colors.primary.main,
      }}
    >
      {/* Header section with title and subtitle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Header
          title="Dashboard"
          subtitle="Welcome to FortiKey Management System"
        />
      </Box>

      {/* Navigation Buttons Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {navButtons.map((button) => (
          <Grid item xs={12} sm={6} md={4} key={button.path}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.secondary.main,
                borderColor: colors.secondary.main,
                fontSize: "1rem",
                padding: "15px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px",
                textTransform: "uppercase",
                fontWeight: "bold",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(0, 123, 255, 0.04)",
                  borderColor: colors.secondary.main,
                },
              }}
              onClick={() => {
                showInfoToast(`Navigating to ${button.title}`);
                navigate(button.path);
              }}
            >
              {button.title}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart Section - Key Status Overview */}
      <Box
        sx={{
          backgroundColor: colors.otherColor.main,
          p: 3,
          borderRadius: "4px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: colors.text.secondary }}>
          Key Status Overview
        </Typography>
        <Box height="300px">
          <PieChart />
        </Box>
      </Box>

      {/* Quick Access Buttons */}
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={navigateToManageKeys}
            >
              Manage API Keys
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={navigateToDocumentation}
            >
              API Documentation
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={navigateToAnalytics}
            >
              Usage Analytics
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
