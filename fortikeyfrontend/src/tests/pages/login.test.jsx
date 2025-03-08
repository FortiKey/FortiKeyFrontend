import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import Login from "../../pages/login";
import axios from "axios";

jest.mock("axios");

describe("Login Component", () => {
  test("renders the login form", () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();

    // Use getAllByDisplayValue and then filter by name attribute
    const inputs = screen.getAllByDisplayValue("");
    const emailInput = inputs.find(
      (input) => input.getAttribute("name") === "email"
    );
    const passwordInput = inputs.find(
      (input) => input.getAttribute("name") === "password"
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  test("shows error message when login fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderWithProviders(<Login />);

    // Use getAllByDisplayValue and then filter by name attribute
    const inputs = screen.getAllByDisplayValue("");
    const emailInput = inputs.find(
      (input) => input.getAttribute("name") === "email"
    );
    const passwordInput = inputs.find(
      (input) => input.getAttribute("name") === "password"
    );

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "WrongPass123!" } });

    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    // Look for "Invalid credentials" which is the actual error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
