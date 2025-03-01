import { Typography, Box } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const colors = tokens();

  return (
    <Box sx={{ mb: "30px" }}>
      <Typography variant="h2" color={colors.neutral.main} sx={{ mb: "5px" }}>
        {title}
      </Typography>
      <Typography variant="h5" color={colors.text.secondary}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
