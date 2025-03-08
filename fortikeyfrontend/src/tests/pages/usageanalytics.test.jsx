import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import UsageAnalytics from "../../pages/usageanalytics";
import apiService from "../../services/apiservice";

// Mock the PieChart component to avoid chart.js canvas issues
jest.mock(
  "../../components/PieChart",
  () =>
    ({ chartType, chartData, loading, error }) =>
      (
        <div data-testid="mock-pie-chart">
          <div data-testid="chart-type">{chartType}</div>
          <div data-testid="chart-loading">
            {loading ? "loading" : "not-loading"}
          </div>
          <div data-testid="chart-error">{error || "no-error"}</div>
          <pre data-testid="chart-data">
            {JSON.stringify(chartData, null, 2).substring(0, 100)}
          </pre>
        </div>
      )
);

// Mock the context to capture toast calls
const mockShowSuccessToast = jest.fn();
const mockShowErrorToast = jest.fn();
jest.mock("../../context", () => ({
  ...jest.requireActual("../../context"),
  useToast: () => ({
    showSuccessToast: mockShowSuccessToast,
    showErrorToast: mockShowErrorToast,
  }),
}));

// Mock API service methods
jest.mock("../../services/apiservice", () => ({
  getTOTPStats: jest.fn().mockResolvedValue({
    summary: {
      totalSetups: 100,
      totalValidations: 500,
      setupSuccessRate: "95%",
      validationSuccessRate: "98%",
      totalBackupCodesUsed: 25,
    },
    dailyStats: [{ date: "2023-01-01", validations: 50, successful: 49 }],
  }),
  getFailureAnalytics: jest.fn().mockResolvedValue({
    totalEvents: 500,
    totalFailures: 10,
    failureRate: "2%",
    failures: [
      { _id: { eventType: "Invalid Token" }, count: 6 },
      { _id: { eventType: "Expired Token" }, count: 4 },
    ],
  }),
  getDeviceBreakdown: jest.fn().mockResolvedValue({
    deviceTypes: {
      Mobile: 300,
      Desktop: 200,
    },
    browsers: {
      Chrome: 250,
      Firefox: 150,
      Safari: 100,
    },
  }),
  getCompanyStats: jest.fn().mockResolvedValue({
    summary: {
      totalEvents: 500,
      successfulEvents: 490,
      failedEvents: 10,
      successRate: "98%",
    },
  }),
  getBackupCodeUsage: jest.fn().mockResolvedValue({
    backupCount: 25,
    totpCount: 475,
  }),
}));

describe("UsageAnalytics Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    jest.spyOn(window.localStorage, "getItem").mockImplementation((key) => {
      if (key === "user") {
        return JSON.stringify({
          id: "123",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        });
      }
      return null;
    });
  });

  test("renders analytics page with loading state then content", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Initially should show loading state
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify page title and chart
    expect(screen.getByText(/Usage Analytics/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Usage and Authorization Overview/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();

    // Verify API calls were made with period=30 (default)
    expect(apiService.getTOTPStats).toHaveBeenCalledWith(
      { period: "30" },
      false
    );
    expect(apiService.getFailureAnalytics).toHaveBeenCalledWith(
      { period: "30" },
      false
    );
    expect(apiService.getDeviceBreakdown).toHaveBeenCalledWith(
      { period: "30" },
      false
    );
  });

  test("changes time range when dropdown is changed", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for initial loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Find the time range dropdown and change its value
    const timeRangeSelect = screen.getByLabelText(/Time Range/i);
    fireEvent.mouseDown(timeRangeSelect);

    // Select 7 day option
    const option = screen.getByText("Last 7 Days");
    fireEvent.click(option);

    // Verify API calls were made with new period
    expect(apiService.getTOTPStats).toHaveBeenCalledWith({ period: "7" }, true);
    expect(apiService.getFailureAnalytics).toHaveBeenCalledWith(
      { period: "7" },
      true
    );
    expect(apiService.getDeviceBreakdown).toHaveBeenCalledWith(
      { period: "7" },
      true
    );
  });

  test("changes chart type when dropdown is changed", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for initial loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Find the chart type dropdown and change its value
    const chartTypeSelect = screen.getByLabelText(/Chart Type/i);
    fireEvent.mouseDown(chartTypeSelect);

    // Select Device Types option
    const option = screen.getByText("Device Types");
    fireEvent.click(option);

    // Verify chart type is passed to the PieChart component
    await waitFor(() => {
      expect(screen.getByTestId("chart-type").textContent).toBe("devices");
    });

    // Verify the device breakdown data was loaded
    expect(apiService.getDeviceBreakdown).toHaveBeenCalled();
  });

  test("refreshes data when refresh button is clicked", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for initial loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Reset mocks to clearly see the refresh calls
    jest.clearAllMocks();

    // Find and click refresh button (using the tooltip text)
    const refreshButton = screen.getByRole("button", {
      name: /refresh data/i,
    });
    fireEvent.click(refreshButton);

    // Verify API calls were made with force=true
    expect(apiService.getTOTPStats).toHaveBeenCalledWith(
      { period: "30" },
      true
    );
    expect(apiService.getFailureAnalytics).toHaveBeenCalledWith(
      { period: "30" },
      true
    );
    expect(apiService.getDeviceBreakdown).toHaveBeenCalledWith(
      { period: "30" },
      true
    );

    // Verify success toast was shown
    await waitFor(() => {
      expect(mockShowSuccessToast).toHaveBeenCalledWith(
        "Analytics data refreshed successfully"
      );
    });
  });

  test("shows error message when API call fails", async () => {
    // Mock API failure just for this test
    apiService.getTOTPStats.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<UsageAnalytics />);

    // Wait for error to appear
    await waitFor(
      () => {
        expect(
          screen.getByText(/Unable to load analytics data/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify error toast was shown
    expect(mockShowErrorToast).toHaveBeenCalledWith(
      "Failed to load analytics data"
    );
  });

  test("displays device usage breakdown when data is available", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check if device breakdown section is displayed
    expect(screen.getByText(/Device Usage Breakdown/i)).toBeInTheDocument();

    // Check if the device types are displayed
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  test("displays browser usage breakdown when data is available", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check if browser section is displayed
    expect(screen.getByText(/Browser Usage/i)).toBeInTheDocument();

    // Check if the browsers are displayed
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
  });

  test("handles auth methods chart type correctly", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for initial loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Reset mocks
    jest.clearAllMocks();

    // Change to Auth Methods chart type
    const chartTypeSelect = screen.getByLabelText(/Chart Type/i);
    fireEvent.mouseDown(chartTypeSelect);
    const option = screen.getByText("Authentication Methods");
    fireEvent.click(option);

    // Verify correct API calls were made
    expect(apiService.getTOTPStats).toHaveBeenCalled();
    expect(apiService.getBackupCodeUsage).toHaveBeenCalled();

    // Verify chart type is passed to PieChart
    await waitFor(() => {
      expect(screen.getByTestId("chart-type").textContent).toBe("auth");
    });
  });

  test("handles failure reasons chart type correctly", async () => {
    renderWithProviders(<UsageAnalytics />);

    // Wait for initial loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Reset mocks
    jest.clearAllMocks();

    // Change to Failure Reasons chart type
    const chartTypeSelect = screen.getByLabelText(/Chart Type/i);
    fireEvent.mouseDown(chartTypeSelect);
    const option = screen.getByText("Failure Reasons");
    fireEvent.click(option);

    // Verify correct API call was made
    expect(apiService.getFailureAnalytics).toHaveBeenCalled();

    // Verify chart type is passed to PieChart
    await waitFor(() => {
      expect(screen.getByTestId("chart-type").textContent).toBe("failures");
    });
  });

  test("shows last refresh time indicator", async () => {
    // Mock date
    const mockDate = new Date("2023-01-01T12:00:00Z");
    const realDate = Date;
    global.Date = class extends Date {
      constructor() {
        return mockDate;
      }
      static now() {
        return mockDate.getTime();
      }
    };

    renderWithProviders(<UsageAnalytics />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check if last updated text is displayed
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();

    // Restore original Date
    global.Date = realDate;
  });
});
