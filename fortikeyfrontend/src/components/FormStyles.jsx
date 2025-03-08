import { tokens } from "../theme";

// Initialize colors
const colors = tokens();

// Base styles that are common across all components
export const baseTextFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: colors.text.secondary,
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: colors.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.secondary.main,
    },
  },
};

// Function to generate text field styles with customizable background color
export const createTextFieldStyles = (bgColor = colors.primary.main) => ({
  ...baseTextFieldStyles,
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: colors.secondary.main,
    },
    bgcolor: bgColor,
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  "& .MuiInputLabel-shrink": {
    bgcolor: bgColor,
    paddingLeft: "5px",
    paddingRight: "5px",
  },
});

// Function to generate container styles with customizable width
export const createContainerStyles = (maxWidth = "400px") => ({
  width: "100%",
  maxWidth,
  bgcolor: colors.primary.main,
  borderRadius: "12px",
  padding: "40px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

// Various button styles
export const simpleButtonStyles = {
  fontSize: "16px",
  padding: "12px 24px",
  "&:hover": {
    opacity: 0.9,
  },
};

export const coloredButtonStyles = {
  ...simpleButtonStyles,
  backgroundColor: colors.secondary.main,
  color: colors.primary.main,
  fontWeight: "bold",
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#0069d9",
  },
};

// Select styles
export const selectStyles = {
  minWidth: 120,
};
