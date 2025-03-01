import axios from "axios";

// API base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Authentication Service
 *
 * Provides methods for user authentication, registration, and session management.
 * Handles API communication for auth-related operations.
 * Manages JWT tokens for secure API access.
 *
 * This service is the central point for all authentication-related functionality
 * and maintains the user's authentication state across the application.
 */
const authService = {
  /**
   * Register a new user
   *
   * Creates a new user account with the provided information.
   * Does not automatically log in the user after registration.
   *
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.lastName - User's last name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} userData.company - User's company or organization
   * @returns {Promise<Object>} The created user object
   * @throws {Error} If registration fails (email already exists, invalid data, etc.)
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Log in a user
   *
   * Authenticates a user with their credentials and stores the JWT token.
   * Sets up the user session by storing token and user data in localStorage.
   *
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} User data and token
   * @throws {Error} If authentication fails (invalid credentials, account locked, etc.)
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      // Store token in localStorage for subsequent API calls
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Log out the current user
   *
   * Ends the user session by removing authentication data from localStorage.
   * Does not make an API call as token invalidation happens server-side.
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get the current authenticated user
   *
   * Retrieves the current user's profile information from the API
   * using the stored authentication token.
   *
   * @returns {Promise<Object|null>} Current user data or null if not authenticated
   * @throws {Error} If the API request fails for reasons other than authentication
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");

      // If no token, user is not authenticated
      if (!token) {
        return null;
      }

      // Get user data from API with token
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      // If token is invalid or expired, clear localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return null;
    }
  },

  /**
   * Check if the current user is authenticated
   *
   * A lightweight method to check if a user is logged in
   * without making an API call. Note that this doesn't validate
   * if the token is still valid on the server.
   *
   * @returns {boolean} True if user is authenticated (has a token)
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Get the authentication token
   *
   * Retrieves the JWT token from localStorage.
   * Useful for making authenticated API requests from other services.
   *
   * @returns {string|null} JWT token or null if not authenticated
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Update user profile information
   *
   * Updates the authenticated user's profile with new information.
   * Requires authentication and updates the stored user data on success.
   *
   * @param {Object} userData - Updated user data
   * @param {string} [userData.firstName] - User's first name
   * @param {string} [userData.lastName] - User's last name
   * @param {string} [userData.email] - User's email address
   * @param {string} [userData.company] - User's company or organization
   * @returns {Promise<Object>} Updated user object
   * @throws {Error} If update fails or user is not authenticated
   */
  updateProfile: async (userData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update stored user data
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Change user password
   *
   * Updates the authenticated user's password.
   * Requires authentication and verification of current password.
   *
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   * @throws {Error} If password change fails (wrong current password, invalid new password, etc.)
   */
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/users/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
