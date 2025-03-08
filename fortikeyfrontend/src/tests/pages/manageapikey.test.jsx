import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import ManageApiKey from "../../pages/manageapikey";
import apiService from "../../services/apiservice";

// Mock dependencies
jest.mock("../../services/apiservice", () => ({
  generateApiKey: jest.fn(),
  deleteApiKey: jest.fn(),
}));

const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();

jest.mock("../../context", () => ({
  ...jest.requireActual("../../context"),
  useToast: () => ({
    showSuccessToast: mockShowSuccessToast,
    showErrorToast: mockShowErrorToast,
  }),
}));

describe("Manage API Key Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the localStorage getItem method
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue("fk_live_3x7abcdef1234567890"),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  test("renders API key management interface with API key", async () => {
    renderWithProviders(<ManageApiKey />);

    // Check for page title
    expect(screen.getByText(/Manage API Key/i)).toBeInTheDocument();

    // Check for the Generate button
    expect(
      screen.getByRole("button", { name: /Generate New API Key/i })
    ).toBeInTheDocument();

    // Wait for API key to load
    await waitFor(() => {
      expect(window.localStorage.getItem).toHaveBeenCalledWith("apiKey");
    });
  });

  test("generates a new API key when confirmed", async () => {
    // Mock the API response with a structure that matches the backend response
    const newApiKey = { apiKey: "fk_live_newapikey12345" };

    // Use generateApiKey instead of createApiKey
    apiService.generateApiKey.mockResolvedValue(newApiKey);

    renderWithProviders(<ManageApiKey />);

    // Click the "Generate New API Key" button first to open the dialog
    const openDialogButton = screen.getByRole("button", {
      name: /Generate New API Key/i,
    });
    fireEvent.click(openDialogButton);

    // Wait for the dialog to be fully rendered
    await waitFor(() => {
      expect(
        screen.getByText(/Are you sure you want to generate a new API key/i)
      ).toBeInTheDocument();
    });

    // Find and click the Generate button within the dialog
    const generateButton = screen.getByText("Generate");
    fireEvent.click(generateButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(apiService.generateApiKey).toHaveBeenCalled();
    });

    // Check that localStorage was updated
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "apiKey",
        "fk_live_newapikey12345"
      );
    });

    // Check for success toast - this should now be called
    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "New API key generated successfully!"
      );
    });
  });
});
