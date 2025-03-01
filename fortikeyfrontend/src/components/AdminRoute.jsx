import ProtectedRoute from "./ProtectedRoute";
import authService from "../services/authservice";

/**
 * Admin Route Component
 *
 * Secures routes that require admin privileges.
 * Uses the ProtectedRoute component with admin-specific checks.
 *
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if user is admin
 * @returns {JSX.Element} Admin route content, redirect, or loading indicator
 */
const AdminRoute = ({ children }) => {
  const adminCheck = async () => {
    const user = await authService.getCurrentUser();
    return user && user.role === "admin";
  };

  return (
    <ProtectedRoute authCheck={adminCheck} redirectPath="/dashboard">
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;
