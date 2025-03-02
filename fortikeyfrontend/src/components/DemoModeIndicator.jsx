import React from "react";
import { Box, Typography } from "@mui/material";
import config from "../config";

/**
 * Demo Mode Indicator Component
 *
 * Displays a prominent notification banner when the application is running
 * in demo/mock mode without a connected backend.
 *
 * Features:
 * - Conditionally renders only when mock services are enabled
 * - Appears as a sticky banner at the top of the viewport
 * - Uses warning colors to clearly indicate non-production status
 *
 * This component helps users understand when they're interacting with
 * mock data rather than a real backend, preventing confusion during demos
 * or development.
 */
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
