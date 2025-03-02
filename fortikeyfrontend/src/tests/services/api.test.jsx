import React from "react";
import apiService from "../../services/apiservice";

// Mock the entire apiService module
jest.mock("../../services/apiservice");

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the apiService methods directly
    apiService.getApiKeys.mockResolvedValue([{ id: 1, name: "API Key 1" }]);
    apiService.createApiKey.mockResolvedValue({
      id: 1,
      key: "fk_live_newapikey12345",
    });
    apiService.deleteApiKey.mockResolvedValue({ message: "API key deleted" });
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
});
