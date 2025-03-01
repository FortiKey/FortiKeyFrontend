import { Navigate, useLocation } from "react-router-dom";
import authService from "../services/authservice";

/**
 * A wrapper component for routes that should only be accessible to authenticated users
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isLoggedIn();

  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
