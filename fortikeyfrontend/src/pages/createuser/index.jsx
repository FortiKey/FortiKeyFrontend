import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../global/Navbar";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add validation to ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Add actual registration logic here
    console.log("Registration attempt with:", formData);
    navigate("/dashboard");
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e0e0e0",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#007BFF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#007BFF",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "#007BFF",
      },
      backgroundColor: "white",
      paddingLeft: "5px",
      paddingRight: "5px",
    },
    "& .MuiInputLabel-shrink": {
      backgroundColor: "white",
      paddingLeft: "5px",
      paddingRight: "5px",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              marginBottom: "32px",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            Create Account
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
                sx={textFieldStyles}
              />
            </Box>

            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              variant="outlined"
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="outlined"
              sx={textFieldStyles}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "12px",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Create Account
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: "24px" }}>
            <Typography
              variant="body1"
              sx={{ display: "inline", color: "#666" }}
            >
              Already have an account?{" "}
            </Typography>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                color: "#007BFF",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateUser;
