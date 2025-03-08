import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import Dashboard from "../../pages/dashboard";
import * as router from "react-router-dom";
import apiService from "../../services/apiservice";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock authService properly
jest.mock("../../services/authservice", () => ({
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock("../../components/PieChart", () => () => (
  <div data-testid="mock-pie-chart">Pie Chart</div>
));

// Import the mocked module after mocking
import authService from "../../services/authservice";

// Mock the context to capture toast calls
const mockShowInfoToast = jest.fn();
jest.mock("../../context", () => ({
  ...jest.requireActual("../../context"),
  useToast: () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
    showInfoToast: mockShowInfoToast,
  }),
}));

// Mock API responses
jest.mock("../../services/apiservice", () => ({
  fetchUsage: jest.fn(),
  fetchSummary: jest.fn(),
}));

describe("Dashboard Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useNavigate.mockImplementation(() => mockNavigate);
    apiService.fetchUsage.mockResolvedValue({ data: [] });
    apiService.fetchSummary.mockResolvedValue({ data: {} });

    // Mock localStorage
    jest.spyOn(window.localStorage, "getItem").mockImplementation((key) => {
      if (key === "user") {
        return JSON.stringify({
          id: "123",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        });
      }
      return null;
    });
  });

  test("renders dashboard with title and navigation options", async () => {
    renderWithProviders(<Dashboard />);

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Now check for the dashboard content
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test("navigates to Manage API Keys page when button is clicked", async () => {
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    renderWithProviders(<Dashboard />);

    // Click the Manage API Keys button
    const buttons = screen.getAllByRole("button", { name: /Manage API Keys/i });
    fireEvent.click(buttons[0]);

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/manageapikey");

    // Verify toast was shown - with ANY matching text
    expect(mockShowInfoToast).toHaveBeenCalled();
  });

  test("navigates to API Documentation page when button is clicked", async () => {
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    renderWithProviders(<Dashboard />);

    // Click the API Documentation button
    const buttons = screen.getAllByRole("button", {
      name: /API Documentation/i,
    });
    fireEvent.click(buttons[0]);

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/apidocumentation");

    // Verify toast was shown - with ANY matching text
    expect(mockShowInfoToast).toHaveBeenCalled();
  });

  // This test is not needed because authentication is handled by the ProtectedRoute component
  // and tested in protectedroute.test.jsx
  // test("redirects to login page when user is not authenticated", async () => {
  //   // Mock authService directly for this test only
  //   authService.isAuthenticated.mockReturnValue(false);
  //   authService.getCurrentUser.mockReturnValue(null);
  //
  //   renderWithProviders(<Dashboard />);
  //
  //   // Verify navigation to login page
  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith("/login");
  //   });
  // });
});
