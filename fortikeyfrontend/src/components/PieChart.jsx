import React, { useState, useEffect } from "react";
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
 * Displays a pie chart visualization of user authorization status and API usage.
 * Uses API data to calculate percentages for each category.
 *
 * @returns {JSX.Element} A pie chart visualization
 */
const PieChart = () => {
  const colors = tokens();
  const [chartData, setChartData] = useState({
    authorizedCount: 0,
    unauthorizedCount: 0,
    apiUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getApiUsage();

        // Validate data has expected properties
        if (!data || typeof data !== "object") {
          throw new Error("Invalid data format received from API");
        }

        setChartData({
          authorizedCount: data.authorizedCount || 0,
          unauthorizedCount: data.unauthorizedCount || 0,
          apiUsage: data.apiUsage || 0,
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError("Unable to load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate percentages for the chart using API data
  const total =
    chartData.authorizedCount +
    chartData.unauthorizedCount +
    chartData.apiUsage;
  const authorizedPercentage =
    total > 0 ? Math.round((chartData.authorizedCount / total) * 100) : 0;
  const unauthorizedPercentage =
    total > 0 ? Math.round((chartData.unauthorizedCount / total) * 100) : 0;
  const apiUsagePercentage =
    total > 0 ? Math.round((chartData.apiUsage / total) * 100) : 0;

  // Chart data configuration
  const data = {
    labels: ["Authorized Users", "Unauthorized Users", "API Key Usage"],
    datasets: [
      {
        data: [
          authorizedPercentage,
          unauthorizedPercentage,
          apiUsagePercentage,
        ],
        backgroundColor: [
          colors.pieChart.authorized, // Green for authorized
          colors.pieChart.unauthorized, // Red for unauthorized
          colors.pieChart.apiUsage, // Blue for API usage
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
