import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PieChart from "../../components/PieChart";
import Header from "../../components/Header";
import apiService from "../../services/apiservice";
import { useToast } from "../../context";
import { tokens } from "../../theme";

/**
 * Usage Analytics Page Component
 *
 * Displays analytics and visualization of API usage data.
 * Features:
 * - Data fetching from backend API
 * - Pie chart showing the distribution of API usage categories
 * - Time period filtering
 * - Loading states and error handling
 * - Data refresh capability
 */
const UsageAnalytics = () => {
  const colors = tokens();
  const { showErrorToast } = useToast();

  // State management
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d"); // Default to 7 days
  const [chartType, setChartType] = useState("business");

  // Fetch analytics data when component mounts or time range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  /**
   * Fetches analytics data from the backend API
   */
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get TOTP stats and failure data for summary statistics
      const [totpData, failureData] = await Promise.all([
        apiService.getTOTPStats({ period: timeRange }),
        apiService.getFailureAnalytics({ period: timeRange }),
      ]);

      // Format for the summary stats section
      setAnalyticsData({
        summaryStats: [
          {
            label: "Total Authentications",
            value: totpData.summary?.totalAuthentications || 0,
          },
          {
            label: "Success Rate",
            value: `${totpData.summary?.successRate || 0}%`,
          },
          {
            label: "Failed Attempts",
            value: failureData.totalFailures || 0,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      setError("Unable to load analytics data. Please try again.");
      showErrorToast("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles time range change
   */
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  /**
   * Manually refreshes the analytics data
   */
  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  return (
    <Box m="20px">
      {/* Page header with title and subtitle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Header
          title="Usage Analytics"
          subtitle="Usage and Authorization Overview"
        />

        {/* Action controls */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="1d">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => setChartType(e.target.value)}
              sx={{ color: colors.text.primary }}
            >
              <MenuItem value="business">Business Analytics</MenuItem>
              <MenuItem value="devices">Device Types</MenuItem>
              <MenuItem value="auth">Authentication Methods</MenuItem>
              <MenuItem value="failures">Failure Reasons</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{ color: colors.secondary.main }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Analytics visualization container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          backgroundColor: colors.otherColor.main,
          borderRadius: "8px",
          p: 3,
        }}
      >
        {loading ? (
          <CircularProgress size={60} />
        ) : analyticsData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "350px" }}>
                <PieChart
                  timeRange={timeRange}
                  chartType={chartType}
                  onError={() => {
                    setError("Failed to load chart data");
                    showErrorToast("Failed to load chart data");
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  height: "100%",
                }}
              >
                {analyticsData.summaryStats.map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: "4px",
                      backgroundColor: colors.primary.main,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography variant="h6" color={colors.text.secondary}>
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      color={colors.secondary.main}
                      fontWeight="bold"
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h5" color={colors.text.secondary}>
            No data available for the selected time period
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UsageAnalytics;
