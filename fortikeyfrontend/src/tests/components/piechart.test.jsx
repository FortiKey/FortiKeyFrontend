import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import PieChart from "../../components/PieChart";
import { mockDataTeam } from "../../data/mockdata";

// Mock Chart.js instead of recharts
jest.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="pie-chart">Mocked Pie Chart</div>,
}));

// Mock chart.js registration
jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Title: jest.fn(),
}));

// Mock the mockDataTeam import
jest.mock("../../data/mockdata", () => ({
  mockDataTeam: [
    { id: 1, authorized: true, apiKeyUsage: 50 },
    { id: 2, authorized: false, apiKeyUsage: 10 },
    { id: 3, authorized: true, apiKeyUsage: 30 },
  ],
}));

describe("PieChart Component", () => {
  test("renders chart component", () => {
    renderWithProviders(<PieChart />);

    // Check if the pie chart is rendered
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});
