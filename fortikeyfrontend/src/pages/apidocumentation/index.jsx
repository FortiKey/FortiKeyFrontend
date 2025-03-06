import {
  Box,
  useTheme,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useToast } from "../../context";

/**
 * API Documentation Page Component
 *
 * Provides comprehensive documentation for using the FortiKey API.
 * Features:
 * - Organized sections with expandable accordions
 * - Downloadable PDF documentation
 * - Responsive design for mobile and desktop
 * - User feedback via toast notifications
 */
const ApiDocumentation = () => {
  const theme = useTheme();
  const colors = tokens();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSuccessToast, showErrorToast } = useToast();

  /**
   * Handle documentation download
   * Shows a toast notification when download starts
   *
   * @param {number} part - The documentation part number being downloaded
   */
  const handleDownload = (part) => {
    showSuccessToast(`Documentation Part ${part} download started`);
    // No tracking call needed
  };

  return (
    <Box m={{ xs: "10px", sm: "20px" }}>
      {/* Page header */}
      <Header
        title="API Documentation"
        subtitle="How to use the FortiKey API"
      />

      {/* Getting Started documentation section */}
      <Accordion defaultExpanded={true} sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            Part 1: Getting Started with FortiKey API
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Section description */}
          <Typography sx={{ mb: 2 }}>
            This section covers the basics of getting started with the FortiKey
            API, including authentication, basic requests, and common use cases.
          </Typography>

          {/* Download button with responsive styling */}
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            component="a"
            href="/assets/apidocument1.pdf"
            download="FortiKey_API_Part1.pdf"
            type="application/pdf"
            fullWidth={isMobile}
            onClick={() => handleDownload(1)}
            sx={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
              padding: { xs: "10px 15px", sm: "8px 22px" },
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

      {/* Advanced Features documentation section */}
      <Accordion defaultExpanded={true} sx={{ boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h5"
            sx={{
              color: colors.neutral.main,
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            Part 2: Advanced API Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Section description */}
          <Typography sx={{ mb: 2 }}>
            This section covers advanced features of the FortiKey API, including
            detailed endpoint references, error handling, and best practices.
          </Typography>

          {/* Download button with responsive styling */}
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            component="a"
            href="/assets/apidocument2.pdf"
            download="FortiKey_API_Part2.pdf"
            type="application/pdf"
            fullWidth={isMobile}
            onClick={() => handleDownload(2)}
            sx={{
              color: colors.secondary.main,
              borderColor: colors.secondary.main,
              padding: { xs: "10px 15px", sm: "8px 22px" },
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
