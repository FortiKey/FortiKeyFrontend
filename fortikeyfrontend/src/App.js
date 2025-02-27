import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import ViewAccounts from "./pages/viewaccounts";
import CreateUser from "./pages/createuser";
import GenerateQR from "./pages/generateqr";
import Landing from "./pages/landing";
import Login from "./pages/login";
import SignedOut from "./pages/signedout";
import ApiDocumentation from "./pages/apidocumentation";
import AdminDashboard from "./pages/admindashboard";
import ManageAPIKeys from "./pages/manageapikey";
import UsageAnalytics from "./pages/usageanalytics";
import { Box } from "@mui/material";
// import ManageAPIKeys from "./pages/manageapikeys";
// import AddUser from "./pages/adduser";
// import AdminDashboard from "./pages/admindashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/signedout" element={<SignedOut />} />

        {/* Dashboard Layout */}
        <Route
          path="/*"
          element={
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  width: { xs: "100%", md: "calc(100% - 250px)" },
                  minHeight: "100vh",
                }}
              >
                <Topbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/viewaccounts" element={<ViewAccounts />} />
                  <Route path="/generateqr" element={<GenerateQR />} />
                  <Route
                    path="/apidocumentation"
                    element={<ApiDocumentation />}
                  />
                  <Route path="/admindashboard" element={<AdminDashboard />} />
                  <Route path="/manageapikey" element={<ManageAPIKeys />} />
                  <Route path="/usageanalytics" element={<UsageAnalytics />} />
                  {/* Add other dashboard routes here */}
                </Routes>
              </Box>
            </Box>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
