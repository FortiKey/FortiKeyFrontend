import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import ViewAccounts from "./pages/viewaccounts";
import CreateUser from "./pages/createuser";
import Landing from "./pages/landing";
import Login from "./pages/login";
import SignedOut from "./pages/signedout";
import ApiDocumentation from "./pages/apidocumentation";
import AdminDashboard from "./pages/admindashboard";
import ManageAPIKeys from "./pages/manageapikey";
import UsageAnalytics from "./pages/usageanalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { Box } from "@mui/material";
import { ToastProvider } from "./context";
import DemoModeIndicator from "./components/DemoModeIndicator";

/**
 * Main Application Component
 *
 * Sets up the application structure including:
 * - Theme provider for consistent styling
 * - Toast notifications for user feedback
 * - Routing configuration with public and protected routes
 * - Layout structure with sidebar and topbar for authenticated routes
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS across browsers */}
      <ToastProvider>
        <DemoModeIndicator /> {/* Provides toast notification functionality */}
        <Routes>
          {/* Public Routes - Accessible without authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/signedout" element={<SignedOut />} />

          {/* Protected Routes - Require authentication */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Sidebar /> {/* Navigation sidebar */}
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      width: { xs: "100%", md: "calc(100% - 250px)" },
                      minHeight: "100vh",
                    }}
                  >
                    <Topbar /> {/* Top navigation bar */}
                    <Routes>
                      {/* Dashboard - Main landing page after login */}
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* User management */}
                      <Route path="/viewaccounts" element={<ViewAccounts />} />

                      {/* API documentation */}
                      <Route
                        path="/apidocumentation"
                        element={<ApiDocumentation />}
                      />

                      {/* Admin-only route */}
                      <Route
                        path="/admindashboard"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />

                      {/* API key management */}
                      <Route path="/manageapikey" element={<ManageAPIKeys />} />

                      {/* Usage analytics */}
                      <Route
                        path="/usageanalytics"
                        element={<UsageAnalytics />}
                      />
                    </Routes>
                  </Box>
                </Box>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
