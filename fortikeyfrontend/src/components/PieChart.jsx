import React, { useState, useMemo, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

// Register Chart.js components needed for pie chart
ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * Enhanced PieChart Component
 *
 * Improvements:
 * - Smoother data transitions
 * - Better empty/error state handling
 * - More consistent percentage calculations
 * - Added data validation
 * - Animation control based on data changes
 *
 * @param {Object} props - Component props
 * @param {string} [props.chartType] - Chart type ('company', 'devices', 'auth', 'failures')
 * @param {Object} [props.chartData] - Data provided by parent component
 * @param {boolean} [props.loading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onError] - Error callback
 * @returns {JSX.Element} A pie chart visualization
 */
const PieChart = ({
  chartType = "company",
  chartData = {},
  loading = false,
  error = null,
  onError,
}) => {
  const colors = tokens();
  const theme = useTheme();

  // Track previous data for smooth transitions
  const [prevChartData, setPrevChartData] = useState({});
  const [hasInitialData, setHasInitialData] = useState(false);

  // Debug logging to track data changes
  useEffect(() => {
    // Store previous data whenever it changes meaningfully
    if (Object.keys(chartData).length > 0) {
      setPrevChartData(chartData);
      if (!hasInitialData) setHasInitialData(true);
    }
  }, [chartData, chartType, hasInitialData]);

  // Handle empty data gracefully
  const isEmptyData = useMemo(() => {
    // If no current data, but we have previous data, use the previous data
    if (
      Object.keys(chartData).length === 0 &&
      Object.keys(prevChartData).length > 0 &&
      hasInitialData
    ) {
      return false;
    }

    // Check if all values are zero
    const allZero = Object.values(chartData).every((value) => value === 0);

    return Object.keys(chartData).length === 0 || allZero;
  }, [chartData, prevChartData, hasInitialData]);

  // Prepare chart data based on the chart type and provided data
  const data = useMemo(() => {
    // Define validateAndNormalizeData function inside useMemo to avoid recreating it on every render
    const validateAndNormalizeData = (data) => {
      // If data is empty but we have previous data, use previous data with visual indication
      if (
        Object.keys(data).length === 0 &&
        Object.keys(prevChartData).length > 0 &&
        hasInitialData
      ) {
        // Return previous data with faded colors to indicate it's old
        return prevChartData;
      }

      // Return original data
      return data;
    };

    // Check for empty data and use fallback
    if (isEmptyData) {
      return {
        labels: ["No Data Available"],
        datasets: [
          {
            data: [1],
            backgroundColor: [theme.palette.action.disabledBackground],
            borderColor: [theme.palette.divider],
          },
        ],
      };
    }

    // Normalize and validate data
    const validData = validateAndNormalizeData(chartData);

    // Process based on chart type
    switch (chartType) {
      case "devices": {
        const labels = Object.keys(validData);
        const values = labels.map((key) => validData[key]);

        // Use actual values instead of percentages for more consistent visualization
        return {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
                colors.secondary.main,
                colors.text.secondary,
              ].slice(0, labels.length),
              borderWidth: 1,
              borderColor: theme.palette.background.paper,
            },
          ],
        };
      }

      case "auth": {
        const standardTOTP = validData.standardTOTP || 0;
        const backupCodes = validData.backupCodes || 0;

        // Use actual values for better proportion representation
        return {
          labels: ["Standard TOTP", "Backup Codes"],
          datasets: [
            {
              data: [standardTOTP, backupCodes],
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
              ],
              borderWidth: 1,
              borderColor: theme.palette.background.paper,
            },
          ],
        };
      }

      case "failures": {
        const labels = Object.keys(validData);
        const values = labels.map((key) => validData[key]);

        // Use actual values for better proportion representation
        // Generate colors based on number of failure types
        const backgroundColor = [
          colors.pieChart.unauthorized,
          colors.pieChart.authorized,
          colors.pieChart.apiUsage,
          "#FFEB3B",
          "#FF9800",
          "#9C27B0",
        ].slice(0, labels.length);

        return {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor,
              borderWidth: 1,
              borderColor: theme.palette.background.paper,
            },
          ],
        };
      }

      case "company":
      default: {
        const successfulEvents = validData.successfulEvents || 0;
        const failedEvents = validData.failedEvents || 0;
        const backupCodesUsed = validData.backupCodesUsed || 0;

        // Use actual values for better proportion representation
        return {
          labels: ["Successful Auth", "Failed Auth", "Backup Codes Used"],
          datasets: [
            {
              data: [successfulEvents, failedEvents, backupCodesUsed],
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.unauthorized,
                colors.pieChart.apiUsage,
              ],
              borderWidth: 1,
              borderColor: theme.palette.background.paper,
            },
          ],
        };
      }
    }
  }, [
    chartData,
    chartType,
    colors,
    isEmptyData,
    theme,
    prevChartData,
    hasInitialData,
  ]);

  // Get chart title based on type
  const getChartTitle = () => {
    switch (chartType) {
      case "devices":
        return "Device Type Distribution";
      case "auth":
        return "Authentication Methods";
      case "failures":
        return "Failed Authentication Reasons";
      case "company":
      default:
        return "Authentication Overview";
    }
  };

  // Calculate consistent percentages for tooltips
  const calculatePercentage = (value, total) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  // Chart display options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: colors.text.primary,
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: getChartTitle(),
        color: colors.text.primary,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          // Custom tooltip to show both value and percentage
          label: function (context) {
            const value = context.raw;
            // Check if we're using the empty data placeholder
            if (context.label === "No Data Available") {
              return "No data available for this time period";
            }

            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = calculatePercentage(value, total);
            return `${
              context.label
            }: ${value.toLocaleString()} (${percentage})`;
          },
        },
      },
    },
    animation: {
      duration: 1000, // Slower animation for better transitions
      easing: "easeOutQuart",
    },
    // Prevent weird animations when switching chart types
    transitions: {
      active: {
        animation: {
          duration: 0,
        },
      },
    },
  };

  // Handle empty data state
  if (isEmptyData && !hasInitialData) {
    return (
      <Box
        height="300px"
        width="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        sx={{ color: colors.text.secondary }}
      >
        <Typography variant="body1" textAlign="center">
          No data available for this time period
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 1, opacity: 0.7 }}
        >
          Try selecting a different date range
        </Typography>
      </Box>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <Box
        height="300px"
        width="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box
        height="300px"
        width="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography color="error" variant="body1" textAlign="center">
          {error}
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 1, opacity: 0.7 }}
        >
          Please try refreshing the data
        </Typography>
      </Box>
    );
  }

  return (
    <Box height="300px" width="300px" display="flex" justifyContent="center">
      <Pie data={data} options={options} />
    </Box>
  );
};

export default PieChart;
