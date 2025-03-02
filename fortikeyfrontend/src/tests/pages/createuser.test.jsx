import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  createMockNavigate,
  createMockAuthService,
} from "../testUtils";
import CreateUser from "../../pages/createuser";
import * as router from "react-router-dom";
import authService from "../../services/authservice";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../services/authservice", () => ({
  register: jest.fn(),
}));

jest.mock("../../context", () => ({
  ...jest.requireActual("../../context"),
  useToast: () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
  }),
}));

describe("CreateUser Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useNavigate.mockImplementation(() => mockNavigate);
  });

  test("renders the create user form", () => {
    renderWithProviders(<CreateUser />);

    // Just check for the title and submit button to ensure the form is rendered
    expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  test("submits the form with user data", async () => {
    // Mock successful registration
    authService.register.mockResolvedValue({ success: true });

    renderWithProviders(<CreateUser />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });

    // Get all password fields and use the first one (the password field)
    const passwordFields = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordFields[0], {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Test Company" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    // Check that register was called with the correct data
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
        company: "Test Company",
      });
    });

    // Check that navigation occurred after successful registration
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows error when passwords do not match", async () => {
    renderWithProviders(<CreateUser />);

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });

    // Get all password fields and use the first one (the password field)
    const passwordFields = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordFields[0], {
      target: { value: "Password123!" },
    });

    // Use specific label for confirm password
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "DifferentPassword123!" },
    });

    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Test Company" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});
