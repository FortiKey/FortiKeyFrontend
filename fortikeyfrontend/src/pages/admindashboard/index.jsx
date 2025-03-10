import {
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Grid2
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import authService from "../../services/authservice";
import { useToast } from "../../context";
import axios from "axios";
import config from "../../config";

/**
 * Admin Dashboard Component
 *
 * Displays and manages company and staff data for administrators.
 * Provides functionality to view, filter, and delete company and staff records.
 */
const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  // UI state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [companyDeleteDialogOpen, setCompanyDeleteDialogOpen] = useState(false);
  const [selectedCompanyToDelete, setSelectedCompanyToDelete] = useState(null);

  // Data state
  const [rows, setRows] = useState([]);

  // Loading and error states
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch companies data on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching companies...");

        const data = await authService.getCompanies();
        console.log("Companies received:", data);

        // Format data for DataGrid - Use the correct field names
        const formattedData = data.map((item) => ({
          id: item.id,
          company: item.company, // Use the company field directly from the data
          email: item.email,     // Keep the email field
          staffCount: item.staffCount
        }));

        console.log("Formatted data:", formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setError("Failed to load company data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Open staff dialog and fetch staff data for selected company
  const handleOpen = async (userId) => {
    try {
      setStaffLoading(true);
      console.log("Opening dialog for userId:", userId);
  
      // Find the selected row from the grid data
      const selectedRow = rows.find(row => row.id === userId);
      if (!selectedRow) {
        console.error("No matching row found!");
        return;
      }
  
      console.log("Selected row:", selectedRow);
  
      // Set company name for reference
      setSelectedCompany(selectedRow.company);
  
      // Fetch the detailed user profile using the email from the selected row
      try {
        // First, get the user's ID by making an additional API call
        const usersResponse = await axios.get(
          `${config.apiUrl}/admin/business-users?search=${encodeURIComponent(selectedRow.email)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(config.auth.tokenStorageKey)}`,
            },
          }
        );
  
        // Assuming the search returns a single user or the first matching user
        const userDetails = usersResponse.data.users[0];
  
        if (userDetails) {
          // Set the selected user with the correct details
          setSelectedUser({
            email: userDetails.email,
            company: userDetails.company,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            createdAt: userDetails.createdAt
          });
        } else {
          console.error("No user details found for the email");
          // Fallback to the row data
          setSelectedUser({
            email: selectedRow.email,
            company: selectedRow.company,
            firstName: "",
            lastName: "",
            createdAt: new Date().toISOString()
          });
        }
  
        setDialogOpen(true);
  
        // Fetch TOTP secrets using the correct company context
        try {
          const staffData = await authService.getStaffByCompany(userDetails?.id || userId);
          console.log("Staff data:", staffData);
  
          const formattedStaffData = staffData.map((totp, index) => ({
            id: totp.id || index + 1,
            externalUserId: totp.externalUserId,
            validated: totp.validated,
            createdAt: totp.createdAt,
            lastUsed: totp.lastUsed || "Never"
          }));
  
          setStaffData(formattedStaffData);
        } catch (staffError) {
          console.error("Failed to fetch staff data:", staffError);
          setStaffData([]); // Ensure staff data is reset
        }
  
      } catch (userError) {
        console.error("Could not fetch detailed user profile:", userError);
        showErrorToast(`Failed to load user details`);
        handleClose();
      }
  
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      showErrorToast(`Failed to load user details`);
      handleClose();
    } finally {
      setStaffLoading(false);
    }
  };




  const handleClose = () => {
    setDialogOpen(false);
    setSelectedCompany("");
    setStaffData([]);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      // Call API to delete staff member
      await authService.deleteStaff(selectedStaff.id);

      // Update local state after successful deletion
      const updatedStaffData = staffData.filter(
        (staff) => staff.id !== selectedStaff.id
      );
      setStaffData(updatedStaffData);

      // Update company staff count
      const updatedRows = rows.map((row) => {
        if (row.company === selectedCompany) {
          return {
            ...row,
            staffCount: row.staffCount - 1,
          };
        }
        return row;
      });
      setRows(updatedRows);

      showSuccessToast("Staff member deleted successfully");
    } catch (error) {
      console.error("Failed to delete staff:", error);
      showErrorToast("Failed to delete staff member");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleCompanyDeleteClick = (company) => {
    setSelectedCompanyToDelete(company);
    setCompanyDeleteDialogOpen(true);
  };
  
  const handleCompanyDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      // Call API to delete company
      await authService.deleteCompany(selectedCompanyToDelete);
  
      // Update local state after successful deletion
      const updatedRows = rows.filter(
        (row) => row.company !== selectedCompanyToDelete
      );
      setRows(updatedRows);
  
      showSuccessToast("Company deleted successfully");
    } catch (error) {
      console.error("Failed to delete company:", error);
      showErrorToast("Failed to delete company");
    } finally {
      setDeleteLoading(false);
      setCompanyDeleteDialogOpen(false);
      setSelectedCompanyToDelete(null);
    }
  };

  const columns = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "email",
      headerName: "FortiKey Users",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <div
            style={{
              cursor: "pointer",
              color: colors.text.primary,
            }}
            onClick={() => handleOpen(params.row.id)}
          >
            {params.value}
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCompanyDeleteClick(params.row.company);
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon /> {/* Make sure to import DeleteIcon from @mui/icons-material */}
          </IconButton>
        </Box>
      ),
    },
    {
      field: "staffCount",
      headerName: "Number of TOTP Users",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: ({ row: { staffCount } }) => (
        <Box height="100%" display="flex" alignItems="center">
          <Typography>{staffCount}</Typography>
        </Box>
      ),
    },
  ];

  const staffColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteClick(params.row)}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "externalUserId",
      headerName: "External User ID",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "validated",
      headerName: "Validated",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: ({ row: { validated } }) => {
        return (
          <Box
            sx={{
              backgroundColor: validated ? "#4caf50" : "#f44336",
              borderRadius: "4px",
              padding: "4px 8px",
              color: "white",
              display: "inline-block",
            }}
          >
            {validated ? "Yes" : "No"}
          </Box>
        );
      },
    },
  ];

  // Display loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 100px)",
        }}
      >
        <CircularProgress color="secondary" size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading company data...
        </Typography>
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 100px)",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: "600px" }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box m="20px">
        <Header title="Admin Dashboard" subtitle="Manage FortiKey Users" />

        <Box
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              backgroundColor: colors.primary.main,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.text.main,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary.main,
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary.main,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.primary.main,
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: colors.primary.main,
              color: colors.text.primary,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Details
            </Typography>
          </DialogTitle>
          <Box m={2}>
            {staffLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <>
                {/* User Information Section */}
                {selectedUser && (
                  <Box sx={{ mb: 4, p: 2, backgroundColor: colors.otherColor.main, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>FortiKey User Information</Typography>
                    <Grid2 container spacing={2}>
                      <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                        <Typography>{selectedUser.email}</Typography>
                      </Grid2>
                      <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Company:</Typography>
                        <Typography>{selectedUser.company}</Typography>
                      </Grid2>
                      <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Name:</Typography>
                        <Typography>{selectedUser.firstName} {selectedUser.lastName}</Typography>
                      </Grid2>
                      <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Created At:</Typography>
                        <Typography>
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
                        </Typography>
                      </Grid2>
                    </Grid2>
                  </Box>
                )}

                {/* TOTP Secrets Section */}
                <Typography variant="h6" sx={{ mb: 2 }}>TOTP Secrets</Typography>
                <DataGrid
                  rows={staffData}
                  columns={[
                    {
                      field: "externalUserId",
                      headerName: "External User ID",
                      flex: 1,
                    },
                    {
                      field: "validated",
                      headerName: "Validated",
                      flex: 0.5,
                      renderCell: ({ value }) => (
                        <Box
                          sx={{
                            backgroundColor: value ? "#4caf50" : "#f44336",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            color: "white",
                            display: "inline-block",
                          }}
                        >
                          {value ? "Yes" : "No"}
                        </Box>
                      ),
                    },
                    {
                      field: "createdAt",
                      headerName: "Created",
                      flex: 1,
                      renderCell: ({ value }) => (
                        <Typography>
                          {value ? new Date(value).toLocaleString() : "N/A"}
                        </Typography>
                      ),
                    },
                    {
                      field: "lastUsed",
                      headerName: "Last Used",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 0.5,
                      renderCell: (params) => (
                        <IconButton
                          onClick={() => handleDeleteClick(params.row)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          ×
                        </IconButton>
                      ),
                    },
                  ]}
                  pageSize={5}
                  autoHeight
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-root": {
                      border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                    },
                    "& .name-column--cell": {
                      color: colors.text.main,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.primary.main,
                      borderBottom: "none",
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
              </>
            )}
          </Box>
        </Dialog>

        {/* Staff Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
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
              Do you want to delete this TOTP user?
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteLoading}
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
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
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
                {deleteLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Delete"
                )}
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* Company Delete Confirmation Dialog */}
        <Dialog
          open={companyDeleteDialogOpen}
          onClose={() => !deleteLoading && setCompanyDeleteDialogOpen(false)}
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
              Confirm FortiKey User Delete
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
              Do you want to delete this FortiKey user and all associated TOTP users?
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                onClick={() => setCompanyDeleteDialogOpen(false)}
                disabled={deleteLoading}
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
                onClick={handleCompanyDeleteConfirm}
                disabled={deleteLoading}
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
                {deleteLoading ? (
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
}

export default AdminDashboard;
