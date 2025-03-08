import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewAccounts from "../../pages/viewaccounts";

// Mock the toast context with the correct function name
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
    getUsers: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Test User 1",
          email: "user1@test.com",
          status: "active",
        },
        {
          id: 2,
          name: "Test User 2",
          email: "user2@test.com",
          status: "inactive",
        },
      ],
      total: 2,
    }),
    deleteUser: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe("ViewAccounts Component", () => {
  test("renders the view accounts page", () => {
    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Just check for a basic element that should be there
    expect(screen.getByText(/View Accounts/i)).toBeInTheDocument();
  });
});
