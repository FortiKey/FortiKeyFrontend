import { Typography, Box } from "@mui/material";
import { tokens } from "../theme";

/**
 * Page header component
 *
 * A reusable component for consistent page headers throughout the application.
 * Displays a title and optional subtitle with consistent styling.
 *
 * @param {string} title - The main heading text
 * @param {string} subtitle - The optional subheading text
 * @returns {JSX.Element} A styled header with title and subtitle
 */
const Header = ({ title, subtitle }) => {
  const colors = tokens();

  return (
    <Box sx={{ mb: "30px" }}>
      {/* Main title */}
      <Typography variant="h2" color={colors.neutral.main} sx={{ mb: "5px" }}>
        {title}
      </Typography>

      {/* Subtitle - secondary text */}
      <Typography variant="h5" color={colors.text.secondary}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
