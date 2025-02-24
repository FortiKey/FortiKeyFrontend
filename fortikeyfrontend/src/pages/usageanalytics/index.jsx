import { Box } from "@mui/material";
import PieChart from "../../components/PieChart";
import Header from "../../components/Header";
import { theme } from "../../theme";

const UsageAnalytics = () => {
  return (
    <Box m="20px">
      <Header title="Usage Analytics" subtitle="Usage and Authorization Overview" />
      <Box display="flex" justifyContent="space-between">
        <PieChart />
      </Box>
    </Box>
  );
};

export default UsageAnalytics;
