import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../../pages/admindashboard";

// Mock the auth and toast contexts
jest.mock("../../context", () => ({
  useAuth: () => ({
    user: { id: "admin123", role: "admin" },
    isAuthenticated: true,
    isFortiKeyAdmin: true,
    logout: jest.fn(),
  }),
  useToast: () => ({
    showToast: jest.fn(),
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn(),
  }),
}));

// Mock the auth service
jest.mock("../../services/authservice", () => ({
  __esModule: true,
  default: {
    getCompanies: jest.fn().mockResolvedValue([
      { id: 1, name: "Company 1", domain: "company1.com" },
      { id: 2, name: "Company 2", domain: "company2.com" },
    ]),
    getStaffByCompany: jest.fn().mockResolvedValue([]),
    deleteStaff: jest.fn().mockResolvedValue({ success: true }),
    deleteCompany: jest.fn().mockResolvedValue({ success: true }),
    revokeStaffAccess: jest.fn().mockResolvedValue({ success: true }),
    addCompany: jest.fn().mockResolvedValue({ id: 3, name: "New Company" }),
    getCurrentUser: jest.fn().mockResolvedValue({
      id: "admin123",
      role: "admin",
      isFortiKeyAdmin: true,
    }),
  },
}));

describe("AdminDashboard Component", () => {
  test("renders the loading state properly", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Check for the loading state which we know is present
    expect(screen.getByText("Loading company data...")).toBeInTheDocument();

    // Check for the loading spinner
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
