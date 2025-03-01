import { createTheme } from "@mui/material/styles";

// Simplified tokens function that doesn't need a mode parameter
export const tokens = () => ({
  primary: { main: "#ffffff" }, // Primary color
  secondary: { main: "#007BFF" }, // Secondary color
  otherColor: { main: "#F2F4F8" }, // Other color
  neutral: { main: "#21272A" }, // Neutral color
  text: { primary: "#007BFF", secondary: "#555555" }, // Text colors

  // Add pie chart color scheme
  pieChart: {
    authorized: "#4CAF50", // Green for authorized
    unauthorized: "#FF5252", // Red for unauthorized
    apiUsage: "#2196F3", // Blue for API usage
  },
});

// Theme settings using the tokens
const themeSettings = {
  palette: {
    ...tokens(),
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 40,
      fontWeight: 700,
    },
    h2: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 32,
      fontWeight: 600,
    },
    h3: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 24,
      fontWeight: 500,
    },
    h4: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 500,
    },
    h5: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 16,
      fontWeight: 400,
    },
    h6: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 400,
    },
  },
};

export const theme = createTheme(themeSettings);
