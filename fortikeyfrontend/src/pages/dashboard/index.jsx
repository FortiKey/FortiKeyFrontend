import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Divider,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import apiService from "../../services/apiservice";
import { createTextFieldStyles } from "../../components/FormStyles";

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
  const { showInfoToast, showErrorToast, showSuccessToast } = useToast();
  const [chartData, setChartData] = useState({});
  const [chartType] = useState("company");
  const [chartLoading, setChartLoading] = useState(true);

  // State management
  const [isFortiKeyUser, setIsFortiKeyUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(false);

  // New state variables for profile form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // formStyles object - from createuser
  const formStyles = {
    textField: createTextFieldStyles(colors.otherColor.main),
  };

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        setIsFortiKeyUser(user?.role === "admin");

        // Set initial profile form values
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setEmail(user?.email || "");
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsFortiKeyUser(false);
        showErrorToast("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [showErrorToast]);

  useEffect(() => {
    // Fetch data for the pie chart
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        setChartError(false);

        // Fetch company stats for the dashboard overview
        const response = await apiService.getCompanyStats({ period: 30 });

        // Format data for the pie chart
        const formattedData = {
          successfulEvents: response.summary?.successfulEvents || 0,
          failedEvents: response.summary?.failedEvents || 0,
          backupCodesUsed: response.summary?.totalBackupCodesUsed || 0,
        };

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to load chart data:", error);
        setChartError(true);
        showErrorToast("Failed to load overview data");
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [showErrorToast]);

  // Handle chart error
  const handleChartError = () => {
    setChartError(true);
    showErrorToast("Failed to load chart data");
  };

  // New handler for profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await authService.updateProfile({
        firstName,
        lastName,
        email,
      });

      // Update local storage with new user data
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        localStorage.setItem("user", JSON.stringify(user));
      }

      showSuccessToast("Profile updated successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // New handler for password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords don't match");
      return;
    }

    setUpdating(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccessToast("Password changed successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
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
            <PieChart
              chartType={chartType}
              chartData={chartData}
              loading={chartLoading}
              error={chartError}
              onError={handleChartError}
            />
          )}
        </Box>
      </Box>

      {/* Profile Accordion - NEW COMPONENT */}
      <Accordion
        sx={{
          backgroundColor: colors.otherColor.main,
          mb: 5,
          "&.MuiAccordion-root": {
            borderRadius: "4px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            borderRadius: "4px",
            "&.Mui-expanded": {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Typography variant="h5" sx={{ color: colors.text.secondary }}>
            My Profile
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Left column - Personal Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleUpdateProfile}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Grid>

            {/* Right column - Password Change */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleUpdatePassword}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ ...formStyles.textField, mb: 2 }}
                  error={
                    newPassword !== confirmPassword && confirmPassword !== ""
                  }
                  helperText={
                    newPassword !== confirmPassword && confirmPassword !== ""
                      ? "Passwords don't match"
                      : ""
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mb: 5 }} />
    </Box>
  );
};

export default Dashboard;
