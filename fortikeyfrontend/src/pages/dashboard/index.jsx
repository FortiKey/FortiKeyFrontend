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

const Dashboard = () => {
  const colors = tokens(); // Call tokens() as a function to get color values
  const navigate = useNavigate();

  // Navigation buttons configuration
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

  return (
    <Box
      sx={{
        m: "20px",
        bgcolor: colors.primary.main,
      }}
    >
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

      {/* Navigation Buttons */}
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
              onClick={() => navigate(button.path)}
            >
              {button.title}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart Section */}
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
    </Box>
  );
};

export default Dashboard;
