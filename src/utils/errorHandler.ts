import type { ApiErrorResponse } from "../types";

/**
 * Extracts error message from API error response
 * @param error - The error object from catch block
 * @param defaultMessage - Default message if no error message is found
 * @returns The error message string
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "An error occurred"
): string => {
  const err = error as ApiErrorResponse;
  return err.response?.data?.message || defaultMessage;
};
