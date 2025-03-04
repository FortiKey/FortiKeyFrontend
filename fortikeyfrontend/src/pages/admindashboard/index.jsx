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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import authService from "../../services/authservice";
import { useToast } from "../../context";

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
        const data = await authService.getCompanies();

        // Format data for DataGrid
        const formattedData = data.map((company, index) => ({
          id: company.id || index + 1,
          company: company.name,
          staffCount: company.staffCount,
        }));

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
  const handleOpen = async (company) => {
    try {
      setStaffLoading(true);
      setSelectedCompany(company);
      setDialogOpen(true);

      const staffData = await authService.getStaffByCompany(company);

      // Format staff data for DataGrid
      const formattedStaffData = staffData.map((staff, index) => ({
        id: staff.id || index + 1,
        name: staff.name,
        externalUserId: staff.externalUserId,
        validated: staff.validated,
      }));

      setStaffData(formattedStaffData);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
      showErrorToast(`Failed to load staff for ${company}`);
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
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <div
            style={{
              cursor: "pointer",
              color: colors.text.primary,
            }}
            onClick={() => handleOpen(params.value)}
          >
            {params.value}
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCompanyDeleteClick(params.value);
            }}
            sx={{ color: theme.palette.error.main }}
          >
            ×
          </IconButton>
        </Box>
      ),
    },
    {
      field: "staffCount",
      headerName: "Number of Staff",
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
        <Header title="Admin Dashboard" subtitle="Manage Companies and Staff" />

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
            <Typography variant="h5" sx={{ mb: 2 }}>
              {selectedCompany} Staff
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
              <DataGrid
                rows={staffData}
                columns={staffColumns}
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
              Do you want to delete this account?
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
              Confirm Company Delete
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
              Do you want to delete this company and all its associated staff?
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
};

export default AdminDashboard;
