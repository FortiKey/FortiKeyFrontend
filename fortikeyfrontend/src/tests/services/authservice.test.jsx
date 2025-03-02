import authService from "../../services/authservice";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage between tests
    window.localStorage.clear();
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
      expect.stringContaining("/users/register"),
      userData
    );
    expect(result).toEqual({ success: true });
  });

  test("login stores tokens in localStorage on successful login", async () => {
    const credentials = {
      email: "test@example.com",
      password: "Password123!",
    };

    const mockResponse = {
      data: {
        token: "fake-token",
        user: { id: "123", email: "test@example.com" },
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    await authService.login(credentials);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      credentials
    );
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-token");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockResponse.data.user)
    );
  });

  test("logout removes tokens from localStorage", () => {
    authService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
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
