import { Box, useTheme, Typography, Button } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ApiDocumentation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="API Documentation" />

      <Accordion defaultExpanded={true} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{ color: colors.secondary.main, fontWeight: "bold" }}
          >
            Part 1: Getting Started with FortiKey API
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 2 }}>
            This section covers the basics of getting started with the FortiKey
            API, including authentication, basic requests, and common use cases.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            component="a"
            href="/assets/apidocument1.pdf"
            download="apidocument1.pdf"
            type="application/pdf"
            sx={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
              "&:hover": {
                borderColor: colors.secondary.main,
                backgroundColor: "rgba(0, 123, 255, 0.04)",
              },
            }}
          >
            Download Part 1 Documentation
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true} sx={{ boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{ color: colors.secondary.main, fontWeight: "bold" }}
          >
            Part 2: Advanced API Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 2 }}>
            This section covers advanced features of the FortiKey API, including
            detailed endpoint references, error handling, and best practices.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            component="a"
            href="/assets/apidocument 2.pdf"
            download="apidocument 2.pdf"
            type="application/pdf"
            sx={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
              "&:hover": {
                borderColor: colors.secondary.main,
                backgroundColor: "rgba(0, 123, 255, 0.04)",
              },
            }}
          >
            Download Part 2 Documentation
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ApiDocumentation;
