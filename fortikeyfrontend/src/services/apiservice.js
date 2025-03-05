import axios from "axios";
import config from "../config";

const API_URL = config.apiUrl;

// Helper function for authenticated requests
const getAuthenticatedAxios = () => {
  const token = localStorage.getItem(config.auth.tokenStorageKey);
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * API Service
 *
 * Handles API key management, TOTP operations, and analytics functionality.
 * Provides methods for creating, retrieving, and managing API keys and TOTP secrets.
 */
const apiService = {
  /**
   * Generate a new API key for the authenticated user
   * @returns {Promise<Object>} Generated API key data
   */
  generateApiKey: async () => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.post(`${API_URL}/v1/business/apikey`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete the API key for the authenticated user
   * @returns {Promise<Object>} Success message
   */
  deleteApiKey: async () => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.delete(`${API_URL}/v1/business/apikey`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new TOTP secret
   *
   * @param {Object} data - TOTP secret data
   * @returns {Promise<Object>} Created TOTP secret
   */
  createTOTPSecret: async (data) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.post(`${API_URL}/v1/totp-secrets`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all TOTP secrets for the authenticated user
   *
   * @returns {Promise<Array>} List of TOTP secrets
   */
  getAllTOTPSecrets: async () => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/totp-secrets`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a TOTP secret by external user ID
   *
   * @param {string} externalUserId - External user ID
   * @returns {Promise<Object>} TOTP secret data
   */
  getTOTPSecretByExternalUserId: async (externalUserId) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(
        `${API_URL}/v1/totp-secrets/user/${externalUserId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a TOTP secret by its ID
   *
   * @param {string} id - TOTP secret ID
   * @returns {Promise<Object>} TOTP secret data
   */
  getTOTPSecretById: async (id) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/totp-secrets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a TOTP secret
   *
   * @param {string} id - TOTP secret ID
   * @param {Object} data - Updated TOTP secret data
   * @returns {Promise<Object>} Updated TOTP secret
   */
  updateTOTPSecret: async (id, data) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.patch(
        `${API_URL}/v1/totp-secrets/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a TOTP secret
   *
   * @param {string} id - TOTP secret ID
   * @returns {Promise<Object>} Success message
   */
  deleteTOTPSecret: async (id) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.delete(`${API_URL}/v1/totp-secrets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Validate a TOTP token
   *
   * @param {Object} data - TOTP validation data
   * @returns {Promise<Object>} Validation result
   */
  validateTOTP: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/v1/totp-secrets/validate`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get company analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Company analytics data
   */
  getCompanyStats: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/business`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get TOTP analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} TOTP analytics data
   */
  getTOTPStats: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/totp`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get failure analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Failure analytics data
   */
  getFailureAnalytics: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/failures`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get TOTP stats for a specific user
   *
   * @param {string} externalUserId - External user ID
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} User TOTP analytics data
   */
  getUserTOTPStats: async (externalUserId, filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(
        `${API_URL}/v1/analytics/users/${externalUserId}/totp`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get suspicious activity analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Suspicious activity data
   */
  getSuspiciousActivity: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/suspicious`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get device breakdown analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Device breakdown data
   */
  getDeviceBreakdown: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/devices`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get backup code usage analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Backup code usage data
   */
  getBackupCodeUsage: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/v1/analytics/backup-codes`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get time comparison analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Time comparison data
   */
  getTimeComparisons: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(
        `${API_URL}/v1/analytics/time-comparison`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiService;
