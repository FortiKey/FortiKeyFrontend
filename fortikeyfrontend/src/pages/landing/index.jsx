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
          bgcolor: "white",
        }}
      >
        <Typography variant="h2" sx={{ textAlign: "center", mb: 5 }}>
          Why Choose FortiKey?
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {[
            {
              icon: "🔐",
              title: "Enhanced Security",
              description:
                "Protect your users with industry-standard TOTP authentication",
            },
            {
              icon: "⚡",
              title: "Easy Integration",
              description:
                "Implement 2FA in minutes with our developer-friendly API",
            },
            {
              icon: "📊",
              title: "Detailed Analytics",
              description:
                "Monitor authentication patterns and detect suspicious activities",
            },
          ].map((feature) => (
            <Box
              key={feature.title}
              sx={{
                textAlign: "center",
                maxWidth: "300px",
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h1" sx={{ mb: 2 }}>
                {feature.icon}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1">{feature.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          padding: "60px 20px",
          bgcolor: "primary.main",
        }}
      >
        <Typography
          variant="h2"
          sx={{ textAlign: "center", mb: 5, color: "neutral.main" }}
        >
          How It Works
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {[
            {
              step: "1",
              title: "Sign Up",
              description: "Create your FortiKey account and get your API keys",
            },
            {
              step: "2",
              title: "Integrate",
              description: "Add a few lines of code to your application",
            },
            {
              step: "3",
              title: "Go Live",
              description: "Your users now have secure 2FA protection",
            },
          ].map((step, index) => (
            <Box
              key={step.step}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                maxWidth: "250px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  bgcolor: "secondary.main",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  {step.step}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body1">{step.description}</Typography>

              {/* Connecting line between steps */}
              {index < 2 && (
                <Box
                  sx={{
                    position: "absolute",
                    width: { xs: "0", md: "50px" },
                    height: { xs: "50px", md: "0" },
                    borderTop: { xs: "none", md: "2px dashed #ccc" },
                    borderLeft: { xs: "2px dashed #ccc", md: "none" },
                    top: { xs: "50px", md: "25px" },
                    right: { xs: "50%", md: "-25px" },
                    display: { xs: "none", md: "block" },
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Call-to-Action Footer */}
      <Box
        sx={{
          padding: "60px 20px",
          bgcolor: "secondary.main",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ color: "white", mb: 3 }}>
          Ready to Secure Your Application?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/createuser")}
          sx={{
            fontSize: "18px",
            padding: "12px 30px",
            bgcolor: "white",
            color: "secondary.main",
            "&:hover": {
              bgcolor: "#f0f0f0",
            },
          }}
        >
          GET STARTED NOW
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
