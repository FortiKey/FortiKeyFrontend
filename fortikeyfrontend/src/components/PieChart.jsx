import React, { useState, useEffect, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import { tokens } from "../theme";
import apiService from "../services/apiservice";

// Register Chart.js components needed for pie chart
ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * PieChart Component
 *
 * Displays a pie chart visualization with various data types.
 *
 * @param {Object} props - Component props
 * @param {string} [props.timeRange] - Optional time range filter (1d, 7d, 30d, 90d)
 * @param {string} [props.chartType] - Optional chart type ('company', 'devices', 'auth', 'failures')
 * @param {Function} [props.onError] - Optional error callback
 * @returns {JSX.Element} A pie chart visualization
 */
const PieChart = ({ timeRange = null, chartType = "company", onError }) => {
  const colors = tokens();
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use timeRange if provided, otherwise don't filter
        const params = timeRange ? { period: timeRange } : {};

        // Fetch data based on chart type
        switch (chartType) {
          case "devices": {
            const data = await apiService.getDeviceBreakdown(params);
            setChartData({
              mobile: data.deviceBreakdown?.mobile || 0,
              desktop: data.deviceBreakdown?.desktop || 0,
              tablet: data.deviceBreakdown?.tablet || 0,
              other: data.deviceBreakdown?.other || 0,
            });
            break;
          }
          case "auth": {
            const [totpData, backupData] = await Promise.all([
              apiService.getTOTPStats(params),
              apiService.getBackupCodeUsage(params),
            ]);
            setChartData({
              standardTOTP: totpData.summary?.standardAuthentications || 0,
              backupCodes: backupData.summary?.backupCodeUses || 0,
            });
            break;
          }
          case "failures": {
            const data = await apiService.getFailureAnalytics(params);
            setChartData({
              invalidToken: data.breakdownByReason?.invalidToken || 0,
              expiredToken: data.breakdownByReason?.expiredToken || 0,
              rateLimited: data.breakdownByReason?.rateLimited || 0,
              other: data.breakdownByReason?.other || 0,
            });
            break;
          }
          case "company":
          default: {
            // Company stats (default)
            const data = await apiService.getCompanyStats(params);
            setChartData({
              authorizedCount:
                data.authorizedCount ||
                data.authorizedUsers ||
                data.successfulLogins ||
                0,
              unauthorizedCount:
                data.unauthorizedCount ||
                data.unauthorizedUsers ||
                data.failedLogins ||
                0,
              apiUsage:
                data.apiUsage || data.apiCalls || data.totalRequests || 0,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError("Unable to load chart data. Please try again later.");
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, chartType, onError]);

  // Prepare chart data based on the chart type
  const data = useMemo(() => {
    // Create chart data based on chartType
    switch (chartType) {
      case "devices": {
        const values = [
          chartData.mobile || 0,
          chartData.desktop || 0,
          chartData.tablet || 0,
          chartData.other || 0,
        ];
        const total = values.reduce((a, b) => a + b, 0);
        const percentages =
          total > 0
            ? values.map((value) => Math.round((value / total) * 100))
            : [0, 0, 0, 0];

        return {
          labels: ["Mobile", "Desktop", "Tablet", "Other"],
          datasets: [
            {
              data: percentages,
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
                colors.secondary.main,
                colors.text.secondary,
              ],
              borderColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
                colors.secondary.main,
                colors.text.secondary,
              ],
              borderWidth: 1,
            },
          ],
        };
      }
      case "auth": {
        const values = [
          chartData.standardTOTP || 0,
          chartData.backupCodes || 0,
        ];
        const total = values.reduce((a, b) => a + b, 0);
        const percentages =
          total > 0
            ? values.map((value) => Math.round((value / total) * 100))
            : [0, 0];

        return {
          labels: ["Standard TOTP", "Backup Codes"],
          datasets: [
            {
              data: percentages,
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
              ],
              borderColor: [
                colors.pieChart.authorized,
                colors.pieChart.apiUsage,
              ],
              borderWidth: 1,
            },
          ],
        };
      }
      case "failures": {
        const values = [
          chartData.invalidToken || 0,
          chartData.expiredToken || 0,
          chartData.rateLimited || 0,
          chartData.other || 0,
        ];
        const total = values.reduce((a, b) => a + b, 0);
        const percentages =
          total > 0
            ? values.map((value) => Math.round((value / total) * 100))
            : [0, 0, 0, 0];

        return {
          labels: ["Invalid Token", "Expired Token", "Rate Limited", "Other"],
          datasets: [
            {
              data: percentages,
              backgroundColor: [
                colors.pieChart.unauthorized,
                colors.text.secondary,
                colors.secondary.main,
                colors.pieChart.apiUsage,
              ],
              borderColor: [
                colors.pieChart.unauthorized,
                colors.text.secondary,
                colors.secondary.main,
                colors.pieChart.apiUsage,
              ],
              borderWidth: 1,
            },
          ],
        };
      }
      case "company":
      default: {
        // Calculate total and percentages
        const total =
          (chartData.authorizedCount || 0) +
          (chartData.unauthorizedCount || 0) +
          (chartData.apiUsage || 0);

        const authorizedPercentage =
          total > 0
            ? Math.round(((chartData.authorizedCount || 0) / total) * 100)
            : 0;

        const unauthorizedPercentage =
          total > 0
            ? Math.round(((chartData.unauthorizedCount || 0) / total) * 100)
            : 0;

        const apiUsagePercentage =
          total > 0 ? Math.round(((chartData.apiUsage || 0) / total) * 100) : 0;

        return {
          labels: ["Authorized Users", "Unauthorized Users", "API Key Usage"],
          datasets: [
            {
              data: [
                authorizedPercentage,
                unauthorizedPercentage,
                apiUsagePercentage,
              ],
              backgroundColor: [
                colors.pieChart.authorized,
                colors.pieChart.unauthorized,
                colors.pieChart.apiUsage,
              ],
              borderColor: [
                colors.pieChart.authorized,
                colors.pieChart.unauthorized,
                colors.pieChart.apiUsage,
              ],
              borderWidth: 1,
            },
          ],
        };
      }
    }
  }, [chartData, chartType, colors]);

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
        return "Company Analytics";
    }
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
          // Custom tooltip to show percentage values
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Box
        height="300px"
        width="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        height="300px"
        width="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box height="300px" width="300px">
      <Pie data={data} options={options} />
    </Box>
  );
};

export default PieChart;
