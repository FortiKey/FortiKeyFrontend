import {
  Box,
  useTheme,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authservice";
import { useToast } from "../../context";

/**
 * View Accounts Page Component
 *
 * Provides administrative interface for managing user accounts.
 * Features:
 * - Data grid with user account information from backend API
 * - Name column with click functionality for account deletion
 * - Confirmation dialog for delete actions
 * - Visual indicators for validation status
 * - Loading and error states
 * - Server-side pagination
 */
const ViewAccounts = () => {
  const theme = useTheme();
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  // State management
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [isFortiKeyUser, setIsFortiKeyUser] = useState(false);
  const [currentUserCompany, setCurrentUserCompany] = useState("");

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  /**
   * Fetch users from the backend API
   * Uses pagination parameters for server-side pagination
   * Filters users by company if not a FortiKey user
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { page, pageSize } = paginationModel;
      const response = await authService.getUsers(page, pageSize);

      // If not FortiKey user, filter the response to only include users from same company
      if (!isFortiKeyUser) {
        const filteredData = response.data.filter((user) => {
          const userCompany = user?.organization || user?.company || "";
          return userCompany === currentUserCompany;
        });
        setRows(filteredData);
        // Adjust total count for pagination
        setRowCount(filteredData.length);
      } else {
        // FortiKey users can see all users
        setRows(response.data);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Unable to load user accounts. Please try again.");
      showErrorToast("Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, isFortiKeyUser, currentUserCompany, showErrorToast]);

  // Fetch users when component mounts, pagination changes, or company status changes
  useEffect(() => {
    // Only fetch once we have the user's company information
    if (currentUserCompany || currentUserCompany === "") {
      fetchUsers();
    }
  }, [fetchUsers, currentUserCompany]);

  // Replace the useEffect that checks user organization
  useEffect(() => {
    // Check if the user has admin role
    const checkUserRole = async () => {
      try {
        const user = await authService.getCurrentUser();

        // Check for admin role instead of company name
        setIsFortiKeyUser(user?.role === "admin");

        // Still keep company name for filtering non-admin views
        const userCompany = user?.organization || user?.company || "";
        setCurrentUserCompany(userCompany);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsFortiKeyUser(false);
        setCurrentUserCompany("");
      }
    };

    checkUserRole();
  }, []);

  /**
   * Handle name column click
   * Sets the selected user and displays the confirmation dialog
   *
   * @param {Object} user - The user that was clicked
   */
  const handleNameClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  /**
   * Handle delete confirmation
   * Calls the API to delete the user and updates the UI on success
   */
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeletingUser(true);
      await authService.deleteUser(selectedUser.id);

      // Update the local state by refetching
      await fetchUsers();

      showSuccessToast(`User ${selectedUser.name} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      showErrorToast("Failed to delete user. Please try again.");
    } finally {
      setDeletingUser(false);
      setDeleteDialogOpen(false);
    }
  };

  /**
   * Handle dialog close
   * Closes the confirmation dialog without taking action
   */
  const handleClose = () => {
    if (!deletingUser) {
      setDeleteDialogOpen(false);
    }
  };

  /**
   * DataGrid column definitions
   * Configures the display and behavior of each column
   */
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: colors.text.primary,
          }}
          onClick={() => handleNameClick(params.row)}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "externalUserId",
      headerName: "External User ID",
      flex: 1,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      valueGetter: (params) =>
        params.row.organization || params.row.company || "Unknown",
    },
    {
      field: "validated",
      headerName: "Validated",
      flex: 1,
      renderCell: (params) => (
        <div style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Yes" : "No"}
        </div>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box m="20px">
        {/* Page header */}
        <Header title="View Accounts" subtitle="Manage Accounts" />

        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* User data grid */}
        <Box height="75vh" sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            rowCount={rowCount}
            loading={loading}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary.main,
                borderBottom: `1px solid ${colors.secondary.main}`,
              },
              "& .MuiDataGrid-virtualScroller": {
                border: "none",
              },
              "& .MuiDataGrid-footerContainer": {
                border: "none",
              },
              "& .MuiDataGrid-row": {
                border: "none",
              },
            }}
          />
        </Box>

        {/* Material UI Dialog for confirmation */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleClose}
          PaperProps={{
            style: {
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              maxWidth: "400px",
              border: `1px solid ${theme.palette.secondary.main}`,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#007FFF",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Confirm Delete
            </Typography>
          </DialogTitle>
          <Box p={2}>
            <Typography
              sx={{
                textAlign: "center",
                mb: 3,
                color: "rgba(0, 0, 0, 0.7)",
                fontSize: "16px",
              }}
            >
              {selectedUser && (
                <>
                  Do you want to delete the account for{" "}
                  <strong>{selectedUser.name}</strong>? This action cannot be
                  undone.
                </>
              )}
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                onClick={handleClose}
                disabled={deletingUser}
                sx={{
                  backgroundColor: "#007FFF",
                  color: "white",
                  padding: "6px 16px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#0066CC" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deletingUser}
                sx={{
                  backgroundColor: "#DC3545",
                  color: "white",
                  padding: "6px 16px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#C82333" },
                }}
              >
                {deletingUser ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Delete"
                )}
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ViewAccounts;
