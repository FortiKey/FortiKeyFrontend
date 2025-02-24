import { Box } from "@mui/material";
import Header from '../../components/Header'

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="This is the dashboard" />
      </Box>
    </Box>
  );
};

export default Dashboard;
