import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewAccounts from "../../pages/ViewAccounts";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

// Mock the auth context
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock the auth service
jest.mock("../../services/authService", () => ({
  authService: {
    getUsers: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

describe("ViewAccounts Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Default auth context values
    useAuth.mockReturnValue({
      user: { id: "admin123", role: "admin" },
      isFortiKeyAdmin: true,
    });

    // Setup mock data with a user entry that matches what we'll look for
    authService.getUsers.mockResolvedValue({
      data: [
        {
          id: 1,
          email: "john.doe@example.com",
          name: "John Doe", // Make sure this matches what the test looks for
          role: "user",
          company: "Test Company",
        },
      ],
      total: 1,
    });
  });

  test("renders the view accounts page", async () => {
    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Check for heading
    expect(screen.getByText("View Accounts")).toBeInTheDocument();
    expect(screen.getByText("Your TOTP Users")).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(authService.getUsers).toHaveBeenCalledTimes(1);
    });
  });

  test("displays user data in the table", async () => {
    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for the user data to be displayed
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check if API was called with correct parameters (page 0, pageSize 10)
    expect(authService.getUsers).toHaveBeenCalledWith(0, 10);
  });

  test("deletes a user after confirmation", async () => {
    authService.deleteUser.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click on user name to open delete dialog
    const userNameCell = screen.getByText("John Doe");
    fireEvent.click(userNameCell);

    // Verify dialog is opened (use the actual text from the dialog)
    await waitFor(() => {
      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Verify delete API was called
    await waitFor(() => {
      expect(authService.deleteUser).toHaveBeenCalledWith(1);
    });
  });

  test("handles pagination correctly", async () => {
    // Mock second page of data
    const secondPageData = {
      data: [{ id: 2, name: "Jane Smith", email: "jane@example.com" }],
      total: 11, // More than one page
    };

    // First call returns first page, second call returns second page
    authService.getUsers
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "John Doe", email: "john.doe@example.com" }],
        total: 11,
      })
      .mockResolvedValueOnce(secondPageData);

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Get pagination next button and click it
    const nextPageButton = screen.getByRole("button", { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Verify API call with updated page number
    // Note: MUI DataGrid uses 0-based indexing for pages
    await waitFor(() => {
      expect(authService.getUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  test("shows error message when API call fails", async () => {
    // Mock API failure
    authService.getUsers.mockRejectedValue(new Error("API Error"));

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for error state
    await waitFor(() => {
      // Use the actual error message from the component
      expect(
        screen.getByText(/Failed to load user accounts/i)
      ).toBeInTheDocument();
    });
  });

  test("shows empty state when no users are found", async () => {
    // Mock empty data response
    authService.getUsers.mockResolvedValue({
      data: [],
      total: 0,
    });

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(authService.getUsers).toHaveBeenCalled();
    });

    // Look for the "No rows" message that MUI DataGrid shows
    await waitFor(() => {
      expect(screen.getByText(/no rows/i)).toBeInTheDocument();
    });
  });

  test("disables delete functionality for non-FortiKey admins", async () => {
    // Mock user is not a FortiKey admin
    useAuth.mockReturnValue({
      user: { id: "user123", role: "admin" },
      isFortiKeyAdmin: false,
    });

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Verify that clicking user name doesn't open delete dialog for non-FortiKey admins
    const userNameCell = screen.getByText("John Doe");
    fireEvent.click(userNameCell);

    // Dialog should not appear
    expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
  });
});
