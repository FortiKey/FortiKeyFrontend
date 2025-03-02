import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import SignedOut from "../../pages/signedout";
import * as router from "react-router-dom";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock the Navbar component
jest.mock("../../components/Navbar", () => () => (
  <div data-testid="navbar">Mock Navbar</div>
));

describe("SignedOut Page", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useNavigate.mockImplementation(() => mockNavigate);
  });

  test("renders signed out page with message", () => {
    renderWithProviders(<SignedOut />);

    // Check for title and message using your actual text
    expect(screen.getByText(/You've Been Signed Out/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for using FortiKey/i)
    ).toBeInTheDocument();

    // Check for the Navbar
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("navigates to login page when Return to Login button is clicked", () => {
    renderWithProviders(<SignedOut />);

    // Click the Return to Login button (matching your actual button text)
    fireEvent.click(screen.getByRole("button", { name: /Return to Login/i }));

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("navigates to home page when Return to Home button is clicked", () => {
    renderWithProviders(<SignedOut />);

    // Click the Return to Home button
    fireEvent.click(screen.getByRole("button", { name: /Return to Home/i }));

    // Verify navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
