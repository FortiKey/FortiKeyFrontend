import { Box, Button, Grid, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import PieChart from "../../components/PieChart";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import authService from "../../services/authservice";
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
  const [isFortiKeyUser, setIsFortiKeyUser] = useState(false);

  useEffect(() => {
    // Check if the user is from FortiKey
    const checkUserOrganization = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsFortiKeyUser(user && user.organization === "FortiKey");
      } catch (error) {
        console.error("Error checking user organization:", error);
        setIsFortiKeyUser(false);
      }
    };

    checkUserOrganization();
  }, []);

  // Define navigation buttons
  const baseButtons = [
    {
      title: "Manage API Keys",
      path: "/manageapikey",
      icon: <VpnKeyOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.secondary.main,
    },
    {
      title: "View Accounts",
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
      title: "API Documentation",
      path: "/apidocumentation",
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 40 }} />,
      color: colors.pieChart.unauthorized,
    },
  ];

  // Add admin button only for FortiKey users
  const navButtons = isFortiKeyUser
    ? [
        ...baseButtons,
        {
          title: "Admin Dashboard",
          path: "/admindashboard",
          icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 40 }} />,
          color: colors.neutral.main,
        },
      ]
    : baseButtons;

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
          mb: 5, // Add bottom margin to ensure we don't have space for buttons
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: colors.text.secondary }}>
          Key Status Overview
        </Typography>
        <Box height="300px">
          <PieChart />
        </Box>
      </Box>

      {/* Explicitly set bottom margin to prevent any additional content */}
      <Box sx={{ mb: 5 }} />
    </Box>
  );
};

export default Dashboard;
