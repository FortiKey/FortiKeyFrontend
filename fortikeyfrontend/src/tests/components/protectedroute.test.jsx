import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithThemeAndToast } from "../testUtils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import authService from "../../services/authservice";

// Mock auth service
jest.mock("../../services/authservice", () => ({
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Test component to render inside protected route
const ProtectedComponent = () => (
  <div data-testid="protected-content">Protected Content</div>
);

const LoginPage = () => <div data-testid="login-page">Login Page</div>;

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock implementation for getCurrentUser
    authService.getCurrentUser.mockImplementation(() => {
      return { id: "123", email: "test@example.com" };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders children when user is authenticated", async () => {
    // Mock successful auth check that resolves immediately
    authService.isAuthenticated.mockReturnValue(true);
    authService.getCurrentUser.mockResolvedValue({
      id: "123",
      email: "test@example.com",
    });

    renderWithThemeAndToast(
      <MemoryRouter>
        <ProtectedRoute>
          <ProtectedComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Wait for authentication check to complete
    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  test("redirects to login when user is not authenticated", async () => {
    // Set up mocks before rendering
    authService.isAuthenticated.mockReturnValue(false);
    authService.getCurrentUser.mockResolvedValue(null);

    renderWithThemeAndToast(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the authentication check to complete and redirection to occur
    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
