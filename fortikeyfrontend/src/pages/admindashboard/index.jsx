import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";

const AdminDashboard = () => {
  const theme = useTheme();

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

  const columns = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
    },
    {
      field: "staffCount",
      headerName: "Number of Staff",
      flex: 1,
      renderCell: ({ row: { staffCount } }) => (
        <Box display="flex" alignItems="center" gap="5px">
          <Typography>{staffCount}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Admin Dashboard" subtitle="Company Staff Overview" />
      <Box height="75vh" sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
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
    </Box>
  );
};

export default AdminDashboard;
