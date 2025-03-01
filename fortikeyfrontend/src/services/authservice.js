import api from "./api";

/**
 * Authentication service for handling user authentication operations
 */
class AuthService {
  /**
   * Log in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data including token
   */
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Newly created user data
   */
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Get the current logged-in user's information
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Check if user is logged in by verifying token existence
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return localStorage.getItem("token") !== null;
  }

  /**
   * Get the current authentication token
   * @returns {string|null} The authentication token or null
   */
  getToken() {
    return localStorage.getItem("token");
  }

  /**
   * Request password reset for a user
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Reset confirmation
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Reset confirmation
   */
  async resetPassword(resetData) {
    try {
      const response = await api.post("/auth/reset-password", resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
