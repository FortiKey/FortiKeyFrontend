import React from "react";
import { screen, render } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import PieChart from "../../components/PieChart";

describe("PieChart Component", () => {
  test("renders no data message when data is empty", () => {
    renderWithProviders(<PieChart chartData={{}} />);

    // Look for the no-data message
    expect(
      screen.getByText(/No data available for this time period/i)
    ).toBeInTheDocument();
  });

  test("renders chart when data is available", () => {
    // Create data in the correct format for the default "company" chartType
    const mockData = {
      successfulEvents: 75,
      failedEvents: 20,
      backupCodesUsed: 5,
    };

    renderWithProviders(<PieChart chartData={mockData} />);

    // Verify the "No data" message is NOT shown
    expect(
      screen.queryByText(/No data available for this time period/i)
    ).not.toBeInTheDocument();

    // Verify the chart title is visible
    expect(screen.getByText("Authentication Overview")).toBeInTheDocument();
  });

  test("renders loading state", () => {
    renderWithProviders(<PieChart loading={true} />);

    // Check for loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders error state", () => {
    renderWithProviders(<PieChart error="Failed to load data" />);

    // Check for error message
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });
});
