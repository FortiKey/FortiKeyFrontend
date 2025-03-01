import { Box } from "@mui/material";
import PieChart from "../../components/PieChart";
import Header from "../../components/Header";

/**
 * Usage Analytics Page Component
 *
 * Displays analytics and visualization of API usage data.
 * Features:
 * - Pie chart showing the distribution of API usage categories
 * - Clear visualization of authorized vs unauthorized access attempts
 * - Overview of API key usage patterns
 * - Responsive layout that adapts to different screen sizes
 *
 * This component helps users understand their API usage patterns
 * and monitor authorization status across their account, providing
 * valuable insights for security monitoring and capacity planning.
 */
const UsageAnalytics = () => {
  return (
    <Box m="20px">
      {/* Page header with title and subtitle */}
      <Header
        title="Usage Analytics"
        subtitle="Usage and Authorization Overview"
      />

      {/* Analytics visualization container */}
      <Box display="flex" justifyContent="space-between">
        {/* 
          PieChart component displays the usage distribution
          showing authorized users, unauthorized attempts, and API key usage
        */}
        <PieChart />
      </Box>
    </Box>
  );
};

export default UsageAnalytics;
