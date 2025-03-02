import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Mock the page components to simplify testing
jest.mock("../pages/landing", () => () => (
  <div data-testid="landing-page">Landing Page</div>
));
jest.mock("../pages/login", () => () => (
  <div data-testid="login-page">Login Page</div>
));
jest.mock("../pages/createuser", () => () => (
  <div data-testid="createuser-page">Create User Page</div>
));
jest.mock("../pages/signedout", () => () => (
  <div data-testid="signedout-page">Signed Out Page</div>
));
jest.mock("../pages/dashboard", () => () => (
  <div data-testid="dashboard-page">Dashboard Page</div>
));

// Mock MUI theme provider and createTheme function
jest.mock("@mui/material/styles", () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  createTheme: () => ({}),
  styled: (component) => component,
}));

// Mock CssBaseline
jest.mock("@mui/material/CssBaseline", () => () => null);

// Mock context provider to avoid theme dependency issues
jest.mock("../context", () => ({
  ToastProvider: ({ children }) => <div>{children}</div>,
  useToast: () => ({
    showSuccessToast: jest.fn(),
    showErrorToast: jest.fn(),
  }),
}));

// Completely replace the MUI material mock instead of extending it
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    // Only include the specific components we need, not the entire module
    Box: ({ children, ...props }) => <div {...props}>{children}</div>,
    IconButton: ({ children, ...props }) => (
      <button {...props}>{children}</button>
    ),
    Menu: ({ children, ...props }) => <div {...props}>{children}</div>,
    MenuItem: ({ children, ...props }) => <div {...props}>{children}</div>,
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    Typography: ({ children, ...props }) => <div {...props}>{children}</div>,
    Card: ({ children, ...props }) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
    Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
    Container: ({ children, ...props }) => <div {...props}>{children}</div>,
    AppBar: ({ children, ...props }) => <div {...props}>{children}</div>,
    Toolbar: ({ children, ...props }) => <div {...props}>{children}</div>,
    CircularProgress: () => <div data-testid="loading-spinner">Loading...</div>,
    // Include any other MUI components used in App.js
  };
});

// Add this mock for MUI X DataGrid
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows, columns }) => (
    <div data-testid="mock-data-grid">
      Mock DataGrid with {rows.length} rows and {columns.length} columns
    </div>
  ),
}));

// And also add the complete MUI material mock
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }) => <div {...props}>{children}</div>,
  Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Paper: ({ children, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  IconButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  CssBaseline: () => null,
  useTheme: () => ({ palette: { mode: "light" } }),
}));

// Write the actual tests
describe("App Component", () => {
  test("renders landing page by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
  });

  test("renders login page when navigating to /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  test("renders create user page when navigating to /createuser", () => {
    render(
      <MemoryRouter initialEntries={["/createuser"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("createuser-page")).toBeInTheDocument();
  });

  test("renders signed out page when navigating to /signedout", () => {
    render(
      <MemoryRouter initialEntries={["/signedout"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("signedout-page")).toBeInTheDocument();
  });
});
