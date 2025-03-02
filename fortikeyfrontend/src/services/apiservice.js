/**
 * API service placeholder
 * Note: This is a temporary implementation until the backend is ready.
 * Tests can mock these functions as needed.
 */

import config from "../config";

const USE_MOCK = config.features.useMockServices;
const API_URL = config.apiUrl;

/**
 * Get API keys for the authenticated user
 * @returns {Promise<Array>} List of API keys
 */
export const getApiKeys = async () => {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      id: `mock-${Date.now()}`, 
      name, 
      key: `fk_${Math.random().toString(36).substring(2, 15)}` 
    };
  }
  
  // This would create a key on the backend when implemented
  // Your real implementation here
};

/**
 * Delete an API key
 * @param {string} keyId - ID of the key to delete
 * @returns {Promise<Object>} Result of deletion
 */
export const deleteApiKey = async (keyId) => {
  // This would delete a key on the backend when implemented
  return { success: true };
};

// Export as default object for backwards compatibility
export default {
  getApiKeys,
  createApiKey,
  deleteApiKey,
};
