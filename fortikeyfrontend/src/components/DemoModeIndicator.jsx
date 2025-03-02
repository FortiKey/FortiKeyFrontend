import React from "react";
import { Box, Typography } from "@mui/material";
import config from "../config";

const DemoModeIndicator = () => {
  // Only show in demo mode
  if (!config.features.useMockServices) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: "8px",
        bgcolor: "#ff9800",
        color: "white",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 9999,
        width: "100%",
      }}
    >
      <Typography variant="body2" fontWeight="medium">
        Demo Mode - Using mock data (Backend not connected)
      </Typography>
    </Box>
  );
};

export default DemoModeIndicator;
