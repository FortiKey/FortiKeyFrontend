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
import { useToast } from "../../context";

/**
 * Login Page Component
 *
 * Provides user authentication functionality with:
 * - Email and password form
 * - Form validation
 * - Error handling
 * - Loading state management
 * - Redirect to dashboard on successful login
 */
const Login = () => {
  const navigate = useNavigate();
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  // Common form styling constants
  const formStyles = {
    textField: {
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
    },
    button: {
      fontSize: "16px",
      padding: "12px 24px",
      "&:hover": {
        opacity: 0.9,
      },
    },
    container: {
      width: "100%",
      maxWidth: "400px",
      bgcolor: colors.primary.main,
      borderRadius: "12px",
      padding: "40px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Enhanced error handling
  const handleApiError = (
    error,
    defaultMessage = "An unexpected error occurred"
  ) => {
    console.error("API Error:", error);

    let errorMessage = defaultMessage;

    // Handle network errors
    if (!error.response) {
      errorMessage = "Network error. Please check your connection.";
    }
    // Handle API errors with response
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    setError(errorMessage);
    showErrorToast(errorMessage);
    return errorMessage;
  };

  /**
   * Handle form input changes
   * Updates the form state as the user types
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * Authenticates the user and navigates to dashboard on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Attempt to log in with provided credentials
      await authService.login(formData);
      showSuccessToast("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      handleApiError(error, "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address to reset your password.");
      showErrorToast("Please enter your email address to reset your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(formData.email);
      // Show success message instead of error
      setError("Password reset link sent to your email!");
      showSuccessToast("Password reset link sent to your email!");
    } catch (err) {
      handleApiError(
        err,
        "Failed to send password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
        <Box component="form" onSubmit={handleSubmit} sx={formStyles.container}>
          <Typography
            variant="h3"
            color={colors.neutral.main}
            sx={{
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Welcome Back
          </Typography>

          {/* Display error message if there is one */}
          {error && (
            <Alert
              severity={
                error.includes("sent to your email") ? "success" : "error"
              }
              sx={{ marginBottom: "20px" }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={formStyles.textField}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={formStyles.textField}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={formStyles.button}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log In"
              )}
            </Button>

            <Button
              type="button"
              variant="text"
              color="secondary"
              onClick={handleForgotPassword}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Forgot Password?
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color={colors.text.secondary}>
                Don't have an account?{" "}
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate("/createuser")}
                  sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
