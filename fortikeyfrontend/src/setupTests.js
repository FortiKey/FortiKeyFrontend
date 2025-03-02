import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn().mockImplementation((key) => {
    return localStorageMock.store[key] || null;
  }),
  setItem: jest.fn().mockImplementation((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn().mockImplementation((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn().mockImplementation(() => {
    localStorageMock.store = {};
  }),
  store: {},
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });
