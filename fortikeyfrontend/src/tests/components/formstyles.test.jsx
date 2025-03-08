import React from "react";
import { render } from "@testing-library/react";
import { textFieldStyle, buttonStyle } from "../../components/formstyles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

describe("Form Styles", () => {
  test("styles are defined correctly", () => {
    // Test that our styles are objects with expected properties
    expect(textFieldStyle).toBeDefined();
    expect(buttonStyle).toBeDefined();

    // Check specific properties if you know what they should be
    // For example:
    expect(textFieldStyle).toHaveProperty("marginBottom");
  });
});
