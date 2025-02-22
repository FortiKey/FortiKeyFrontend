import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockDataTeam } from "../../data/mockdata";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useState } from "react";

const ViewAccounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
          disableColumnMenu
          disableExtendRowFullWidth
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              border: "none",
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

export default ViewAccounts;
