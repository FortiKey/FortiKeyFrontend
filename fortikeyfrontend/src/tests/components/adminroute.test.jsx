import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithThemeAndToast } from "../testUtils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "../../components/AdminRoute";
import authService from "../../services/authservice";

// Mock auth service with all needed methods
jest.mock("../../services/authservice", () => ({
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Add back the ProtectedRoute mock
jest.mock("../../components/ProtectedRoute", () => {
  const React = require("react");
  const { Navigate } = require("react-router-dom");

  return function MockProtectedRoute({ children, authCheck, redirectPath }) {
    // Get the mocked auth service
    const authService = require("../../services/authservice");

    // Check authentication first - if not authenticated, redirect to login
    if (!authService.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    // For admin check, check if the user is admin based on getCurrentUser
    const currentUser = authService.getCurrentUser();

    // If no current user or not admin, redirect to dashboard
    if (!currentUser || currentUser.role !== "admin") {
      return <Navigate to={redirectPath} replace />;
    }

    // User is authenticated and admin, render children
    return <>{children}</>;
  };
});

// Test components
const AdminComponent = () => (
  <div data-testid="admin-content">Admin Content</div>
);

const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const DashboardPage = () => <div data-testid="dashboard-page">Dashboard</div>;

describe("AdminRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders children when user is an admin", async () => {
    // Set up getCurrentUser to return an admin user
    authService.isAuthenticated.mockReturnValue(true);
    authService.getCurrentUser.mockReturnValue({
      id: "123",
      email: "admin@example.com",
      role: "admin",
    });

    renderWithThemeAndToast(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminComponent />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the admin check to complete
    await waitFor(() => {
      expect(screen.getByTestId("admin-content")).toBeInTheDocument();
    });
  });

  test("redirects to dashboard when user is authenticated but not an admin", async () => {
    // Set up getCurrentUser to return a non-admin user
    authService.isAuthenticated.mockReturnValue(true);
    authService.getCurrentUser.mockReturnValue({
      id: "123",
      email: "user@example.com",
      role: "user",
    });

    renderWithThemeAndToast(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminComponent />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for redirection to dashboard
    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    // Verify admin content is not rendered
    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });

  test("redirects to login when user is not authenticated", async () => {
    // Set up getCurrentUser to return null (not authenticated)
    authService.isAuthenticated.mockReturnValue(false);
    authService.getCurrentUser.mockReturnValue(null);

    renderWithThemeAndToast(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminComponent />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for redirection to login
    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    // Verify admin content is not rendered
    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
  });
});
