/**
 * Application configuration
 * Centralizes access to environment variables
 */
const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1",

  // Authentication
  tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY || "86400000", 10),

  // Feature Flags
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true",

  // Application Info
  version: process.env.REACT_APP_VERSION || "1.0.0",

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};

export default config;
