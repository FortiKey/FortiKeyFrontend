import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { tokens } from "../../theme";

const Landing = () => {
  const navigate = useNavigate();
  const colors = tokens();

  // Extract button styling to a constant
  const primaryButtonStyle = {
    fontSize: "16px",
    padding: "12px 24px",
    "&:hover": {
      opacity: 0.9,
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: colors.otherColor.main,
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
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
          }}
        >
          Secure Key Management
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "text.secondary",
            marginBottom: "40px",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
          }}
        >
          Simplify your key management process with our secure and efficient
          solution
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/createuser")}
          sx={primaryButtonStyle}
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
  );
};

export default Landing;
