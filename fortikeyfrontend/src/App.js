import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import ViewAccounts from "./pages/viewaccounts";
import CreateUser from "./pages/createuser";
import GenerateQR from "./pages/generateqr";
import Landing from "./pages/landing";
import Login from "./pages/login";
import SignedOut from "./pages/signedout";
// import UsageAnalytics from "./pages/usageanalytics";
// import ApiDocumentation from "./pages/apidocumentation";
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
            <div className="app">
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/viewaccounts" element={<ViewAccounts />} />
                  <Route path="/generateqr" element={<GenerateQR />} />
                  {/* Add other dashboard routes here */}
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
