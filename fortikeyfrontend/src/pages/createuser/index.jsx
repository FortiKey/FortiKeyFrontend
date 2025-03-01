import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";
import authService from "../../services/authservice";

const CreateUser = () => {
  const navigate = useNavigate();
  const colors = tokens();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare user data for registration
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
      };

      // Register the user
      await authService.register(userData);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        if (err.response.status === 409) {
          setError(
            "This email is already registered. Please use a different email or try logging in."
          );
        } else {
          setError(
            err.response.data?.message ||
              "Registration failed. Please try again."
          );
        }
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: colors.text.secondary,
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: colors.secondary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.secondary.main,
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: colors.secondary.main,
      },
      bgcolor: colors.primary.main,
      paddingLeft: "5px",
      paddingRight: "5px",
    },
    "& .MuiInputLabel-shrink": {
      bgcolor: colors.primary.main,
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
        bgcolor: colors.otherColor.main,
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
            bgcolor: "primary.main",
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
              color: "neutral.main",
            }}
          >
            Create Account
          </Typography>

          {/* Display error message if there is one */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: "20px" }}>
              {error}
            </Alert>
          )}

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
              color="secondary"
              disabled={loading}
              sx={{
                padding: "12px",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: "24px" }}>
            <Typography
              variant="body1"
              sx={{ display: "inline", color: "text.secondary" }}
            >
              Already have an account?{" "}
            </Typography>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                color: "secondary.main",
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
