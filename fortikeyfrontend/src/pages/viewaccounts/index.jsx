import {
  Box,
  useTheme,
  Button,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";
import { tokens } from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

/**
 * View Accounts Page Component
 *
 * Provides administrative interface for managing user accounts.
 * Features:
 * - Data grid with user account information
 * - Name column with click functionality for account deletion
 * - Confirmation dialog for delete actions
 * - Visual indicators for validation status
 *
 * This component is only accessible to administrators and provides
 * basic user management capabilities.
 */
const ViewAccounts = () => {
  const theme = useTheme();
  const colors = tokens();
  const [rows, setRows] = useState(mockDataTeam);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
   * Removes the selected user from the data set and closes the dialog
   */
  const handleDelete = () => {
    setRows(rows.filter((row) => row.id !== selectedUser.id));
    setDeleteDialogOpen(false);
  };

  /**
   * Handle dialog close
   * Closes the confirmation dialog without taking action
   */
  const handleClose = () => {
    setDeleteDialogOpen(false);
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

        {/* User data grid */}
        <Box height="75vh" sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
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
              Do you want to delete this account?
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                onClick={handleClose}
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
                Delete
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ViewAccounts;
