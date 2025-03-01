import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // Handle common errors
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Request failed");
      }
    } else if (error.request) {
      console.error("No response received");
    } else {
      console.error("Error setting up request", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
