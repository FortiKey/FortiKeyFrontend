/**
 * Handles API errors consistently across the application
 * @param {Error} error - Error from API call
 * @param {Function} showErrorToast - Function to show error message
 * @param {string} defaultMessage - Default message if none from API
 * @returns {string} The error message displayed to the user
 */
export const handleApiError = (
  error,
  showErrorToast,
  defaultMessage = "Something went wrong. Please try again."
) => {
  // Log the full error to console (test expects this)
  console.error(error);

  let errorMessage = defaultMessage;

  // Handle network errors
  if (!error.response) {
    errorMessage = "Network error. Please check your connection.";
  }
  // Handle API errors with response
  else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Show the error message using the toast function
  showErrorToast(errorMessage);

  return errorMessage;
};
