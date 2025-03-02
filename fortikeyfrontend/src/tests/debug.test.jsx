import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./testUtils";
import CreateUser from "../pages/createuser";

test("debug create user form structure", () => {
  renderWithProviders(<CreateUser />);

  // Log all form elements
  console.log(
    "All form labels:",
    screen.getAllByRole("textbox").map((el) => el.name || el.id)
  );

  // This will help you see exactly what labels are present
  console.log(
    "All label texts:",
    Array.from(document.querySelectorAll("label")).map((l) => l.textContent)
  );

  expect(true).toBe(true);
});
