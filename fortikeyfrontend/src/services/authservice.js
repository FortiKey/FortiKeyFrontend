import axios from "axios";
import config from "../config";

// API base URL from environment variables and config
const API_URL = config.apiUrl;

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
      const response = await axios.post(`${API_URL}/auth/register`, userData);
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
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem(config.auth.tokenStorageKey, response.data.token);
        localStorage.setItem(
          config.auth.userStorageKey,
          JSON.stringify(response.data.user)
        );
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
    localStorage.removeItem(config.auth.tokenStorageKey);
    localStorage.removeItem(config.auth.userStorageKey);
    localStorage.removeItem(config.auth.refreshTokenStorageKey);
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
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.logout();
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
    return !!localStorage.getItem(config.auth.tokenStorageKey);
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
    return localStorage.getItem(config.auth.tokenStorageKey);
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
      const token = localStorage.getItem(config.auth.tokenStorageKey);

      const response = await axios.post(
        `${API_URL}/auth/change-password`,
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

  /**
   * Request password reset
   *
   * Sends a request to initiate the password reset process for a user.
   * An email with reset instructions will be sent to the provided address.
   *
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Success response from the server
   * @throws {Error} If the request fails (email not found, server error, etc.)
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a list of users with pagination (admin function)
   *
   * @param {number} page - Page number (0-based)
   * @param {number} pageSize - Number of records per page
   * @returns {Promise<Object>} Paginated user data
   * @throws {Error} If unauthorized or server error occurs
   */
  getUsers: async (page, pageSize) => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(`${API_URL}/auth/users`, {
        params: { page, pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a user account (admin function)
   *
   * @param {string} userId - ID of the user to delete
   * @returns {Promise<Object>} Success message
   * @throws {Error} If unauthorized or server error occurs
   */
  deleteUser: async (userId) => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.delete(`${API_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all companies (admin function)
   *
   * @returns {Promise<Array>} List of companies with staff counts
   * @throws {Error} If unauthorized or server error occurs
   */
  getCompanies: async () => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(`${API_URL}/admin/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get staff for a specific company (admin function)
   *
   * @param {string} company - Company name
   * @returns {Promise<Array>} List of staff for the company
   * @throws {Error} If unauthorized or server error occurs
   */
  getStaffByCompany: async (company) => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `${API_URL}/admin/companies/${company}/staff`,
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

  /**
   * Delete a staff member (admin function)
   *
   * @param {string} staffId - ID of staff to delete
   * @returns {Promise<Object>} Success message
   * @throws {Error} If unauthorized or server error occurs
   */
  deleteStaff: async (staffId) => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.delete(`${API_URL}/admin/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a company and all associated staff (admin function)
   *
   * @param {string} company - Company name
   * @returns {Promise<Object>} Success message
   * @throws {Error} If unauthorized or server error occurs
   */
  deleteCompany: async (company) => {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) throw new Error("Authentication required");

      const response = await axios.delete(
        `${API_URL}/admin/companies/${company}`,
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
