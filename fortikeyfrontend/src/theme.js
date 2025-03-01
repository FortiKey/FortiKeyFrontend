import { createTheme } from "@mui/material/styles";

/**
 * Custom color tokens for consistent styling across the application
 *
 * This function provides a centralized way to access color values
 * throughout the application. It defines the color palette used for
 * UI elements, charts, and typography.
 *
 * @returns {Object} Color token object with nested color categories
 */
export const tokens = () => ({
  primary: { main: "#ffffff" }, // Primary color (white)
  secondary: { main: "#007BFF" }, // Secondary color (blue)
  otherColor: { main: "#F2F4F8" }, // Background color (light gray)
  neutral: { main: "#21272A" }, // Text color (dark gray/black)
  text: { primary: "#007BFF", secondary: "#555555" }, // Text colors

  // Colors for data visualization
  pieChart: {
    authorized: "#4CAF50", // Green for authorized
    unauthorized: "#F44336", // Red for unauthorized
    apiUsage: "#2196F3", // Blue for API usage
  },
});

/**
 * Theme settings configuration
 *
 * Defines the Material UI theme settings including:
 * - Color palette based on our custom tokens
 * - Typography settings for consistent text styling
 * - Component overrides for custom styling
 */
const themeSettings = {
  palette: {
    ...tokens(),
  },
  typography: {
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 40,
      fontWeight: 600,
    },
    h2: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 32,
      fontWeight: 600,
    },
    h3: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 24,
      fontWeight: 600,
    },
    h4: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 600,
    },
    h5: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
      fontWeight: 600,
    },
    h6: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
    },
    body1: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 400,
    },
  },
};

/**
 * Create and export the theme for use in ThemeProvider
 *
 * This theme object is imported in App.js and passed to ThemeProvider
 * to provide consistent styling throughout the application.
 */
export const theme = createTheme(themeSettings);
