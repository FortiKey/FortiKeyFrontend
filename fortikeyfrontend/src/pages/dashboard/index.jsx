import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
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
  const { showInfoToast, showErrorToast } = useToast();

  // State management
  const [isFortiKeyUser, setIsFortiKeyUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartError, setChartError] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        setIsFortiKeyUser(user?.role === "admin");
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsFortiKeyUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  // Handle chart error
  const handleChartError = () => {
    setChartError(true);
    showErrorToast("Failed to load chart data");
  };

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

  // Show loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress size={60} color="secondary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        m: "20px",
        bgcolor: colors.primary.main,
      }}
    >
      {/* Display error if present */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
          mb: 5,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: colors.text.secondary }}>
          Key Status Overview
        </Typography>
        <Box height="300px">
          {chartError ? (
            <Alert severity="error">Failed to load chart data</Alert>
          ) : (
            <PieChart onError={handleChartError} />
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 5 }} />
    </Box>
  );
};

export default Dashboard;
