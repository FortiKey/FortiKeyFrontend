import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import ManageApiKey from "../../pages/manageapikey";
import * as api from "../../services/apiservice";

// Mock dependencies
jest.mock("../../services/apiservice", () => ({
  getApiKeys: jest.fn(),
  createApiKey: jest.fn(),
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
  // Updated mock API keys with realistic format
  const mockApiKeys = [
    {
      id: "1",
      key: "fk_live_3x7abcdef1234567890",
      created: "2023-01-01",
      status: "active",
    },
    {
      id: "2",
      key: "fk_live_4x8ghijkl0987654321",
      created: "2023-02-01",
      status: "revoked",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getApiKeys.mockResolvedValue(mockApiKeys);
  });

  test("renders API key management interface with key list", async () => {
    renderWithProviders(<ManageApiKey />);

    // Check for page title
    expect(screen.getByText(/Manage API Key/i)).toBeInTheDocument();

    // Check for the Generate button (the initial one, not in dialog)
    expect(
      screen.getByRole("button", { name: /Generate New API Key/i })
    ).toBeInTheDocument();

    // Wait for API keys to load - use a more flexible approach
    await waitFor(() => {
      // Check if at least one of the API keys is visible
      expect(screen.getByText(mockApiKeys[0].key)).toBeInTheDocument();
    });
  });

  test("generates a new API key when confirmed", async () => {
    // Mock the API response
    const newApiKey = {
      id: "2",
      key: "fk_live_newapikey12345",
      created: "2023-01-02",
      status: "active",
    };
    api.createApiKey.mockResolvedValue(newApiKey);

    renderWithProviders(<ManageApiKey />);

    // Click the "Generate New API Key" button first to open the dialog
    const openDialogButton = screen.getByRole("button", {
      name: /Generate New API Key/i,
    });
    fireEvent.click(openDialogButton);

    // Wait for the dialog to be fully rendered with the Generate button
    let generateButton;
    await waitFor(() => {
      generateButton = screen.getByText("Generate");
      expect(generateButton).toBeInTheDocument();
    });

    // Now that we've confirmed the button exists, click it
    fireEvent.click(generateButton);

    // Check for success toast
    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "New API key generated successfully!"
      );
    });
  });
});
