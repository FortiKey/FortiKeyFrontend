import { Box, useTheme, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";
import { tokens } from "../../theme";
import { ThemeProvider } from "@mui/material/styles";

const ViewAccounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let rows = mockDataTeam;
  let selectedUser = null;

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
              backgroundColor: colors.primary.main,
              padding: "20px",
              borderRadius: "4px",
              border: `1px solid ${colors.secondary.main}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <Typography variant="h3" color={colors.text.primary} sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>

            <Typography
              variant="h5"
              color={colors.text.secondary}
              sx={{ mb: 2 }}
            >
              Do you want to delete this account?
            </Typography>

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
                sx={{
                  backgroundColor: colors.secondary.main,
                  color: colors.primary.main,
                  "&:hover": {
                    backgroundColor: "#0056b3",
                  },
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
    </ThemeProvider>
  );
};

export default ViewAccounts;
