import config from "../config";

const USE_MOCK = config.features.useMockServices;
const API_URL = config.apiUrl;

/**
 * API service placeholder
 * Note: This is a temporary implementation until the backend is ready.
 * Tests can mock these functions as needed.
 */

/**
 * Get API keys for the authenticated user
 * @returns {Promise<Array>} List of API keys
 */
export const getApiKeys = async () => {
  if (USE_MOCK) {
    console.log("Mock getApiKeys");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: "mock-1",
        key: "fk_live_3x7abcdef1234567890",
        created: new Date().toISOString(),
        status: "active",
      },
      {
        id: "mock-2",
        key: "fk_test_4x8ghijkl0987654321",
        created: new Date().toISOString(),
        status: "active",
      },
    ];
  }

  // This would fetch from the backend when implemented
  return [];
};

/**
 * Create a new API key
 * @param {string} name - Name for the new key
 * @returns {Promise<Object>} The created key
 */
export const createApiKey = async (name) => {
  if (USE_MOCK) {
    console.log("Mock createApiKey:", name);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: `mock-${Date.now()}`,
      name,
      key: `fk_live_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      status: "active",
    };
  }

  // This would create a key on the backend when implemented
  return {};
};

/**
 * Delete an API key
 * @param {string} id - ID of the key to delete
 * @returns {Promise<Object>} Response with success message
 */
export const deleteApiKey = async (id) => {
  if (USE_MOCK) {
    console.log("Mock deleteApiKey:", id);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { message: "API key deleted" };
  }

  // This would delete the key on the backend when implemented
  return {};
};

// Default export for compatibility with tests
const apiService = {
  getApiKeys,
  createApiKey,
  deleteApiKey,
};

export default apiService;
