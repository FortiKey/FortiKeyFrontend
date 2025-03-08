import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import AdminDashboard from "../../pages/admindashboard";
import authService from "../../services/authservice";

// Mock the auth service
jest.mock("../../services/authservice", () => ({
  getCompanies: jest.fn(),
  getStaffByCompany: jest.fn(),
  deleteStaff: jest.fn(),
  deleteCompany: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  getCurrentUser: jest.fn().mockReturnValue({ role: "admin" }),
}));

// Mock the toast context
const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();
jest.mock("../../context", () => ({
  ...jest.requireActual("../../context"),
  useToast: () => ({
    showSuccessToast: mockShowSuccessToast,
    showErrorToast: mockShowErrorToast,
  }),
}));

// Mock data
const mockCompanies = [
  { id: "1", name: "Company 1", email: "company1@example.com", staffCount: 5 },
  { id: "2", name: "Company 2", email: "company2@example.com", staffCount: 3 },
];

const mockStaff = [
  { id: "101", name: "John Doe", externalUserId: "ext123", validated: true },
  { id: "102", name: "Jane Smith", externalUserId: "ext456", validated: false },
];

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API responses
    authService.getCompanies.mockResolvedValue(mockCompanies);
    authService.getStaffByCompany.mockResolvedValue(mockStaff);
    authService.deleteStaff.mockResolvedValue({
      message: "Staff deleted successfully",
    });
    authService.deleteCompany.mockResolvedValue({
      message: "Company deleted successfully",
    });
  });

  test("renders companies data in a grid after loading", async () => {
    renderWithProviders(<AdminDashboard />);

    // Should show loading state initially
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify companies are displayed
    expect(screen.getByText("Company 1")).toBeInTheDocument();
    expect(screen.getByText("Company 2")).toBeInTheDocument();
    expect(screen.getByText("company1@example.com")).toBeInTheDocument();
    expect(screen.getByText("company2@example.com")).toBeInTheDocument();

    // Verify API call
    expect(authService.getCompanies).toHaveBeenCalledTimes(1);
  });

  test("opens staff dialog when company name is clicked", async () => {
    renderWithProviders(<AdminDashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click on the company name
    const companyCell = screen.getByText("Company 1");
    fireEvent.click(companyCell);

    // Verify dialog is opened
    expect(screen.getByText(/Staff for Company 1/i)).toBeInTheDocument();

    // Verify staff API call was made
    expect(authService.getStaffByCompany).toHaveBeenCalledWith("Company 1");

    // Check staff data in dialog
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("deletes a staff member after confirmation", async () => {
    renderWithProviders(<AdminDashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Open staff dialog
    const companyCell = screen.getByText("Company 1");
    fireEvent.click(companyCell);

    // Wait for staff data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Find and click delete button for a staff member
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]); // Click first delete button

    // Verify delete confirmation dialog is shown
    expect(
      screen.getByText(/Are you sure you want to delete this staff member?/i)
    ).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Verify delete API call
    await waitFor(() => {
      expect(authService.deleteStaff).toHaveBeenCalled();
    });

    // Verify success toast
    expect(mockShowSuccessToast).toHaveBeenCalledWith(
      "Staff member deleted successfully"
    );
  });

  test("deletes a company after confirmation", async () => {
    renderWithProviders(<AdminDashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click delete button for a company
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]); // Click first delete button

    // Verify delete confirmation dialog is shown
    expect(
      screen.getByText(/Are you sure you want to delete this company?/i)
    ).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Verify delete API call
    await waitFor(() => {
      expect(authService.deleteCompany).toHaveBeenCalled();
    });

    // Verify success toast
    expect(mockShowSuccessToast).toHaveBeenCalledWith(
      "Company deleted successfully"
    );
  });

  test("shows error message when API call fails", async () => {
    // Mock API failure
    authService.getCompanies.mockRejectedValueOnce(
      new Error("Failed to fetch companies")
    );

    renderWithProviders(<AdminDashboard />);

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch companies/i)
      ).toBeInTheDocument();
    });

    // Verify error toast
    expect(mockShowErrorToast).toHaveBeenCalled();
  });

  test("shows empty state when no companies are found", async () => {
    // Mock empty companies response
    authService.getCompanies.mockResolvedValueOnce([]);

    renderWithProviders(<AdminDashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify empty state message
    expect(screen.getByText(/No companies found/i)).toBeInTheDocument();
  });
});
