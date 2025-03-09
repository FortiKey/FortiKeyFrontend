/**
 * Analytics Data Cache
 *
 * This utility provides a caching mechanism for API responses to reduce
 * the number of API calls and prevent rate limit issues.
 */

// Cache object to store API responses
const dataCache = {
  // Structure: { [endpoint+params]: { data, timestamp } }
};

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// In-flight requests tracker to prevent duplicate API calls
const inFlightRequests = {};

/**
 * Get data from cache if available and not expired
 *
 * @param {string} key - Cache key (typically endpoint + params)
 * @returns {Object|null} Cached data or null if not available or expired
 */
export const getFromCache = (key) => {
  const cachedData = dataCache[key];

  if (cachedData) {
    // Check if cache is still valid
    const now = Date.now();
    if (now - cachedData.timestamp < CACHE_EXPIRY) {
      return cachedData.data;
    }

    // Remove expired data
    delete dataCache[key];
  }

  return null;
};

/**
 * Store data in cache
 *
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 */
export const storeInCache = (key, data) => {
  // Don't cache empty or error responses
  if (!data || (data.error && !data.data)) {
    return;
  }

  // Deep clone data to prevent reference issues
  const clonedData = JSON.parse(JSON.stringify(data));

  dataCache[key] = {
    data: clonedData,
    timestamp: Date.now(),
  };
};

/**
 * Clear entire cache or specific key
 *
 * @param {string} [key] - Optional specific key to clear
 * @param {string} [prefix] - Optional prefix to clear all matching keys
 */
export const clearCache = (key, prefix) => {
  if (key) {
    delete dataCache[key];
  } else if (prefix) {
    // Clear all keys starting with prefix
    Object.keys(dataCache).forEach((k) => {
      if (k.startsWith(prefix)) {
        delete dataCache[k];
      }
    });
  } else {
    // Clear all cache
    Object.keys(dataCache).forEach((k) => delete dataCache[k]);
  }
};

/**
 * Make a cached API call with in-flight request prevention
 *
 * @param {string} key - Cache key
 * @param {Function} apiCall - Function that returns a promise for the API call
 * @param {boolean} [forceRefresh=false] - Force refresh from API
 * @returns {Promise<Object>} Response data
 */
export const cachedApiCall = async (key, apiCall, forceRefresh = false) => {
  // Check if this request is already in-flight
  if (inFlightRequests[key]) {
    // Wait for existing request to complete
    try {
      return await inFlightRequests[key];
    } catch (error) {
      // If the first request failed, we'll try again
      delete inFlightRequests[key];
    }
  }

  // Force bypass cache when requested
  if (forceRefresh) {
    try {
      // Store the promise in in-flight requests
      inFlightRequests[key] = apiCall();

      // Await the result
      const result = await inFlightRequests[key];

      // Cache the successful response
      storeInCache(key, result);

      // Clean up in-flight request
      delete inFlightRequests[key];

      return result;
    } catch (error) {
      // Clean up in-flight request on error
      delete inFlightRequests[key];
      throw error;
    }
  }

  // Check cache first if not forcing refresh
  const cachedData = getFromCache(key);
  if (cachedData) {
    return cachedData;
  }

  // Create a new promise for this request
  try {
    // Store the promise in in-flight requests
    inFlightRequests[key] = apiCall();

    // Await the result
    const result = await inFlightRequests[key];

    // Cache the successful response
    storeInCache(key, result);

    // Clean up in-flight request
    delete inFlightRequests[key];

    return result;
  } catch (error) {
    // Clean up in-flight request on error
    delete inFlightRequests[key];

    // Handle specific error cases
    if (error.response?.status === 429) {
      // Try to use cached data even if expired
      const expiredData = Object.keys(dataCache)
        .filter((k) => k.split("?")[0] === key.split("?")[0]) // Match endpoint without params
        .map((k) => dataCache[k])
        .sort((a, b) => b.timestamp - a.timestamp)[0]; // Get most recent

      if (expiredData) {
        return expiredData.data;
      }
    }

    throw error;
  }
};

/**
 * Create a cache key from endpoint and params
 * Enhanced to handle date objects and arrays consistently
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {string} Cache key
 */
export const createCacheKey = (endpoint, params = {}) => {
  // Process params to ensure consistent cache keys
  const processedParams = {};

  // Sort and normalize parameters
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const value = params[key];

      // Handle different parameter types consistently
      if (value instanceof Date) {
        // Format dates as ISO strings
        processedParams[key] = value.toISOString().split("T")[0];
      } else if (Array.isArray(value)) {
        // Sort arrays for consistent keys
        processedParams[key] = [...value].sort().join(",");
      } else if (value !== undefined && value !== null) {
        // Convert all other values to strings
        processedParams[key] = String(value);
      }
    });

  // Create sorted query string
  const sortedParams = Object.keys(processedParams)
    .sort()
    .map((key) => `${key}=${processedParams[key]}`)
    .join("&");

  const cacheKey = `${endpoint}${sortedParams ? `?${sortedParams}` : ""}`;

  return cacheKey;
};

/**
 * Pre-warm cache with initial data
 * Useful for ensuring consistent data is available
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @param {Object} data - Data to cache
 */
export const preWarmCache = (endpoint, params, data) => {
  const key = createCacheKey(endpoint, params);
  storeInCache(key, data);
};

/**
 * Batch clear cache for a specific date range
 * Useful when data for a date range needs to be refreshed
 *
 * @param {string} endpoint - API endpoint
 * @param {Date} startDate - Start date of range
 * @param {Date} endDate - End date of range
 */
export const clearCacheForDateRange = (endpoint, startDate, endDate) => {
  // Find keys that match this endpoint and contain date params in range
  const keysToDelete = Object.keys(dataCache).filter((key) => {
    if (!key.startsWith(endpoint)) return false;

    // Check if this key contains date parameters
    const hasStartDate = key.includes("startDate=");
    const hasEndDate = key.includes("endDate=");
    const hasPeriod = key.includes("period=");

    if (!hasStartDate && !hasEndDate && !hasPeriod) return false;

    // Extract dates from the key
    let keyStartDate, keyEndDate;

    if (hasStartDate) {
      const startMatch = key.match(/startDate=([^&]+)/);
      if (startMatch) keyStartDate = new Date(startMatch[1]);
    }

    if (hasEndDate) {
      const endMatch = key.match(/endDate=([^&]+)/);
      if (endMatch) keyEndDate = new Date(endMatch[1]);
    }

    // Handle period-based keys
    if (hasPeriod && !hasStartDate && !hasEndDate) {
      // Period-based keys should be cleared as they might overlap
      return true;
    }

    // Check for date range overlap
    if (keyStartDate && keyEndDate) {
      // There's overlap if either:
      // - The target start date is between the key's date range
      // - The target end date is between the key's date range
      // - The key's date range is entirely within the target date range
      return (
        (startDate >= keyStartDate && startDate <= keyEndDate) ||
        (endDate >= keyStartDate && endDate <= keyEndDate) ||
        (startDate <= keyStartDate && endDate >= keyEndDate)
      );
    }

    return true;
  });

  // Delete matching keys
  keysToDelete.forEach((key) => {
    delete dataCache[key];
  });
};

/**
 * Get cache statistics for monitoring
 *
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  const keys = Object.keys(dataCache);
  const totalEntries = keys.length;

  // Group by endpoint
  const endpointStats = {};
  keys.forEach((key) => {
    const endpoint = key.split("?")[0];
    if (!endpointStats[endpoint]) {
      endpointStats[endpoint] = 0;
    }
    endpointStats[endpoint]++;
  });

  // Calculate memory usage (approximate)
  let totalSize = 0;
  keys.forEach((key) => {
    const entry = dataCache[key];
    const json = JSON.stringify(entry.data);
    totalSize += json.length * 2; // Rough estimate: 2 bytes per character
  });

  // Format size
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return {
    totalEntries,
    totalSize: formatSize(totalSize),
    endpointStats,
    oldestEntry: keys.length
      ? new Date(
          Math.min(...keys.map((k) => dataCache[k].timestamp))
        ).toISOString()
      : null,
    newestEntry: keys.length
      ? new Date(
          Math.max(...keys.map((k) => dataCache[k].timestamp))
        ).toISOString()
      : null,
  };
};
