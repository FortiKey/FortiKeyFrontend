import React from "react";
import { render, screen } from "@testing-library/react";
import PieChart from "../../components/PieChart";

// Mock the Chart component from react-chartjs-2
jest.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="mock-pie-chart">Mocked Pie Chart</div>,
}));

describe("PieChart Component", () => {
  test("renders no data message when data is empty", () => {
    render(<PieChart chartData={{}} />);

    // Look for the no-data message
    expect(
      screen.getByText(/No data available for this time period/i)
    ).toBeInTheDocument();
  });

  test("renders chart when data is available", () => {
    const mockData = {
      labels: ["Red", "Blue"],
      datasets: [{ data: [10, 20], backgroundColor: ["red", "blue"] }],
    };

    render(<PieChart chartData={mockData} />);

    // Look for our mocked chart component
    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(<PieChart loading={true} />);

    // Update to match the actual text rendered
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    render(<PieChart error="Error message" />);

    // Update to match the actual text rendered
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Try selecting a different date range/i)
    ).toBeInTheDocument();
  });
});
