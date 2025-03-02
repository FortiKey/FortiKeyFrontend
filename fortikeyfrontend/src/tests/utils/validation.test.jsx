import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validation";

describe("Validation Utilities", () => {
  // Email validation tests
  describe("validateEmail", () => {
    test("returns true for valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true);
    });

    test("returns false for invalid email addresses", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("test@domain")).toBe(false);
      expect(validateEmail("test.domain.com")).toBe(false);
    });
  });

  // Password validation tests
  describe("validatePassword", () => {
    test("returns true for valid passwords", () => {
      expect(validatePassword("Password123!")).toBe(true);
      expect(validatePassword("StrongP@ss1")).toBe(true);
    });

    test("returns false for passwords without uppercase letters", () => {
      expect(validatePassword("password123!")).toBe(false);
    });

    test("returns false for passwords without lowercase letters", () => {
      expect(validatePassword("PASSWORD123!")).toBe(false);
    });

    test("returns false for passwords without numbers", () => {
      expect(validatePassword("Password!")).toBe(false);
    });

    test("returns false for passwords without special characters", () => {
      expect(validatePassword("Password123")).toBe(false);
    });

    test("returns false for passwords shorter than minimum length", () => {
      expect(validatePassword("Pass1!")).toBe(false);
    });
  });

  // Required field validation tests
  describe("validateRequired", () => {
    test("returns true for non-empty values", () => {
      expect(validateRequired("test")).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
    });

    test("returns false for empty values", () => {
      expect(validateRequired("")).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });
});
