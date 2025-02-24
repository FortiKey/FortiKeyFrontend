import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { mockDataTeam } from "../data/mockdata";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens();

  // Calculate totals
  const authorizedCount = mockDataTeam.filter((user) => user.authorized).length;
  const unauthorizedCount = mockDataTeam.filter(
    (user) => !user.authorized
  ).length;
  const totalApiUsage = mockDataTeam.reduce(
    (sum, user) => sum + user.apiKeyUsage,
    0
  );

  // Calculate percentages
  const total = authorizedCount + unauthorizedCount + totalApiUsage;
  const authorizedPercentage = Math.round((authorizedCount / total) * 100);
  const unauthorizedPercentage = Math.round((unauthorizedCount / total) * 100);
  const apiUsagePercentage = Math.round((totalApiUsage / total) * 100);

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
