import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewAccounts from "../../pages/viewaccounts";
import theme from "../../theme";

// Create proper mock functions for authService
const mockGetUsers = jest.fn();
const mockDeleteUser = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockGetTOTPUsers = jest.fn();

// Mock the auth service with Jest functions
jest.mock("../../services/authservice", () => ({
  __esModule: true,
  default: {
    getUsers: (...args) => mockGetUsers(...args),
    deleteUser: (...args) => mockDeleteUser(...args),
    getCurrentUser: (...args) => mockGetCurrentUser(...args),
    getTOTPUsers: (...args) => mockGetTOTPUsers(...args),
    getToken: () => "mock-token",
    isAuthenticated: () => true,
  },
}));

// Mock the toast context
const mockShowErrorToast = jest.fn();
const mockShowSuccessToast = jest.fn();

jest.mock("../../context", () => ({
  useAuth: () => ({
    user: { id: "admin123", role: "admin" },
    isAuthenticated: true,
    isFortiKeyAdmin: true,
    logout: jest.fn(),
  }),
  useToast: () => ({
    showToast: jest.fn(),
    showErrorToast: mockShowErrorToast,
    showSuccessToast: mockShowSuccessToast,
  }),
}));

// Mock MUI DataGrid with simpler implementation
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: function MockDataGrid(props) {
    return (
      <div data-testid="data-grid">
        <div data-testid="row-count">{props.rows.length}</div>
        <button
          data-testid="next-page"
          onClick={() =>
            props.onPaginationModelChange({ page: 1, pageSize: 10 })
          }
        >
          Next Page
        </button>
        <div>
          {props.rows.map((row, index) => (
            <div key={row.id || index} data-testid={`row-${row.id || index}`}>
              <span data-testid="email-cell">
                {row.email || row.externalUserId}
              </span>
              <div data-testid="created-date">
                {row.createdAt &&
                  new Date(row.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </div>
              <div data-testid="status-cell">Active</div>
              <button
                data-testid={`delete-${row.id || index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Simplified delete button click handler
                  const params = { row };
                  if (props.columns) {
                    const statusColumn = props.columns.find(
                      (col) => col.field === "status"
                    );
                    if (statusColumn && statusColumn.renderCell) {
                      const cell = statusColumn.renderCell(params);
                      // Find the delete button in the cell
                      const deleteHandler =
                        cell.props.children[1].props.onClick;
                      deleteHandler({ stopPropagation: () => {} });
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
}));

// Keep your existing MUI mocks
jest.mock("@mui/material", () => {
  return {
    Box: function MockBox(props) {
      return (
        <div data-testid="box" {...props}>
          {props.children}
        </div>
      );
    },
    useTheme: () => ({
      palette: {
        primary: { main: "#1976d2", light: "#42a5f5" },
        secondary: { main: "#9c27b0", light: "#ba68c8" },
        error: { main: "#d32f2f", light: "#ef5350" },
        background: { default: "#fff", paper: "#fff" },
        text: { primary: "#000", secondary: "#757575" },
      },
      typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h1: { fontSize: "2rem" },
        h2: { fontSize: "1.5rem" },
        body1: { fontSize: "1rem" },
      },
      spacing: (factor) => `${0.25 * factor}rem`,
    }),
    Button: function MockButton(props) {
      return (
        <button
          onClick={props.onClick}
          disabled={props.disabled}
          data-testid={
            props["data-testid"] ||
            `button-${props.children
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          }
        >
          {props.children}
        </button>
      );
    },
    Typography: function MockTypography(props) {
      return (
        <div data-testid="typography" {...props}>
          {props.children}
        </div>
      );
    },
    Dialog: function MockDialog(props) {
      return props.open ? (
        <div data-testid="dialog">{props.children}</div>
      ) : null;
    },
    DialogTitle: function MockDialogTitle(props) {
      return <div data-testid="dialog-title">{props.children}</div>;
    },
    DialogContent: function MockDialogContent(props) {
      return <div data-testid="dialog-content">{props.children}</div>;
    },
    DialogContentText: function MockDialogContentText(props) {
      return <div data-testid="dialog-text">{props.children}</div>;
    },
    DialogActions: function MockDialogActions(props) {
      return <div data-testid="dialog-actions">{props.children}</div>;
    },
    CircularProgress: function MockCircularProgress() {
      return <div data-testid="loading-spinner">Loading...</div>;
    },
    Alert: function MockAlert(props) {
      return (
        <div data-testid={`alert-${props.severity}`}>{props.children}</div>
      );
    },
    IconButton: function MockIconButton(props) {
      const ariaLabel = props["aria-label"] || "button";
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (props.onClick) props.onClick(e);
          }}
          data-testid={`icon-${ariaLabel}`}
          aria-label={ariaLabel}
        >
          {props.children}
        </button>
      );
    },
    ThemeProvider: function MockThemeProvider(props) {
      return <div>{props.children}</div>;
    },
  };
});

// Mock icons
jest.mock("@mui/icons-material/Delete", () => {
  return function MockDeleteIcon() {
    return <span data-testid="delete-icon">DeleteIcon</span>;
  };
});

// Mock the Header component
jest.mock("../../components/Header", () => {
  return function MockHeader(props) {
    return (
      <div data-testid="header">
        <h1>{props.title}</h1>
        <h2 data-testid="header-subtitle">{props.subtitle}</h2>
      </div>
    );
  };
});

describe("ViewAccounts Component", () => {
  // Define originalConsoleError inside the describe block for proper scope
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Filter out specific error messages
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === "string" &&
        (args[0].includes("Invalid API response format") ||
          args[0].includes("Warning:") ||
          args[0].includes("not wrapped in act"))
      ) {
        return;
      }
      originalConsoleError(...args);
    };
  });

  afterAll(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // ⚠️ CRITICAL FIX: This format must match exactly what your component expects
    mockGetUsers.mockImplementation(() => {
      return Promise.resolve({
        data: [
          {
            _id: "1",
            id: "1",
            externalUserId: "user1@example.com",
            email: "user1@example.com",
            createdAt: "2023-01-01",
            status: "active",
          },
          {
            _id: "2",
            id: "2",
            externalUserId: "user2@example.com",
            email: "user2@example.com",
            createdAt: "2023-01-02",
            status: "active",
          },
        ],
        total: 2,
      });
    });

    // Mock successful delete operation
    mockDeleteUser.mockResolvedValue({ success: true });

    // Mock admin user for most tests
    mockGetCurrentUser.mockResolvedValue({
      id: "admin123",
      role: "admin",
      email: "admin@example.com",
    });

    // Mock TOTP users
    mockGetTOTPUsers.mockResolvedValue({
      data: [
        {
          _id: "3",
          id: "3",
          externalUserId: "user3@example.com",
          createdAt: "2023-01-03",
        },
      ],
    });
  });

  // Test basic rendering
  test("renders the view accounts page", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("View Accounts")).toBeInTheDocument();
  });

  // Test loading state
  test("displays loading state initially", async () => {
    let resolvePromise;
    const loadingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockGetUsers.mockImplementationOnce(() => loadingPromise);

    render(
      <MemoryRouter>
        <ViewAccounts />
      </MemoryRouter>
    );

    // Check empty rows while loading
    expect(screen.getByTestId("row-count").textContent).toBe("0");

    // Now resolve the promise with data
    await act(async () => {
      resolvePromise({
        data: [
          {
            _id: "1",
            id: "1",
            externalUserId: "user1@example.com",
            email: "user1@example.com",
            createdAt: "2023-01-01",
          },
        ],
        total: 1,
      });
    });

    // After resolution, check a row is added
    expect(screen.getByTestId("row-count").textContent).toBe("1");
  });

  // Test error handling
  test("displays error message when API call fails", async () => {
    mockGetUsers.mockRejectedValueOnce(new Error("API Error"));

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Check for error alert
    expect(screen.getByTestId("alert-error")).toBeInTheDocument();
    expect(screen.getByTestId("alert-error")).toHaveTextContent(
      "Failed to load user accounts"
    );
  });

  // Test subtitle based on role
  test("shows proper subtitle for admin role", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({
      id: "admin123",
      role: "admin",
      email: "admin@example.com",
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Check for admin subtitle
    const subtitle = screen.getByTestId("header-subtitle");
    expect(subtitle.textContent).toBe("All Users");
  });

  // Test subtitle for non-admin user
  test("shows proper subtitle for non-admin role", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({
      id: "user123",
      role: "user", // Not an admin
      email: "user@example.com",
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Check for non-admin subtitle
    const subtitle = screen.getByTestId("header-subtitle");
    expect(subtitle.textContent).toBe("Your TOTP Users");
  });

  // Test pagination
  test("handles pagination correctly", async () => {
    mockGetUsers.mockClear();

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Click pagination button
    fireEvent.click(screen.getByTestId("next-page"));

    // Verify API was called a second time with page 1
    expect(mockGetUsers).toHaveBeenCalledTimes(2);
    expect(mockGetUsers).toHaveBeenLastCalledWith(1, 10);
  });

  // Test date formatting
  test("formats dates correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Check date formatting in the data grid
    const dateElements = screen.getAllByTestId("created-date");
    expect(dateElements[0].textContent).toBe("Jan 1, 2023");
  });

  // Test invalid date handling
  test("handles invalid dates gracefully", async () => {
    mockGetUsers.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          id: "1",
          externalUserId: "user1@example.com",
          email: "user1@example.com",
          createdAt: "invalid-date",
        },
      ],
      total: 1,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Invalid date should not crash, check if row is rendered
    expect(screen.getByTestId("row-1")).toBeInTheDocument();
    expect(screen.getByTestId("email-cell")).toHaveTextContent(
      "user1@example.com"
    );
  });

  // Test delete confirmation dialog
  test("opens delete dialog when delete button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Find and click delete button
    const deleteButton = screen.getByTestId("delete-1");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Check dialog appears
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  // Test delete confirmation
  test("deletes user when confirmed", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Click delete button
    const deleteButton = screen.getByTestId("delete-1");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Click confirm delete in dialog
    const confirmButton = screen.getByTestId("button-delete");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Verify the API call
    expect(mockDeleteUser).toHaveBeenCalledWith("1");
    expect(mockShowSuccessToast).toHaveBeenCalled();
  });

  // Test cancel delete
  test("closes dialog when cancel is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Click delete button
    const deleteButton = screen.getByTestId("delete-1");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Click cancel
    const cancelButton = screen.getByTestId("button-cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Verify dialog closes
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  // Test error during delete
  test("handles error during delete", async () => {
    mockDeleteUser.mockRejectedValueOnce(new Error("Delete failed"));

    await act(async () => {
      render(
        <MemoryRouter>
          <ViewAccounts />
        </MemoryRouter>
      );
    });

    // Click delete button
    const deleteButton = screen.getByTestId("delete-1");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Click confirm delete
    const confirmButton = screen.getByTestId("button-delete");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Verify error toast was called
    expect(mockShowErrorToast).toHaveBeenCalled();
  });
});
