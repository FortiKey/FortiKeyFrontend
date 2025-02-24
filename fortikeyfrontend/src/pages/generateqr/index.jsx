import { Box, Typography, Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { useState } from "react";

const GenerateQR = () => {
  const navigate = useNavigate();
  const [qrValue] = useState("https://fortikey.com/2fa-setup");

  const handleQRClick = () => {
    navigate("/createuser");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box m="20px">
        <Box
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "neutral.main",
              }}
            >
              Generate QR
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Scan to onboard a new user with your company
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <Box
              onClick={handleQRClick}
              sx={{
                bgcolor: "primary.main",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
                },
              }}
            >
              <QRCode
                value={qrValue}
                size={256}
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </Box>

            <Button
              variant="outlined"
              color="secondary"
              sx={{
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            >
              PRINT QR CODE
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GenerateQR;
