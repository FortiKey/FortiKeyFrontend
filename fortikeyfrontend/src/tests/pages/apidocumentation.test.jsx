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
    expect(
      screen.getByText("1. Authentication & API Basics")
    ).toBeInTheDocument();

    // Check for download buttons - exact match to avoid case sensitivity issues
    expect(
      screen.getByText("Download Complete Documentation")
    ).toBeInTheDocument();
  });

  test("expands accordion when clicked", () => {
    renderWithProviders(<ApiDocumentation />);

    // Get the first accordion button
    const accordionButton = screen.getByText("1. Authentication & API Basics");

    // Click to expand it
    fireEvent.click(accordionButton);

    // Verify expanded content is visible - look for text that definitely exists
    expect(screen.getByText("Authentication")).toBeInTheDocument();
  });
});
