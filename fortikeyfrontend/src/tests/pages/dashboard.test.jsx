import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import Dashboard from "../../pages/dashboard";
import * as router from "react-router-dom";

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

describe("Dashboard Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useNavigate.mockImplementation(() => mockNavigate);
  });

  test("renders dashboard with title and navigation options", () => {
    renderWithProviders(<Dashboard />);

    // Check for title and welcome message
    expect(
      screen.getByRole("heading", { name: /Dashboard/i, level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Welcome to FortiKey Management System/i)
    ).toBeInTheDocument();

    // Check for navigation buttons
    const apiKeyButtons = screen.getAllByRole("button", {
      name: /Manage API Keys/i,
    });
    expect(apiKeyButtons.length).toBeGreaterThan(0);

    const apiDocButtons = screen.getAllByRole("button", {
      name: /API Documentation/i,
    });
    expect(apiDocButtons.length).toBeGreaterThan(0);

    const usageButtons = screen.getAllByRole("button", {
      name: /Usage Analytics/i,
    });
    expect(usageButtons.length).toBeGreaterThan(0);

    // Check for chart visualization
    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
  });

  test("navigates to Manage API Keys page when button is clicked", () => {
    renderWithProviders(<Dashboard />);

    // Click the Manage API Keys button
    const buttons = screen.getAllByRole("button", { name: /Manage API Keys/i });
    fireEvent.click(buttons[0]);

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/manageapikey");

    // Verify toast was shown - with ANY matching text
    expect(mockShowInfoToast).toHaveBeenCalled();
  });

  test("navigates to API Documentation page when button is clicked", () => {
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
