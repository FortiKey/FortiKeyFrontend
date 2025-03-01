import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authservice";
import { Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";

/**
 * Admin Route Component
 *
 * Secures routes that require admin privileges.
 * Extends authentication protection to also check for admin role.
 * Redirects non-admin users to the dashboard.
 * Shows a loading indicator while checking authorization.
 *
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if user is admin
 * @returns {JSX.Element} Admin route content, redirect, or loading indicator
 */
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colors = tokens();

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current user and check if they have admin role
        const user = await authService.getCurrentUser();
        setIsAdmin(user && user.role === "admin");
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Show loading spinner while checking admin status
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

  // Redirect to dashboard if not an admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if user is an admin
  return children;
};

export default AdminRoute;
