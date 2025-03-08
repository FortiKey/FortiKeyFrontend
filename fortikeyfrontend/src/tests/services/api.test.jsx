import React from "react";
import apiService from "../../services/apiservice";

// Mock the entire apiService module
jest.mock("../../services/apiservice");

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Existing mocks
    apiService.generateApiKey = jest.fn().mockResolvedValue({
      apiKey: "fk_live_newapikey12345",
    });
    apiService.deleteApiKey = jest.fn().mockResolvedValue({
      message: "API key deleted",
    });
    apiService.getApiKeys = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "API Key 1" }]);
    apiService.createApiKey = jest.fn().mockResolvedValue({
      id: 1,
      key: "fk_live_newapikey12345",
    });

    // TOTP function mocks
    apiService.createTOTPSecret = jest.fn().mockResolvedValue({
      _id: "123456",
      externalUserId: "user123",
      secret: "ABCDEFGHIJKLMNOP",
      uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
    });
    apiService.getAllTOTPSecrets = jest.fn().mockResolvedValue([
      {
        _id: "123456",
        externalUserId: "user123",
        uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
      },
    ]);
    apiService.getTOTPSecretByExternalUserId = jest.fn().mockResolvedValue({
      _id: "123456",
      externalUserId: "user123",
      uri: "otpauth://totp/Test%20App:user123?secret=ABCDEFGHIJKLMNOP&issuer=FortiKey",
    });
    apiService.validateTOTP = jest.fn().mockResolvedValue({
      valid: true,
    });

    // Analytics function mocks
    apiService.getCompanyStats = jest.fn().mockResolvedValue({
      totalSecrets: 10,
      totalValidations: 100,
    });
    apiService.getTOTPStats = jest.fn().mockResolvedValue({
      totpSuccessRate: 90,
      validationsOverTime: [
        { date: "2023-01-01", count: 10 },
        { date: "2023-01-02", count: 15 },
      ],
    });
    apiService.getFailureAnalytics = jest.fn().mockResolvedValue({
      failuresByTime: [
        { hour: 1, count: 5 },
        { hour: 2, count: 3 },
      ],
      failuresByDevice: {
        mobile: 60,
        desktop: 40,
      },
    });
  });

  test("getApiKeys fetches API keys successfully", async () => {
    const result = await apiService.getApiKeys();
    expect(apiService.getApiKeys).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, name: "API Key 1" }]);
  });

  test("createApiKey creates a new API key", async () => {
    const keyData = { name: "Test Key", permissions: ["read", "write"] };
    const result = await apiService.createApiKey(keyData);
    expect(apiService.createApiKey).toHaveBeenCalledWith(keyData);
    expect(result).toEqual({ id: 1, key: "fk_live_newapikey12345" });
  });

  test("deleteApiKey removes an API key", async () => {
    const keyId = 1;
    const result = await apiService.deleteApiKey(keyId);
    expect(apiService.deleteApiKey).toHaveBeenCalledWith(keyId);
    expect(result).toEqual({ message: "API key deleted" });
  });

  test("handles API errors gracefully", async () => {
    const errorMessage = "Error fetching API keys";
    apiService.getApiKeys.mockRejectedValueOnce(new Error(errorMessage));

    try {
      await apiService.getApiKeys();
      throw new Error("Expected an error to be thrown but none was thrown");
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });

  test("createTOTPSecret creates a new TOTP secret", async () => {
    const data = {
      externalUserId: "user123",
      label: "Test App",
      issuer: "FortiKey",
    };
    const result = await apiService.createTOTPSecret(data);
    expect(apiService.createTOTPSecret).toHaveBeenCalledWith(data);
    expect(result).toHaveProperty("secret");
    expect(result).toHaveProperty("uri");
  });

  test("getAllTOTPSecrets retrieves all TOTP secrets", async () => {
    const result = await apiService.getAllTOTPSecrets();
    expect(apiService.getAllTOTPSecrets).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("getTOTPSecretByExternalUserId retrieves a TOTP secret by user ID", async () => {
    const externalUserId = "user123";
    const result = await apiService.getTOTPSecretByExternalUserId(
      externalUserId
    );
    expect(apiService.getTOTPSecretByExternalUserId).toHaveBeenCalledWith(
      externalUserId
    );
    expect(result.externalUserId).toEqual(externalUserId);
  });

  test("validateTOTP validates a TOTP token", async () => {
    const validationData = {
      externalUserId: "user123",
      token: "123456",
    };
    const result = await apiService.validateTOTP(validationData);
    expect(apiService.validateTOTP).toHaveBeenCalledWith(validationData);
    expect(result).toHaveProperty("valid");
    expect(result.valid).toBe(true);
  });

  test("getCompanyStats retrieves company statistics", async () => {
    const result = await apiService.getCompanyStats();
    expect(apiService.getCompanyStats).toHaveBeenCalled();
    expect(result).toHaveProperty("totalSecrets");
    expect(result).toHaveProperty("totalValidations");
  });

  test("getTOTPStats retrieves TOTP statistics", async () => {
    const result = await apiService.getTOTPStats();
    expect(apiService.getTOTPStats).toHaveBeenCalled();
    expect(result).toHaveProperty("totpSuccessRate");
    expect(result).toHaveProperty("validationsOverTime");
  });

  test("getFailureAnalytics retrieves failure analytics", async () => {
    const result = await apiService.getFailureAnalytics();
    expect(apiService.getFailureAnalytics).toHaveBeenCalled();
    expect(result).toHaveProperty("failuresByTime");
    expect(result).toHaveProperty("failuresByDevice");
  });
});
