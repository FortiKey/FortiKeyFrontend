import { Box, Button, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "otherColor.main",
        }}
      >
        <Navbar />
        {/* Hero Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "secondary.main",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Secure Key Management
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "text.secondary",
              marginBottom: "40px",
            }}
          >
            Simplify your key management process with our secure and efficient
            solution
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/createuser")}
            sx={{
              fontSize: "16px",
              padding: "12px 24px",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            GET STARTED
          </Button>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            padding: "60px 20px",
            bgcolor: "primary.main",
            display: "flex",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {[
            {
              title: "Secure",
              description: "Enterprise-grade security for your keys",
            },
            {
              title: "Simple",
              description: "Easy to use interface for all users",
            },
            {
              title: "Scalable",
              description: "Grows with your organization",
            },
          ].map((feature) => (
            <Box
              key={feature.title}
              sx={{
                textAlign: "center",
                maxWidth: "300px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  marginBottom: "10px",
                  color: "neutral.main",
                }}
              >
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Landing;
