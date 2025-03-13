import axios from "axios";
import apiService from "../../services/apiservice";
import config from "../../config";
import * as cachingUtils from "../../utils/analyticsDataCaching";

// Mock dependencies, not the apiService itself
jest.mock("axios");
jest.mock("../../utils/analyticsDataCaching");

describe("API Service", () => {
  // Mock localStorage
  let localStorageMock = {};
  // Create a standard mockHttpClient for all tests to use
  let mockHttpClient;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();

    // Reset localStorage mock
    localStorageMock = {};

    // Mock localStorage methods
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => localStorageMock[key] || null),
        setItem: jest.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Set auth token in mock localStorage for authenticated requests
    localStorageMock[config.auth.tokenStorageKey] = "test-token";

    // Mock console methods to suppress warnings/errors during tests
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock cachingUtils
    cachingUtils.cachedApiCall.mockImplementation((key, fetchFunc) =>
      fetchFunc()
    );
    cachingUtils.createCacheKey.mockImplementation(
      (endpoint, filters) => `${endpoint}-${JSON.stringify(filters)}`
    );

    // Create a complete mock HTTP client
    // ensuring all HTTP methods exist on the mock
    mockHttpClient = {
      post: jest.fn().mockResolvedValue({ data: {} }),
      get: jest.fn().mockResolvedValue({ data: {} }),
      patch: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
      defaults: { headers: {} },
    };

    // Use this for all axios.create() calls
    axios.create.mockReturnValue(mockHttpClient);
  });

  afterEach(() => {
    // Restore console methods
    console.warn.mockRestore();
    console.error.mockRestore();
  });

  describe("Authentication", () => {
    test("getAuthenticatedAxios adds token to request headers", () => {
      // Call the method that will be using getAuthenticatedAxios
      apiService.generateApiKey();

      // Verify axios.create was called with the correct authorization header
      expect(axios.create).toHaveBeenCalledWith({
        headers: { Authorization: "Bearer test-token" },
      });
    });

    test("getAuthenticatedAxios handles missing token", () => {
      // Remove token from localStorage
      window.localStorage.getItem.mockReturnValue(null);

      // Call a method that uses getAuthenticatedAxios
      apiService.generateApiKey();

      // Should provide empty token
      expect(axios.create).toHaveBeenCalledWith({
        headers: { Authorization: "Bearer " },
      });

      // Warning should be logged
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("No authentication token found")
      );
    });
  });

  describe("API Key Management", () => {
    test("generateApiKey creates a new API key", async () => {
      // Override just the post method for this specific test
      mockHttpClient.post.mockResolvedValueOnce({
        data: { apiKey: "fk_live_newapikey12345" },
      });

      const result = await apiService.generateApiKey();

      // Verify axios was called with correct parameters
      expect(axios.create).toHaveBeenCalledWith({
        headers: { Authorization: "Bearer test-token" },
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${config.apiUrl}/business/apikey`
      );
      expect(result).toEqual({ apiKey: "fk_live_newapikey12345" });
    });

    test("generateApiKey warns about unexpected data structure", async () => {
      // Override for this test
      mockHttpClient.post.mockResolvedValueOnce({
        data: { unexpectedProperty: "value" },
      });

      const result = await apiService.generateApiKey();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("API key response missing expected properties"),
        expect.anything()
      );
      expect(result).toEqual({ unexpectedProperty: "value" });
    });

    test("generateApiKey handles errors with response data", async () => {
      // Mock axios error with response
      const error = new Error("Network error");
      error.response = { data: { message: "API Server Error" }, status: 500 };

      mockHttpClient.post.mockRejectedValueOnce(error);

      // Test error handling
      await expect(apiService.generateApiKey()).rejects.toEqual({
        message: "API Server Error",
      });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API error response:"),
        expect.anything(),
        expect.anything()
      );
    });

    test("generateApiKey handles errors with request but no response", async () => {
      // Mock axios error with request but no response
      const error = new Error("Request error");
      error.request = { status: 0 };

      mockHttpClient.post.mockRejectedValueOnce(error);

      // Test error handling
      await expect(apiService.generateApiKey()).rejects.toEqual(error);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API request error (no response):"),
        expect.anything()
      );
    });

    test("generateApiKey handles setup errors", async () => {
      // Mock general error
      const error = new Error("Setup error");

      mockHttpClient.post.mockRejectedValueOnce(error);

      // Test error handling
      await expect(apiService.generateApiKey()).rejects.toEqual(error);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API request setup error:"),
        expect.stringContaining("Setup error")
      );
    });

    test("getCurrentApiKey fetches the current API key", async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: { apiKey: "fk_live_current12345" },
      });

      const result = await apiService.getCurrentApiKey();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/business/apikey`
      );
      expect(result).toEqual({ apiKey: "fk_live_current12345" });
    });

    test("getCurrentApiKey falls back to localStorage if API fails", async () => {
      // Mock API failure
      const error = new Error("Not found");
      mockHttpClient.get.mockRejectedValueOnce(error);

      // Set a value in localStorage
      localStorageMock["apiKey"] = "fk_live_local12345";

      const result = await apiService.getCurrentApiKey();

      expect(result).toEqual({ apiKey: "fk_live_local12345" });
    });

    test("getCurrentApiKey throws error if API fails and no localStorage key", async () => {
      // Mock API failure
      const error = new Error("Not found");
      mockHttpClient.get.mockRejectedValueOnce(error);

      // No apiKey in localStorage

      await expect(apiService.getCurrentApiKey()).rejects.toEqual(error);
    });

    test("deleteApiKey removes an API key", async () => {
      mockHttpClient.delete.mockResolvedValueOnce({
        data: { message: "API key deleted" },
      });

      const result = await apiService.deleteApiKey();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${config.apiUrl}/business/apikey`
      );
      expect(result).toEqual({ message: "API key deleted" });
    });

    test("deleteApiKey handles errors", async () => {
      const error = new Error("Delete failed");
      error.response = { data: { message: "Permission denied" } };

      mockHttpClient.delete.mockRejectedValueOnce(error);

      await expect(apiService.deleteApiKey()).rejects.toEqual({
        message: "Permission denied",
      });
    });
  });

  describe("TOTP Management", () => {
    test("createTOTPSecret creates a new TOTP secret", async () => {
      const secretData = {
        externalUserId: "user123",
        label: "Test App",
        issuer: "FortiKey",
      };

      const mockResponse = {
        _id: "123456",
        externalUserId: "user123",
        secret: "ABCDEFGHIJKLMNOP",
        uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
      };

      mockHttpClient.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.createTOTPSecret(secretData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets`,
        secretData
      );
      expect(result).toEqual(mockResponse);
    });

    test("getAllTOTPSecrets fetches all TOTP secrets", async () => {
      const mockResponse = [
        {
          _id: "123456",
          externalUserId: "user123",
          uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
        },
        {
          _id: "789012",
          externalUserId: "user456",
          uri: "otpauth://totp/Test%20App:user456?secret=QRSTUVWXYZ123456&issuer=FortiKey",
        },
      ];

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getAllTOTPSecrets();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets`
      );
      expect(result).toEqual(mockResponse);
    });

    test("getTOTPSecretByExternalUserId fetches a secret by user ID", async () => {
      const userId = "user123";
      const mockResponse = {
        _id: "123456",
        externalUserId: userId,
        uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getTOTPSecretByExternalUserId(userId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets/user/${userId}`
      );
      expect(result).toEqual(mockResponse);
    });

    test("getTOTPSecretById fetches a secret by ID", async () => {
      const secretId = "123456";
      const mockResponse = {
        _id: secretId,
        externalUserId: "user123",
        uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getTOTPSecretById(secretId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets/${secretId}`
      );
      expect(result).toEqual(mockResponse);
    });

    test("updateTOTPSecret updates an existing secret", async () => {
      const secretId = "123456";
      const updateData = {
        label: "Updated App",
      };

      const mockResponse = {
        _id: secretId,
        externalUserId: "user123",
        label: "Updated App",
        uri: "otpauth://totp/Updated%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
      };

      mockHttpClient.patch.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.updateTOTPSecret(secretId, updateData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets/${secretId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });

    test("deleteTOTPSecret deletes a secret", async () => {
      const secretId = "123456";
      const mockResponse = { message: "Secret deleted successfully" };

      mockHttpClient.delete.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.deleteTOTPSecret(secretId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets/${secretId}`
      );
      expect(result).toEqual(mockResponse);
    });

    test("validateTOTP validates a TOTP token", async () => {
      const validationData = {
        externalUserId: "user123",
        token: "123456",
      };

      const mockResponse = { valid: true };

      axios.post.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.validateTOTP(validationData);

      expect(axios.post).toHaveBeenCalledWith(
        `${config.apiUrl}/totp-secrets/validate`,
        validationData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Analytics", () => {
    test("getCompanyStats fetches company statistics with caching", async () => {
      const filters = { period: 30 };
      const mockResponse = {
        totalSecrets: 10,
        totalValidations: 100,
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getCompanyStats(filters);

      expect(cachingUtils.createCacheKey).toHaveBeenCalledWith(
        "analytics/business",
        filters
      );
      expect(cachingUtils.cachedApiCall).toHaveBeenCalled();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/business`,
        { params: { period: "30" } }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getCompanyStats handles errors", async () => {
      const filters = { period: 30 };
      const error = new Error("API error");

      // Mock the cachedApiCall to reject
      cachingUtils.cachedApiCall.mockRejectedValueOnce(error);

      await expect(apiService.getCompanyStats(filters)).rejects.toThrow(
        "API error"
      );
    });

    test("getCompanyStats with forceRefresh", async () => {
      const filters = { period: 30 };

      await apiService.getCompanyStats(filters, true);

      // Check that cachedApiCall was called with forceRefresh = true
      expect(cachingUtils.cachedApiCall).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function),
        true
      );
    });

    test("getTOTPStats fetches TOTP statistics", async () => {
      const filters = { period: "30d" };
      const mockResponse = {
        summary: {
          totpSuccessRate: 90,
          totalRequests: 100,
        },
        dailyStats: [
          { date: "2023-01-01", count: 10 },
          { date: "2023-01-02", count: 15 },
        ],
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getTOTPStats(filters);

      expect(cachingUtils.createCacheKey).toHaveBeenCalledWith(
        "analytics/totp",
        filters
      );

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/totp`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getTOTPStats handles missing auth token", async () => {
      // Remove the auth token
      window.localStorage.getItem.mockReturnValue(null);

      // axios should not be called
      const result = await apiService.getTOTPStats();

      expect(axios.create).not.toHaveBeenCalled();
      expect(result).toEqual({ summary: {}, dailyStats: [] });
      expect(console.warn).toHaveBeenCalledWith(
        "No auth token found for TOTP stats"
      );
    });

    test("getTOTPStats handles API errors", async () => {
      const filters = { period: "30d" };
      const error = new Error("Network error");
      error.response = { status: 500, data: { message: "Server error" } };

      mockHttpClient.get.mockRejectedValueOnce(error);

      await expect(apiService.getTOTPStats(filters)).rejects.toThrow(
        "Server error"
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API error response:"),
        expect.anything(),
        expect.anything()
      );
    });

    test("getFailureAnalytics fetches failure statistics", async () => {
      const filters = { period: "30d" };
      const mockResponse = {
        failuresByTime: [
          { hour: 1, count: 5 },
          { hour: 2, count: 3 },
        ],
        failuresByDevice: {
          mobile: 60,
          desktop: 40,
        },
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getFailureAnalytics(filters);

      expect(cachingUtils.createCacheKey).toHaveBeenCalledWith(
        "analytics/failures",
        filters
      );

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/failures`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getUserTOTPStats fetches user-specific statistics", async () => {
      const userId = "user123";
      const filters = { period: "30d" };
      const mockResponse = {
        totalValidations: 25,
        successRate: 92,
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getUserTOTPStats(userId, filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/users/${userId}/totp`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getSuspiciousActivity fetches suspicious activity data", async () => {
      const filters = { period: "30d" };
      const mockResponse = {
        suspiciousAttempts: 15,
        locations: [
          { country: "Unknown", count: 10 },
          { country: "Different IP", count: 5 },
        ],
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getSuspiciousActivity(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/suspicious`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getDeviceBreakdown fetches device analytics", async () => {
      const filters = { period: "30d" };
      const mockResponse = {
        deviceBreakdown: {
          mobile: 60,
          desktop: 40,
        },
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getDeviceBreakdown(filters);

      expect(cachingUtils.createCacheKey).toHaveBeenCalledWith(
        "analytics/devices",
        filters
      );

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/devices`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getBackupCodeUsage fetches backup code usage data", async () => {
      const filters = { period: "30d" };
      const mockResponse = {
        totalUsed: 12,
        usageByDay: [
          { date: "2023-01-01", count: 2 },
          { date: "2023-01-02", count: 3 },
        ],
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getBackupCodeUsage(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/backup-codes`,
        { params: filters }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getTimeComparisons formats date filters correctly", async () => {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const filters = {
        startDate: lastMonth,
        endDate: today,
      };

      const formattedStartDate = lastMonth.toISOString().split("T")[0];
      const formattedEndDate = today.toISOString().split("T")[0];

      const mockResponse = {
        comparisonData: {
          period1: 100,
          period2: 150,
        },
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getTimeComparisons(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/time-comparison`,
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test("getTimeComparisons handles string dates", async () => {
      const filters = {
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      };

      const mockResponse = {
        comparisonData: {
          period1: 100,
          period2: 150,
        },
      };

      mockHttpClient.get.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await apiService.getTimeComparisons(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${config.apiUrl}/analytics/time-comparison`,
        {
          params: {
            startDate: "2023-01-01",
            endDate: "2023-01-31",
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
