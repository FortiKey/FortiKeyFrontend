import {
  Box,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";

const ViewAccounts = () => {
  const theme = useTheme();
  let rows = mockDataTeam;
  let selectedUser = null;
  let dialogOpen = false;

  const handleNameClick = (user) => {
    selectedUser = user;
    const dialog = document.getElementById("confirmDialog");
    if (dialog) {
      dialog.style.display = "block";
    }
  };

  const handleDelete = () => {
    rows = rows.filter((row) => row.id !== selectedUser.id);
    const dialog = document.getElementById("confirmDialog");
    if (dialog) {
      dialog.style.display = "none";
    }
  };

  const handleClose = () => {
    const dialog = document.getElementById("confirmDialog");
    if (dialog) {
      dialog.style.display = "none";
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: theme.palette.text.primary,
          }}
          onClick={() => handleNameClick(params.row)}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
  ];
  return (
    <Box m="20px">
      <Header title="View Accounts" subtitle="Manage Accounts" />
      <Box height="75vh" sx={{ width: "100%" }}>
        <DataGrid
          rows={mockDataTeam}
          columns={columns}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary.main,
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
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

      {/* Custom Dialog */}
      <div
        id="confirmDialog"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: theme.palette.primary.main,
            padding: "20px",
            borderRadius: "4px",
            border: `1px solid ${theme.palette.secondary.main}`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "300px",
            textAlign: "center",
          }}
        >
          <h2
            style={{ color: theme.palette.text.primary, margin: "0 0 20px 0" }}
          >
            Confirm Delete
          </h2>
          <p
            style={{
              color: theme.palette.text.secondary,
              margin: "0 0 20px 0",
            }}
          >
            Do you want to delete this account?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={handleClose}
              variant="contained"
              style={{
                backgroundColor: theme.palette.secondary.main,
                color: "#ffffff",
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ViewAccounts;
