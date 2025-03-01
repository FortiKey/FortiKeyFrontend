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

  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      showErrorToast("Login failed. Please check your credentials.");
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
      setError("Failed to send password reset email. Please try again.");
      showErrorToast("Failed to send password reset email. Please try again.");
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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "400px",
            bgcolor: colors.primary.main,
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
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
              variant="outlined"
              sx={{
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
              }}
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
              sx={{
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
              }}
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
                "Sign In"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: "24px" }}>
            <Typography
              variant="h5"
              color={colors.text.secondary}
              sx={{ display: "inline" }}
            >
              Don't have an account?{" "}
            </Typography>
            <Button
              onClick={() => navigate("/createuser")}
              sx={{
                textTransform: "none",
                color: colors.secondary.main,
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              onClick={handleForgotPassword}
              disabled={loading}
              sx={{
                textTransform: "none",
                color: colors.secondary.main,
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
