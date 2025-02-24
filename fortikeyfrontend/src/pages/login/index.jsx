import { Box, Button, TextField, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";
const Login = () => {
  const navigate = useNavigate();
  const colors = tokens();
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
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
