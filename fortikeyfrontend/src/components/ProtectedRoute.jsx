import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authservice";
import { Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";

/**
 * Protected Route Component
 *
 * Secures routes by checking user authentication status.
 * Redirects unauthenticated users to the login page.
 * Shows a loading indicator while checking authentication.
 *
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route content or redirect
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = tokens();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attempt to get the current user from auth service
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user); // Convert to boolean
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: colors.primary.main,
        }}
      >
        <CircularProgress color="secondary" size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
