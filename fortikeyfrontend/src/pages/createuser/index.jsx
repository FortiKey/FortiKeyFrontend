import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";
import authService from "../../services/authservice";
import { useToast } from "../../context";
import { validateEmail, validatePassword } from "../../utils/validation";
import {
  createTextFieldStyles,
  createContainerStyles,
  coloredButtonStyles,
} from "../../components/FormStyles";

/**
 * Create User (Registration) Page Component
 *
 * Provides user registration functionality with:
 * - Form for user details (name, email, password, company)
 * - Password confirmation and strength validation
 * - Email format validation
 * - Error handling and user feedback
 * - Loading state management
 * - Redirect to login on successful registration
 */
const CreateUser = () => {
  const navigate = useNavigate();
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  // Common form styling constants
  const formStyles = {
    textField: createTextFieldStyles(),
    button: coloredButtonStyles,
    container: createContainerStyles("500px"),
  };

  // Form state management
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
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
   * Validate form inputs before submission
   * Checks password strength, matching passwords, and email format
   *
   * @returns {boolean} True if validation passes, false otherwise
   */
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      showErrorToast("Passwords do not match");
      return false;
    }

    // Use the imported validatePassword function
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
      showErrorToast("Password doesn't meet security requirements");
      return false;
    }

    // Use the imported validateEmail function
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      showErrorToast("Please enter a valid email address");
      return false;
    }

    // Check if company is provided
    if (!formData.company.trim()) {
      setError("Please enter your company name");
      showErrorToast("Company name is required");
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * Validates inputs and registers the user if validation passes
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        company: formData.company,
      });
      showSuccessToast("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      handleApiError(error, "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: colors.otherColor.main,
        }}
      >
        {/* Navigation bar */}
        <Navbar />

        {/* Registration form container */}
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
            sx={formStyles.container}
          >
            {/* Form header */}
            <Typography
              variant="h3"
              color={colors.neutral.main}
              sx={{
                textAlign: "center",
                marginBottom: "32px",
              }}
            >
              Create an Account
            </Typography>

            {/* Error message display */}
            {error && (
              <Alert severity="error" sx={{ marginBottom: "20px" }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "20px",
                }}
              >
                {/* First name input field */}
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={formStyles.textField}
                />

                {/* Last name input field */}
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={formStyles.textField}
                />
              </Box>

              {/* Email input field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                sx={formStyles.textField}
              />

              {/* Company input field */}
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                variant="outlined"
                sx={formStyles.textField}
              />

              {/* Password input field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                sx={formStyles.textField}
              />

              {/* Confirm password input field */}
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                variant="outlined"
                sx={formStyles.textField}
              />

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={formStyles.button}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login link */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Typography variant="body1" color={colors.text.secondary}>
                  Already have an account?{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: colors.secondary.main,
                      cursor: "pointer",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CreateUser;
