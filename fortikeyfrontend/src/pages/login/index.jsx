import { Box, Button, TextField, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    // TODO: Add actual login logic here
    console.log("Login attempt with:", formData);
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "otherColor.main",
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
              Welcome Back
            </Typography>

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
                      borderColor: "text.secondary",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "secondary.main",
                    },
                    bgcolor: "primary.main",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  },
                  "& .MuiInputLabel-shrink": {
                    bgcolor: "primary.main",
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
                      borderColor: "text.secondary",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "secondary.main",
                    },
                    bgcolor: "primary.main",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  },
                  "& .MuiInputLabel-shrink": {
                    bgcolor: "primary.main",
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
                sx={{
                  padding: "12px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                Sign In
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", marginTop: "24px" }}>
              <Typography
                variant="body1"
                sx={{ display: "inline", color: "text.secondary" }}
              >
                Don't have an account?{" "}
              </Typography>
              <Button
                onClick={() => navigate("/createuser")}
                sx={{
                  textTransform: "none",
                  color: "secondary.main",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
