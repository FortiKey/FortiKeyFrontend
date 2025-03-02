import React from "react";
import { handleApiError } from "../../utils/errorhandling";

describe("Error Handling Utilities", () => {
  const mockShowErrorToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handleApiError shows toast with error message from response", () => {
    const error = {
      response: {
        data: {
          message: "API key not found",
        },
      },
    };

    handleApiError(error, mockShowErrorToast);

    expect(mockShowErrorToast).toHaveBeenCalledWith("API key not found");
  });

  test("handleApiError shows toast with default message when no specific message exists", () => {
    const error = {
      response: {
        status: 500,
      },
    };

    handleApiError(error, mockShowErrorToast);

    expect(mockShowErrorToast).toHaveBeenCalledWith(
      expect.stringContaining("Something went wrong")
    );
  });

  test("handleApiError logs the full error to console", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const error = new Error("Test error");
    handleApiError(error, mockShowErrorToast);

    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });
});
