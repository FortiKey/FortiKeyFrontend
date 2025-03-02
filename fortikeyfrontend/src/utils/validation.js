/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Password validation
 * Checks if password has minimum requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains a number
 * - Contains a special character
 *
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;

  // Check for uppercase
  if (!/[A-Z]/.test(password)) return false;

  // Check for lowercase
  if (!/[a-z]/.test(password)) return false;

  // Check for numbers
  if (!/[0-9]/.test(password)) return false;

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

  return true;
};

/**
 * Required field validation
 * Checks if a value is provided and not empty
 *
 * @param {*} value - Value to check
 * @returns {boolean} True if valid
 */
export const validateRequired = (value) => {
  // Special handling for numbers and booleans
  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }

  return !!value && String(value).trim().length > 0;
};
