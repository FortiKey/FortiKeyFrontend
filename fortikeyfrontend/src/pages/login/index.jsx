import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../global/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login attempt with:", formData);
    // Add login logic here
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Navbar />
      {/* Login Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              marginBottom: "30px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  backgroundColor: "#f8f9fa",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  backgroundColor: "#f8f9fa",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "secondary.main",
                  padding: "12px",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </form>

          <Box
            sx={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <Typography variant="body1">
              Don't have an account?{" "}
              <Button
                color="secondary"
                onClick={() => navigate("/createuser")}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  padding: "0 4px",
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
