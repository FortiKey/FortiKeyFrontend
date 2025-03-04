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
 * Handles API key management and related analytics functionality.
 * Provides methods for creating, retrieving, and managing API keys.
 */
const apiService = {
  /**
   * Retrieves all API keys for the authenticated user
   * @returns {Promise<Array>} List of API keys
   */
  getApiKeys: async () => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/keys`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get usage analytics data
   *
   * @param {Object} filters - Filter criteria
   * @param {string} filters.timeRange - Time range for data (e.g., '7d', '30d', '1y')
   * @param {string} filters.apiKey - Optional API key to filter by
   * @returns {Promise<Object>} Analytics data
   */
  getUsageAnalytics: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/analytics/usage`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get error rate analytics
   *
   * @param {Object} filters - Filter criteria
   * @param {string} filters.timeRange - Time range for data
   * @returns {Promise<Object>} Error rate data
   */
  getErrorAnalytics: async (filters = {}) => {
    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/analytics/errors`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiService;
