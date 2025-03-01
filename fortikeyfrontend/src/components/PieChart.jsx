import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { mockDataTeam } from "../data/mockdata";
import { Box } from "@mui/material";
import { tokens } from "../theme";

// Register Chart.js components needed for pie chart
ChartJS.register(ArcElement, Tooltip, Legend, Title);

/**
 * PieChart Component
 *
 * Displays a pie chart visualization of user authorization status and API usage.
 * Uses mock data to calculate percentages for each category.
 *
 * @returns {JSX.Element} A pie chart visualization
 */
const PieChart = () => {
  const colors = tokens();

  // Calculate totals from mock data
  const authorizedCount = mockDataTeam.filter((user) => user.authorized).length;
  const unauthorizedCount = mockDataTeam.filter(
    (user) => !user.authorized
  ).length;
  const totalApiUsage = mockDataTeam.reduce(
    (sum, user) => sum + user.apiKeyUsage,
    0
  );

  // Calculate percentages for the chart
  const total = authorizedCount + unauthorizedCount + totalApiUsage;
  const authorizedPercentage = Math.round((authorizedCount / total) * 100);
  const unauthorizedPercentage = Math.round((unauthorizedCount / total) * 100);
  const apiUsagePercentage = Math.round((totalApiUsage / total) * 100);

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

  return (
    <Box height="300px" width="300px">
      <Pie data={data} options={options} />
    </Box>
  );
};

export default PieChart;
