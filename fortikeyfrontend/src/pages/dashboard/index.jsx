import { Box } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Dashboard = () => {
  const colors = tokens(); // Call tokens() as a function to get color values

  return (
    <Box
      sx={{
        m: "20px",
        bgcolor: colors.primary.main,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header title="Dashboard" subtitle="This is the dashboard" />
      </Box>
    </Box>
  );
};

export default Dashboard;
