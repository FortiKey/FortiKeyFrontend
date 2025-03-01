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

const CreateUser = () => {
  const navigate = useNavigate();
  const colors = tokens();
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      showErrorToast("Passwords do not match");
      return false;
    }

    // Check password strength (at least 8 characters, including a number and special character)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include at least one number and one special character"
      );
      showErrorToast("Password doesn't meet security requirements");
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      showErrorToast("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      showSuccessToast("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        showErrorToast(error.response.data.message);
      } else {
        setError("Failed to create account. Please try again.");
        showErrorToast("Failed to create account. Please try again.");
      }
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
              Create an Account
            </Typography>

            {/* Display error message if there is one */}
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
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
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
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
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
              </Box>

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

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
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
                  "Create Account"
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", marginTop: "24px" }}>
              <Typography
                variant="h5"
                color={colors.text.secondary}
                sx={{ display: "inline" }}
              >
                Already have an account?{" "}
              </Typography>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  textTransform: "none",
                  color: colors.secondary.main,
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
    </ThemeProvider>
  );
};

export default CreateUser;
