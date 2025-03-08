import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import ViewAccounts from "../../pages/viewaccounts";
import authService from "../../services/authservice";

// Mock auth service
jest.mock("../../services/authservice", () => ({
  getUsers: jest.fn(),
  deleteUser: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  getCurrentUser: jest.fn().mockReturnValue({ role: "admin" }),
  isFortiKeyAdmin: jest.fn().mockReturnValue(true),
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
const mockUsers = {
  users: [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      company: "Company A",
      isValidated: true,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      company: "Company B",
      isValidated: false,
    },
  ],
  total: 2,
};

describe("ViewAccounts Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API responses
    authService.getUsers.mockResolvedValue(mockUsers);
    authService.deleteUser.mockResolvedValue({
      message: "User deleted successfully",
    });
  });

  test("renders user accounts in a grid after loading", async () => {
    renderWithProviders(<ViewAccounts />);

    // Should show loading state initially
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify users are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    // Verify API call was made with correct pagination
    expect(authService.getUsers).toHaveBeenCalledWith(0, 10);
  });

  test("opens delete confirmation dialog when user name is clicked", async () => {
    renderWithProviders(<ViewAccounts />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Find and click on the user name
    const userNameCell = screen.getByText("John Doe");
    fireEvent.click(userNameCell);

    // Verify dialog is opened
    expect(
      screen.getByText(/Are you sure you want to delete this user?/i)
    ).toBeInTheDocument();
  });

  test("deletes a user after confirmation", async () => {
    renderWithProviders(<ViewAccounts />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Click on user name to open delete dialog
    const userNameCell = screen.getByText("John Doe");
    fireEvent.click(userNameCell);

    // Confirm deletion
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Verify delete API call
    await waitFor(() => {
      expect(authService.deleteUser).toHaveBeenCalledWith("1");
    });

    // Verify success toast
    expect(mockShowSuccessToast).toHaveBeenCalledWith(
      "User deleted successfully"
    );
  });

  test("handles pagination correctly", async () => {
    renderWithProviders(<ViewAccounts />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Clear the mock to track new calls
    authService.getUsers.mockClear();

    // Find and click next page button
    const nextButton = screen.getByRole("button", { name: /next page/i });
    fireEvent.click(nextButton);

    // Verify API call with updated page number
    expect(authService.getUsers).toHaveBeenCalledWith(1, 10);
  });

  test("shows error message when API call fails", async () => {
    // Mock API failure
    authService.getUsers.mockRejectedValueOnce(
      new Error("Failed to fetch users")
    );

    renderWithProviders(<ViewAccounts />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
    });

    // Verify error toast
    expect(mockShowErrorToast).toHaveBeenCalled();
  });

  test("shows empty state when no users are found", async () => {
    // Mock empty users response
    authService.getUsers.mockResolvedValueOnce({ users: [], total: 0 });

    renderWithProviders(<ViewAccounts />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify empty state message
    expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  });

  test("disables delete functionality for non-FortiKey admins", async () => {
    // Mock non-FortiKey admin
    authService.isFortiKeyAdmin.mockReturnValueOnce(false);

    renderWithProviders(<ViewAccounts />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify that clicking user name doesn't open delete dialog for non-FortiKey admins
    const userNameCell = screen.getByText("John Doe");
    fireEvent.click(userNameCell);

    // Dialog should not appear
    expect(
      screen.queryByText(/Are you sure you want to delete this user?/i)
    ).not.toBeInTheDocument();
  });
});
