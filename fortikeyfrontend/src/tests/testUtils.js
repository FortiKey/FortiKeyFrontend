import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastProvider } from "../context";
import { theme } from "../theme";
import { BrowserRouter } from "react-router-dom";
import { act } from "@testing-library/react";

// Silence React Router warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('React Router')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Add future flags to silence warnings
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

/**
 * Custom render function that wraps components with all necessary providers
 * including Router for components that use navigation hooks
 */
export function renderWithProviders(ui, options = {}) {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>{ui}</ToastProvider>
      </ThemeProvider>
    </BrowserRouter>,
    options
  );
}

/**
 * For tests that need to provide their own Router implementation
 * (like tests with MemoryRouter)
 */
export function renderWithThemeAndToast(ui, options = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>{ui}</ToastProvider>
    </ThemeProvider>,
    options
  );
}

/**
 * Mock implementation of useNavigate from react-router-dom
 * Returns a jest.fn() that can be used to assert navigation
 *
 * @returns {jest.Mock} - A Jest mock function
 */
export const createMockNavigate = () => jest.fn();

/**
 * Creates a mock for the authService
 *
 * @returns {Object} - A mock implementation of the auth service
 */
export function createMockAuthService() {
  return {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
  };
}

/**
 * Utility to wait for component updates
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after ms
 */
export const waitForComponentToPaint = async (ms = 0) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// Export act for easier test wrapping
export { act };

// Export all functions from RTL for convenience
export * from "@testing-library/react";
