import {
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  IconButton,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleOpen = (company) => {
    const filteredStaff = mockDataTeam
      .filter((staff) => staff.company === company)
      .map((staff, index) => ({
        id: index + 1,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
      }));

    setSelectedCompany(company);
    setStaffData(filteredStaff);
    setDialogOpen(true);
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

  const handleDeleteConfirm = () => {
    const updatedStaffData = staffData.filter(
      (staff) => staff.id !== selectedStaff.id
    );
    setStaffData(updatedStaffData);
    setDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  const columns = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            color: colors.text.primary,
          }}
          onClick={() => handleOpen(params.value)}
        >
          {params.value}
        </div>
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
      field: "email",
      headerName: "Email",
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      sortable: true,
      filterable: true,
    },
  ];

  // Process the data to count staff per company
  const companyStaffCount = mockDataTeam.reduce((acc, current) => {
    acc[current.company] = (acc[current.company] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for DataGrid
  const rows = Object.entries(companyStaffCount).map(
    ([company, count], index) => ({
      id: index + 1,
      company: company,
      staffCount: count,
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <Box m="20px">
        <Header title="Admin Dashboard" subtitle="Company Staff Overview" />
        <Box height="75vh" sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableExtendRowFullWidth
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

        {/* Staff List Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              bgcolor: "background.default",
              width: "60%",
              height: "60vh",
            },
          }}
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h2" color={theme.palette.neutral.main}>
                Staff List - {selectedCompany}
              </Typography>
              <IconButton onClick={handleClose}>×</IconButton>
            </Box>
          </DialogTitle>
          <Box height="calc(100% - 60px)" width="100%" p={2}>
            <DataGrid
              rows={staffData}
              columns={staffColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableExtendRowFullWidth
              getRowId={(row) => row.id}
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
        </Dialog>

        {/* Add Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
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

export default AdminDashboard;
