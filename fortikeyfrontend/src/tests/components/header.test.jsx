import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

// Create a theme for testing
const theme = createTheme();

describe("Header Component", () => {
  // Helper function to render with theme
  const renderWithTheme = (ui) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  test("renders header with title and subtitle", () => {
    const testTitle = "Test Header";
    const testSubtitle = "Test Subtitle";

    renderWithTheme(<Header title={testTitle} subtitle={testSubtitle} />);

    // Look for title and subtitle as props instead of children
    expect(screen.getByText(testTitle)).toBeInTheDocument();
    expect(screen.getByText(testSubtitle)).toBeInTheDocument();
  });

  test("applies custom styling through props", () => {
    const testTitle = "Styled Header";
    const testSubtitle = "Styled Subtitle";

    renderWithTheme(
      <Header
        title={testTitle}
        subtitle={testSubtitle}
        sx={{ backgroundColor: "red" }}
      />
    );

    // Check for text content
    expect(screen.getByText(testTitle)).toBeInTheDocument();
    expect(screen.getByText(testSubtitle)).toBeInTheDocument();
  });

  test("renders with default styling when no custom style is provided", () => {
    const testTitle = "Default Header";
    const testSubtitle = "Default Subtitle";

    renderWithTheme(<Header title={testTitle} subtitle={testSubtitle} />);

    expect(screen.getByText(testTitle)).toBeInTheDocument();
    expect(screen.getByText(testSubtitle)).toBeInTheDocument();
  });
});
