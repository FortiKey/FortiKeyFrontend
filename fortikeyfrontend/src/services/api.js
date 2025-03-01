import axios from "axios";
import config from "../config";
import authService from "./authservice";

// Create an axios instance
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Request failed");
      }
    } else if (error.request) {
      console.error("No response received");
    } else {
      console.error("Error setting up request", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API Key Management Service
 *
 * Provides methods for creating, retrieving, updating, and deleting API keys.
 * Handles API communication for key-related operations.
 * Uses authentication tokens for secure API access.
 */
const apiService = {
  /**
   * Get all API keys for the current user
   *
   * @returns {Promise<Array>} List of API keys
   */
  getApiKeys: async () => {
    try {
      const token = authService.getToken();

      const response = await axios.get(`${config.apiUrl}/keys`, {
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
   * Get a specific API key by ID
   *
   * @param {string} keyId - ID of the API key to retrieve
   * @returns {Promise<Object>} API key data
   */
  getApiKey: async (keyId) => {
    try {
      const token = authService.getToken();

      const response = await axios.get(`${config.apiUrl}/keys/${keyId}`, {
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
   * Create a new API key
   *
   * @param {Object} keyData - API key data
   * @param {string} keyData.name - Name/description for the API key
   * @param {Array<string>} keyData.permissions - List of permissions for the key
   * @returns {Promise<Object>} Created API key data
   */
  createApiKey: async (keyData) => {
    try {
      const token = authService.getToken();

      const response = await axios.post(`${config.apiUrl}/keys`, keyData, {
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
   * Update an existing API key
   *
   * @param {string} keyId - ID of the API key to update
   * @param {Object} keyData - Updated API key data
   * @param {string} keyData.name - Updated name/description
   * @param {Array<string>} keyData.permissions - Updated permissions
   * @param {boolean} keyData.active - Updated active status
   * @returns {Promise<Object>} Updated API key data
   */
  updateApiKey: async (keyId, keyData) => {
    try {
      const token = authService.getToken();

      const response = await axios.put(
        `${config.apiUrl}/keys/${keyId}`,
        keyData,
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
   * Delete an API key
   *
   * @param {string} keyId - ID of the API key to delete
   * @returns {Promise<Object>} Success message
   */
  deleteApiKey: async (keyId) => {
    try {
      const token = authService.getToken();

      const response = await axios.delete(`${config.apiUrl}/keys/${keyId}`, {
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
   * Regenerate an API key (creates a new key value)
   *
   * @param {string} keyId - ID of the API key to regenerate
   * @returns {Promise<Object>} Updated API key with new key value
   */
  regenerateApiKey: async (keyId) => {
    try {
      const token = authService.getToken();

      const response = await axios.post(
        `${config.apiUrl}/keys/${keyId}/regenerate`,
        {},
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
   * Get usage statistics for an API key
   *
   * @param {string} keyId - ID of the API key
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.startDate - Start date for statistics
   * @param {string} params.endDate - End date for statistics
   * @returns {Promise<Object>} Usage statistics
   */
  getKeyUsage: async (keyId, params = {}) => {
    try {
      const token = authService.getToken();

      const response = await axios.get(`${config.apiUrl}/keys/${keyId}/usage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiService;
