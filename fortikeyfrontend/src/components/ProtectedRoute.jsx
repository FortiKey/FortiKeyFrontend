import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authservice";
import { Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";

/**
 * Protected Route Component
 *
 * Secures routes by checking user authorization status.
 * Redirects unauthorized users to the specified redirect path.
 * Shows a loading indicator while checking authorization.
 *
 * @param {Object} props - Component props
 * @param {Function} props.authCheck - Function that returns a promise resolving to a boolean
 * @param {string} props.redirectPath - Path to redirect to if not authorized
 * @param {JSX.Element} props.children - Child components to render if authorized
 * @returns {JSX.Element} Protected route content or redirect
 */
const ProtectedRoute = ({
  authCheck = async () => {
    const user = await authService.getCurrentUser();
    return !!user;
  },
  redirectPath = "/login",
  children,
}) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = tokens();

  // Check authorization status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authorized = await authCheck();
        setIsAuthorized(authorized);
      } catch (error) {
        console.error("Authorization check failed:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authCheck]);

  // Show loading spinner while checking authorization
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

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if authorized
  return children;
};

export default ProtectedRoute;
