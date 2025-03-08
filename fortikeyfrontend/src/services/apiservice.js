import axios from "axios";
import config from "../config";
import { cachedApiCall, createCacheKey } from "../utils/analyticsDataCaching";

const API_URL = config.apiUrl;

// Helper function for authenticated requests
const getAuthenticatedAxios = () => {
  const token = localStorage.getItem(config.auth.tokenStorageKey);

  if (!token) {
    console.warn("getAuthenticatedAxios: No authentication token found!");
  }

  return axios.create({
    headers: {
      Authorization: `Bearer ${token || ''}`,
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
      const response = await http.post(`${API_URL}/business/apikey`);

      // Check if we have the expected data structure
      if (!response.data || (!response.data.apiKey && !response.data.key)) {
        console.warn("API key response missing expected properties:", response.data);
      }

      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        console.error("API error response:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("API request error (no response):", error.request);
      } else {
        console.error("API request setup error:", error.message);
      }

      throw error.response?.data || error;
    }
  },

  /**
   * Get current API key for the authenticated user
   * @returns {Promise<Object>} Current API key data
   */
  getCurrentApiKey: async () => {
    try {
      // Note: This is a placeholder for a backend endpoint that doesn't yet exist
      // The backend should implement a GET endpoint for retrieving the current API key

      const http = getAuthenticatedAxios();
      const response = await http.get(`${API_URL}/business/apikey`);
      return response.data;
    } catch (error) {
      // For now, if the endpoint doesn't exist, we can fall back to localStorage
      const storedKey = localStorage.getItem("apiKey");
      if (storedKey) {
        return { apiKey: storedKey };
      }

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
      const response = await http.delete(`${API_URL}/business/apikey`);
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
      const response = await http.post(`${API_URL}/totp-secrets`, data);
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
      const response = await http.get(`${API_URL}/totp-secrets`);
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
        `${API_URL}/totp-secrets/user/${externalUserId}`
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
      const response = await http.get(`${API_URL}/totp-secrets/${id}`);
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
        `${API_URL}/totp-secrets/${id}`,
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
      const response = await http.delete(`${API_URL}/totp-secrets/${id}`);
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
        `${API_URL}/totp-secrets/validate`,
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
  getCompanyStats: async (filters = {}, forceRefresh = false) => {
    const cacheKey = createCacheKey('analytics/business', filters);

    try {
      return await cachedApiCall(cacheKey, async () => {
        const http = getAuthenticatedAxios();

        // Ensure the period is passed correctly
        const params = { ...filters };
        if (params.period && typeof params.period === 'number') {
          params.period = params.period.toString();
        }

        const response = await http.get(`${API_URL}/analytics/business`, {
          params,
        });

        return response.data;
      }, forceRefresh);
    } catch (error) {
      // Throw more informative error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch company statistics';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get TOTP analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} TOTP analytics data
   */
  getTOTPStats: async (filters = {}, forceRefresh = false) => {
    const cacheKey = createCacheKey('analytics/totp', filters);

    try {
      // Check for token
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) {
        console.warn("No auth token found for TOTP stats");
        return { summary: {}, dailyStats: [] };
      }

      return await cachedApiCall(cacheKey, async () => {
        const http = getAuthenticatedAxios();

        // Ensure the period is passed correctly
        const params = { ...filters };
        if (params.period && typeof params.period === 'number') {
          params.period = params.period.toString();
        }

        const response = await http.get(`${API_URL}/analytics/totp`, {
          params,
        });

        return response.data;
      }, forceRefresh);
    } catch (error) {
      // More detailed error logging
      if (error.response) {
        console.error("API error response:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("API request error (no response):", error.request);
      } else {
        console.error("API request setup error:", error.message);
      }

      // Throw more informative error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch TOTP statistics';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get failure analytics
   *
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise<Object>} Failure analytics data
   */
  getFailureAnalytics: async (filters = {}, forceRefresh = false) => {
    const cacheKey = createCacheKey('analytics/failures', filters);

    try {
      return await cachedApiCall(cacheKey, async () => {
        const http = getAuthenticatedAxios();

        // Ensure the period is passed correctly
        const params = { ...filters };
        if (params.period && typeof params.period === 'number') {
          params.period = params.period.toString();
        }

        const response = await http.get(`${API_URL}/analytics/failures`, {
          params,
        });

        return response.data;
      }, forceRefresh);
    } catch (error) {
      // Throw more informative error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch failure analytics';
      throw new Error(errorMessage);
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
        `${API_URL}/analytics/users/${externalUserId}/totp`,
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
      const response = await http.get(`${API_URL}/analytics/suspicious`, {
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
  getDeviceBreakdown: async (filters = {}, forceRefresh = false) => {
    const cacheKey = createCacheKey('analytics/devices', filters);

    try {
      return await cachedApiCall(cacheKey, async () => {
        const http = getAuthenticatedAxios();

        // Ensure the period is passed correctly
        const params = { ...filters };
        if (params.period && typeof params.period === 'number') {
          params.period = params.period.toString();
        }

        const response = await http.get(`${API_URL}/analytics/devices`, {
          params,
        });

        return response.data;
      }, forceRefresh);
    } catch (error) {
      // Throw more informative error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch device analytics';
      throw new Error(errorMessage);
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
      const response = await http.get(`${API_URL}/analytics/backup-codes`, {
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
    const formatDateFilter = (date) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
      return date;
    };

    // Format the date filters
    const formattedFilters = {
      ...filters,
      startDate: formatDateFilter(filters.startDate),
      endDate: formatDateFilter(filters.endDate),
    };

    try {
      const http = getAuthenticatedAxios();
      const response = await http.get(
        `${API_URL}/analytics/time-comparison`,
        {
          params: formattedFilters,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default apiService;
