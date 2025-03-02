import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import ApiDocumentation from "../../pages/apidocumentation";

describe("API Documentation Page", () => {
  test("renders API documentation page with content sections", () => {
    renderWithProviders(<ApiDocumentation />);

    // Check page title
    expect(screen.getByText(/API Documentation/i)).toBeInTheDocument();

    // Check for the specific part titles from your component
    expect(screen.getByText(/Part 1: Getting Started/i)).toBeInTheDocument();

    // Check for download buttons
    expect(
      screen.getByText(/Download Part 1 Documentation/i)
    ).toBeInTheDocument();
  });

  test("expands accordion when clicked", () => {
    renderWithProviders(<ApiDocumentation />);

    // Find all ExpandMoreIcon elements
    const expandIcons = screen.getAllByTestId("ExpandMoreIcon");

    // Get the first accordion that's not already expanded
    const accordions = screen.getAllByRole("button", {
      name: /Part \d+:/i,
    });

    // Click an accordion to expand it if it's not already expanded
    fireEvent.click(accordions[0]);

    // Verify expanded content is visible
    expect(
      screen.getByText(/This section covers the basics/i)
    ).toBeInTheDocument();
  });
});
