import { useState, useEffect, useCallback, useRef } from "react";
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
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PieChart from "../../components/PieChart";
import Header from "../../components/Header";
import apiService from "../../services/apiservice";
import { useToast } from "../../context";
import { tokens } from "../../theme";
// Import enhanced utility functions
import {
  processTOTPStats,
  processFailureAnalytics,
  processDeviceBreakdown,
  formatValue,
} from "../../utils/analyticsUtils";
import {
  createTextFieldStyles,
  simpleButtonStyles,
  selectStyles,
} from "../../components/FormStyles";

const UsageAnalytics = () => {
  const colors = tokens();
  const { showErrorToast, showSuccessToast } = useToast();

  // State management
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30"); // Default to 30 days
  const [chartType, setChartType] = useState("company");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // State for chart data - passed to PieChart
  const [chartData, setChartData] = useState({});

  // Use ref to prevent duplicate API calls on mount
  const initialLoadComplete = useRef(false);

  // Keep track of previous data for consistency across refreshes
  const prevDataRef = useRef({});

  // Add consistent form styling constants (similar to login page)
  const formStyles = {
    textField: createTextFieldStyles(),
    button: simpleButtonStyles,
    select: selectStyles,
  };

  // Convert timeRange for API calls
  const getTimeRangeValue = () => {
    return parseInt(timeRange, 10);
  };

  // Enhanced fetch data function with explicit period parameter
  const fetchDataWithPeriod = async (explicitPeriod, force = false) => {
    try {
      setLoading(true);
      if (force) setRefreshing(true);
      setError(null);

      // Use the explicit period rather than the state value
      const periodToUse = explicitPeriod || getTimeRangeValue();

      // Load summary data with explicit period
      let totpResponse = { summary: {} };
      let failureResponse = {};
      let deviceResponse = {};

      try {
        totpResponse = await apiService.getTOTPStats({ period: periodToUse }, force);
      } catch (err) {
        // Handle error
      }

      try {
        failureResponse = await apiService.getFailureAnalytics({ period: periodToUse }, force);
      } catch (err) {
        // Handle error
      }

      try {
        deviceResponse = await apiService.getDeviceBreakdown({ period: periodToUse }, force);
      } catch (err) {
        // Handle error
      }

      // Process the data
      const totpData = processTOTPStats(totpResponse);
      const failureData = processFailureAnalytics(failureResponse);
      const deviceData = processDeviceBreakdown(deviceResponse);

      // Set the analytics data
      setAnalyticsData({
        summaryStats: [
          {
            label: "Total Authentications",
            value: formatValue(totpData.summary.totalValidations),
          },
          {
            label: "Success Rate",
            value: formatValue(
              totpData.summary.validationSuccessRate,
              "percentage"
            ),
          },
          {
            label: "Failed Attempts",
            value: formatValue(failureData.totalFailures),
          },
          {
            label: "Backup Codes Used",
            value: formatValue(totpData.summary.totalBackupCodesUsed),
          },
        ],
        deviceTypes: deviceData.deviceTypes || {},
        browsers: deviceData.browsers || {},
        totpStats: totpData.dailyStats || [],
        // Store raw data for comparison
        rawData: {
          totp: totpResponse,
          failures: failureResponse,
          devices: deviceResponse,
        },
      });

      // Load chart data based on currently selected type
      await loadChartDataWithPeriod(chartType, periodToUse, force);

      // Record last refresh time
      setLastRefreshTime(new Date());

      if (force) {
        showSuccessToast("Analytics data refreshed successfully");
      }
    } catch (error) {
      setError(
        "Unable to load analytics data. " +
          (error.message || "Please try again later.")
      );
      showErrorToast("Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDefaultChartData = (type) => {
    switch (type) {
      case "devices":
        return { "Desktop": 0, "Mobile": 0, "Tablet": 0 };
      case "auth":
        return { "standardTOTP": 0, "backupCodes": 0 };
      case "failures":
        return { "authFailure": 0 };
      case "company":
      default:
        return {
          successfulEvents: 0,
          failedEvents: 0,
          backupCodesUsed: 0
        };
    }
  };

  // Enhanced load chart data function with explicit period parameter
  const loadChartDataWithPeriod = async (
    type,
    explicitPeriod,
    force = false
  ) => {
    try {
      setRefreshing(true);
      let data = {};

      // Use the explicit period rather than the state value
      const periodToUse = explicitPeriod || getTimeRangeValue();

      switch (type) {
        case "devices": {
          try {
            const response = await apiService.getDeviceBreakdown(
              { period: periodToUse },
              force
            );
            const processedData = processDeviceBreakdown(response);
            data = processedData.deviceTypes || {};
          } catch (error) {
            // Fallback to previous data if available
            if (prevDataRef.current.devices) {
              data = prevDataRef.current.devices;
            }
          }
          break;
        }
        case "auth": {
          try {
            const [totpResponse, backupResponse] = await Promise.all([
              apiService.getTOTPStats({ period: periodToUse }, force),
              apiService.getBackupCodeUsage({ period: periodToUse }, force),
            ]);


            const processedTOTP = processTOTPStats(totpResponse);


            // Try different properties to find the backup count
            let backupCount = 0;
            if (backupResponse.backupCount) {
              backupCount = backupResponse.backupCount;
            } else if (
              backupResponse.summary &&
              backupResponse.summary.backupCodeUses
            ) {
              backupCount = backupResponse.summary.backupCodeUses;
            } else if (
              backupResponse.summary &&
              backupResponse.summary.backupCount
            ) {
              backupCount = backupResponse.summary.backupCount;
            } else if (
              processedTOTP.summary &&
              processedTOTP.summary.totalBackupCodesUsed
            ) {
              // If it's not in the backup response, get it from the TOTP summary
              backupCount = processedTOTP.summary.totalBackupCodesUsed;
            }


            const validations = processedTOTP.summary.totalValidations || 0;


            // Make sure standard TOTP doesn't go negative if backupCount > validations
            const standardTOTP = Math.max(0, validations - backupCount);


            data = {
              standardTOTP: standardTOTP,
              backupCodes: backupCount,
            };
          } catch (error) {
            // error handling
          }
          break;
        }
        case "failures": {
          try {
            const response = await apiService.getFailureAnalytics(
              { period: periodToUse },
              force
            );
            const processedData = processFailureAnalytics(response);


            // Convert failures array to counts by type
            const failureCounts = {};


            // Check the structure of failuresByType directly from the response
            if (
              response.failuresByType &&
              Array.isArray(response.failuresByType)
            ) {
              response.failuresByType.forEach((item) => {
                // Extract the key from _id.eventType and the count value
                if (item._id && item._id.eventType) {
                  const eventType = item._id.eventType;


                  // Check if count is a number or an object
                  let countValue = 0;
                  if (typeof item.count === "number") {
                    countValue = item.count;
                  } else if (item.count && typeof item.count === "object") {
                    // If count is an object, it might have a value property
                    countValue =
                      item.count.value || Object.values(item.count)[0] || 0;
                  }


                  failureCounts[eventType] = countValue;
                }
              });
            } else {
              failureCounts["Unknown"] = processedData.totalFailures || 0;
            }


            // If we still have no data, try using the failures array from processedData
            if (
              Object.keys(failureCounts).length === 0 &&
              Array.isArray(processedData.failures)
            ) {
              processedData.failures.forEach((failure, index) => {
                let key = "Unknown";
                if (failure._id && failure._id.eventType) {
                  key = failure._id.eventType;
                }


                let value = 0;
                if (typeof failure.count === "number") {
                  value = failure.count;
                } else if (failure.count && typeof failure.count === "object") {
                  value =
                    failure.count.value || Object.values(failure.count)[0] || 0;
                }


                failureCounts[key] = value;
              });
            }


            data = failureCounts;
          } catch (error) {
            if (prevDataRef.current.failures) {
              data = prevDataRef.current.failures;
            } else {
              // Default data if no fallback available
              data = { "No Data": 1 };
            }
          }
          break;
        }
        case "company":
        default: {
          try {
            const response = await apiService.getCompanyStats(
              { period: periodToUse },
              force
            );

            data = {
              successfulEvents: response.summary?.successfulEvents || 0,
              failedEvents: response.summary?.failedEvents || 0,
              backupCodesUsed: response.summary?.totalBackupCodesUsed || 0,
            };
          } catch (error) {
            if (prevDataRef.current.company) {
              data = prevDataRef.current.company;
            }
          }
        }
      }

      // Store data for fallback
      prevDataRef.current[type] = data;

      // Update chart data
      setChartData(data);
    } catch (error) {
      // Error handling
    } finally {
      setRefreshing(false);
    }
  };

  // Regular fetchData function that uses the current state
  const fetchData = useCallback(
    async (force = false) => {
      await fetchDataWithPeriod(getTimeRangeValue(), force);
    },
    [timeRange, chartType, showErrorToast, showSuccessToast]
  );

  // Regular loadChartData function that uses the current state
  const loadChartData = useCallback(
    async (type, force = false) => {
      await loadChartDataWithPeriod(type, getTimeRangeValue(), force);
    },
    [timeRange]
  );

  // Initial data fetch - only on first render
  useEffect(() => {
    // Only load data once on mount
    if (!initialLoadComplete.current) {
      fetchData();
      initialLoadComplete.current = true;
    }
  }, [fetchData]);

  // Modified time range change handler
  const handleTimeRangeChange = (event) => {
    const newTimeRange = event.target.value;

    // Update state
    setTimeRange(newTimeRange);

    // Use the new value directly instead of relying on the state
    const newPeriod = parseInt(newTimeRange, 10);

    // Use the explicit period functions
    fetchDataWithPeriod(newPeriod, true);
  };

  // Handle chart type change
  const handleChartTypeChange = (event) => {
    const newType = event.target.value;
    setChartType(newType);
    loadChartData(newType);
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchData(true);
  };

  // Format the last refresh time
  const formatLastRefreshTime = () => {
    if (!lastRefreshTime) return "Never";

    return lastRefreshTime.toLocaleTimeString();
  };

  return (
    <Box m="20px">
      {/* Page header with title and subtitle */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Header
          title="Usage Analytics"
          subtitle="Usage and Authorization Overview"
        />

        {/* Action controls */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            width: { xs: "100%", md: "auto" },
            mt: { xs: 1, md: 0 },
          }}
        >
          <FormControl size="small" sx={formStyles.textField}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
              disabled={loading || refreshing}
            >
              <MenuItem value="1">Last 24 Hours</MenuItem>
              <MenuItem value="7">Last 7 Days</MenuItem>
              <MenuItem value="30">Last 30 Days</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={formStyles.textField}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={handleChartTypeChange}
              sx={{ color: colors.text.primary }}
              disabled={loading || refreshing}
            >
              <MenuItem value="company">Company Analytics</MenuItem>
              <MenuItem value="devices">Device Types</MenuItem>
              <MenuItem value="auth">Authentication Methods</MenuItem>
              <MenuItem value="failures">Failure Reasons</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading || refreshing}
              sx={{ color: colors.secondary.main }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Last refresh time indicator */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "right",
          mb: 1,
          color: colors.text.secondary,
        }}
      >
        Last updated: {formatLastRefreshTime()}
      </Typography>

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
        {loading && !analyticsData ? (
          <CircularProgress size={60} />
        ) : analyticsData ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "350px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* Pass data to PieChart instead of having it fetch data */}
                <PieChart
                  chartType={chartType}
                  chartData={chartData}
                  loading={refreshing}
                  error={error}
                  onError={(err) => {
                    setError(
                      "Failed to load chart data. " +
                        (err.message || "Please try again later.")
                    );
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
                  <Paper
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
                  </Paper>
                ))}
              </Box>
            </Grid>

            {/* Device Usage Breakdown */}
            {analyticsData.deviceTypes &&
              Object.keys(analyticsData.deviceTypes).length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h4"
                    color={colors.text.primary}
                    sx={{ mb: 2 }}
                  >
                    Device Usage Breakdown
                  </Typography>

                  <Grid container spacing={2}>
                    {Object.entries(analyticsData.deviceTypes)
                      .filter(([_, count]) => count > 0) // Only show non-zero entries
                      .sort(([keyA, countA], [keyB, countB]) => countB - countA) // Sort by count descending
                      .map(([deviceType, count]) => (
                        <Grid item xs={12} sm={4} key={deviceType}>
                          <Paper
                            sx={{ p: 2, backgroundColor: colors.primary.main }}
                          >
                            <Typography
                              variant="h6"
                              color={colors.text.secondary}
                            >
                              {deviceType}
                            </Typography>
                            <Typography
                              variant="h4"
                              color={colors.secondary.main}
                            >
                              {formatValue(count)}
                            </Typography>
                            {/* Add percentage */}
                            <Typography
                              variant="body2"
                              color={colors.text.secondary}
                            >
                              {calculatePercentage(
                                count,
                                Object.values(analyticsData.deviceTypes).reduce(
                                  (a, b) => a + b,
                                  0
                                )
                              )}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}

            {/* Browser Usage Breakdown */}
            {analyticsData.browsers &&
              Object.keys(analyticsData.browsers).length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h4"
                    color={colors.text.primary}
                    sx={{ mb: 2 }}
                  >
                    Browser Usage
                  </Typography>

                  <Grid container spacing={2}>
                    {Object.entries(analyticsData.browsers)
                      .filter(([_, count]) => count > 0) // Only show non-zero entries
                      .sort(([_1, countA], [_2, countB]) => countB - countA) // Sort by count descending
                      .map(([browser, count]) => (
                        <Grid item xs={12} sm={4} key={browser}>
                          <Paper
                            sx={{ p: 2, backgroundColor: colors.primary.main }}
                          >
                            <Typography
                              variant="h6"
                              color={colors.text.secondary}
                            >
                              {browser}
                            </Typography>
                            <Typography
                              variant="h4"
                              color={colors.secondary.main}
                            >
                              {formatValue(count)}
                            </Typography>
                            {/* Add percentage */}
                            <Typography
                              variant="body2"
                              color={colors.text.secondary}
                            >
                              {calculatePercentage(
                                count,
                                Object.values(analyticsData.browsers).reduce(
                                  (a, b) => a + b,
                                  0
                                )
                              )}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              )}
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

// Helper function to calculate percentage
const calculatePercentage = (value, total) => {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

export default UsageAnalytics;
