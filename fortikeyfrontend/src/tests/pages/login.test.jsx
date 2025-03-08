import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import Login from "../../pages/Login";
import axios from "axios";

jest.mock("axios");

describe("Login Component", () => {
  test("renders the login form", () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();

    // Find inputs by name attribute
    const emailInput = screen.getByRole("textbox");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.getAttribute("name")).toBe("email");

    // For password field which isn't a textbox role
    const passwordInput = screen.getByDisplayValue("", {
      selector: 'input[name="password"]',
    });
    expect(passwordInput).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  test("shows error message when login fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderWithProviders(<Login />);

    // Find inputs
    const emailInput = screen.getByRole("textbox");
    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });

    const passwordInput = screen.getByDisplayValue("", {
      selector: 'input[name="password"]',
    });
    fireEvent.change(passwordInput, { target: { value: "WrongPass123!" } });

    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    // Check for the actual error message
    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password/i)
      ).toBeInTheDocument();
    });
  });
});
