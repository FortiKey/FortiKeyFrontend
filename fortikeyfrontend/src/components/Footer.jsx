import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { tokens } from "../theme";

const Footer = () => {
  const currentYear = 2025; // Changed to 2025 as requested
  const colors = tokens();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.neutral.main,
        color: colors.primary.main,
        py: { xs: 1, sm: 1.5 }, // Smaller padding on mobile
        mt: 0,
        width: "100%",
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth="lg">
        {/* Hide everything except copyright on mobile */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Grid container spacing={1} justifyContent="space-evenly">
            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 0.25 }}>
                FortiKey
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                Securing your digital future
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 0.25 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                Email: info@fortikey.com
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                Phone: (02) 9500 0000
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 0.25 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton
                  aria-label="Facebook"
                  sx={{ color: colors.primary.main, p: 0.5 }}
                  size="small"
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  sx={{ color: colors.primary.main, p: 0.5 }}
                  size="small"
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="LinkedIn"
                  sx={{ color: colors.primary.main, p: 0.5 }}
                  size="small"
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
        </Box>

        {/* Copyright text - always visible */}
        <Typography
          variant="body2"
          align="center"
          sx={{ fontSize: "0.8rem", py: 0.25 }}
        >
          &copy; {currentYear} FortiKey. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
