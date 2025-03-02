// This file is automatically included by Jest
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Suppress React 18 console errors about act()
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

global.IntersectionObserver = IntersectionObserverMock;

// Add these lines to mock problematic MUI components
jest.mock("@mui/material/TextField", () => (props) => <input {...props} />);
jest.mock("@mui/material/Button", () => (props) => (
  <button {...props}>{props.children}</button>
));
jest.mock("@mui/material/Dialog", () => ({ children }) => (
  <div>{children}</div>
));
