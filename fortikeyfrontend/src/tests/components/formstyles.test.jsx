import React from "react";
import {
  createTextFieldStyles,
  createContainerStyles,
} from "../../components/FormStyles";

describe("FormStyles", () => {
  test("createTextFieldStyles returns valid style object", () => {
    const textFieldStyles = createTextFieldStyles();
    expect(textFieldStyles).toBeDefined();
    expect(typeof textFieldStyles).toBe("object");

    // Check that it has nested properties in a better way
    expect(Object.keys(textFieldStyles)).toContain("& .MuiInputLabel-root");
    expect(Object.keys(textFieldStyles)).toContain("& .MuiInputLabel-shrink");
  });

  test("createContainerStyles returns valid style object", () => {
    const containerStyles = createContainerStyles();
    expect(containerStyles).toBeDefined();
    expect(typeof containerStyles).toBe("object");
    expect(containerStyles.maxWidth).toBe("400px");
  });

  test("styles can be customized with parameters", () => {
    // Test custom parameter for createTextFieldStyles
    const customTextFieldStyles = createTextFieldStyles("#FF0000");
    expect(customTextFieldStyles).toBeDefined();

    // Test custom parameter for createContainerStyles
    const customContainerStyles = createContainerStyles("800px");
    expect(customContainerStyles).toHaveProperty("maxWidth", "800px");
  });
});
