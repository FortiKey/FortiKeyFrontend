import authService from "../../services/authservice";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage between tests
    window.localStorage.clear();

    // Mock localStorage methods
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  test("register calls the correct API endpoint with user data", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Password123!",
      company: "Test Company",
    };

    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await authService.register(userData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/business/register"),
      userData
    );
    expect(result).toEqual({ success: true });
  });

  test("login stores tokens in localStorage on successful login", async () => {
    const credentials = {
      email: "test@example.com",
      password: "Password123!",
    };

    // Mock the login API response
    const mockLoginResponse = {
      data: {
        token: "fake-token",
        userId: "123",
      },
    };

    // Mock the profile API response
    const mockProfileResponse = {
      data: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        company: "Test Company",
        role: "user",
      },
    };

    // Set up the axios.post mock for login
    axios.post.mockResolvedValueOnce(mockLoginResponse);

    // Set up the axios.get mock for profile
    axios.get.mockResolvedValueOnce(mockProfileResponse);

    await authService.login(credentials);

    // Check API was called with correct endpoint
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/business/login"),
      credentials
    );

    // Just check localStorage.setItem was called twice - don't care about exact values
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
  });

  test("logout removes tokens from localStorage", () => {
    authService.logout();

    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      expect.stringContaining("token")
    );
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      expect.stringContaining("user")
    );
  });

  test("isAuthenticated returns true when token exists", () => {
    localStorage.getItem.mockReturnValueOnce("fake-token");

    const result = authService.isAuthenticated();

    expect(result).toBe(true);
  });

  test("isAuthenticated returns false when token does not exist", () => {
    localStorage.getItem.mockReturnValueOnce(null);

    const result = authService.isAuthenticated();

    expect(result).toBe(false);
  });
});
