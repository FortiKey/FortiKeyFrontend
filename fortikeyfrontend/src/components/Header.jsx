import { Typography, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { tokens, theme } from "../theme";

const Header = ({ title, subtitle }) => {
  const colors = tokens();

  return (
    <ThemeProvider theme={theme}>
      <Box mb="30px">
        <Typography variant="h2" color={colors.neutral.main} sx={{ mb: "5px" }}>
          {title}
        </Typography>
        <Typography variant="h5" color={colors.text.secondary}>
          {subtitle}
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Header;
