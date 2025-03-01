import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../services/authservice";

/**
 * A wrapper component for routes that should only be accessible to FortiKey staff
 * Redirects to dashboard if user is not a FortiKey staff member
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [isFortiKeyStaff, setIsFortiKeyStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await authService.getCurrentUser();
        // Assuming your user object has a role or isFortiKeyStaff property
        setIsFortiKeyStaff(user?.isFortiKeyStaff || user?.role === "admin");
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsFortiKeyStaff(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isFortiKeyStaff) {
    // Redirect to dashboard if not a FortiKey staff member
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
