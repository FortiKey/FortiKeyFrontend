/**
 * Application Configuration
 *
 * Centralizes configuration settings for the application.
 * Uses environment variables with fallbacks for local development.
 * Provides consistent access to configuration values throughout the app.
 */

const config = {
  /**
   * API base URL
   * Uses environment variable in production or falls back to localhost for development
   */
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1",

  /**
   * Application name
   * Used for document titles, headers, etc.
   */
  appName: "FortiKey API Management",

  /**
   * Default pagination settings
   * Used for tables and lists throughout the application
   */
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },

  /**
   * Authentication settings
   * Token expiration time, storage keys, etc.
   */
  auth: {
    tokenStorageKey: "token",
    userStorageKey: "user",
    refreshTokenStorageKey: "refreshToken",
  },

  /**
   * Feature flags
   * Enable/disable features based on environment or deployment
   */
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true" || false,
    enableNotifications:
      process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true" || true,
    debugMode: process.env.NODE_ENV === "development",
    useMockServices: false,
  },

  /**
   * API request timeout in milliseconds
   */
  apiTimeout: 30000, // 30 seconds
};

export default config;
