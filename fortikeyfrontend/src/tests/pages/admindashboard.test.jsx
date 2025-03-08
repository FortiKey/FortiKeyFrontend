import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../../pages/admindashboard";

// Mock the auth context
jest.mock("../../context", () => ({
  useAuth: () => ({
    user: { id: "admin123", role: "admin" },
    isAuthenticated: true,
    isFortiKeyAdmin: true,
    logout: jest.fn(),
  }),
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Very important: match the import structure used in the component
jest.mock("../../services/authservice", () => ({
  __esModule: true,
  default: {
    getCompanies: jest.fn().mockResolvedValue([
      { id: 1, name: "Company 1", domain: "company1.com" },
      { id: 2, name: "Company 2", domain: "company2.com" },
    ]),
    getStaffByCompany: jest.fn().mockResolvedValue([
      { id: 1, name: "Staff 1", email: "staff1@company1.com" },
      { id: 2, name: "Staff 2", email: "staff2@company1.com" },
    ]),
    deleteStaff: jest.fn().mockResolvedValue({ success: true }),
    deleteCompany: jest.fn().mockResolvedValue({ success: true }),
    revokeStaffAccess: jest.fn().mockResolvedValue({ success: true }),
    addCompany: jest.fn().mockResolvedValue({ id: 3, name: "New Company" }),
  },
}));

describe("AdminDashboard Component", () => {
  test("renders the admin dashboard", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Just look for basic text that should be there
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });
});
