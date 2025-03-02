import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import Navbar from "../../components/Navbar";
import * as router from "react-router-dom";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({ pathname: "/" }),
}));

describe("Navbar Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useNavigate.mockImplementation(() => mockNavigate);
    // Ensure location mock is consistent
    router.useLocation.mockReturnValue({ pathname: "/" });
  });

  test("renders navbar with logo and navigation links", () => {
    renderWithProviders(<Navbar />);

    // Check for logo
    expect(screen.getByAltText(/FortiKey Logo/i)).toBeInTheDocument();

    // Check for FortiKey text instead of navigation links
    expect(screen.getByText(/FortiKey/i)).toBeInTheDocument();
  });

  test("navigates to login page when Login button is clicked", () => {
    renderWithProviders(<Navbar />);

    // Click the Login button
    fireEvent.click(screen.getByText(/Login/i));

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("navigates to sign up page when Get Started button is clicked", () => {
    renderWithProviders(<Navbar />);

    // Click the Get Started button (not Sign Up)
    fireEvent.click(screen.getByText(/Get Started/i));

    // Verify navigation to create user page
    expect(mockNavigate).toHaveBeenCalledWith("/createuser");
  });

  test("navigates to home page when logo is clicked", () => {
    renderWithProviders(<Navbar />);

    // Click the logo
    fireEvent.click(screen.getByAltText(/FortiKey Logo/i));

    // Verify navigation to home page
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // Add more tests as needed
});
