import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewAccounts from "../../pages/viewaccounts";

// Skip using renderWithThemeAndToast for now to simplify debugging
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

// Mock the auth service based on how it's imported in the component
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
  test("renders the view accounts page", async () => {
    // Use simple render instead of the utility function
    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Just look for a basic text element
    expect(screen.getByText(/View Accounts/i)).toBeInTheDocument();
  });
});
