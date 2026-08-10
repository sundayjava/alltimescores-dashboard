import { ApiError } from "@/types/auth";

export function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.response?.data?.message || "An unexpected error occurred. Please try again.";
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    return "An unexpected error occurred. Please try again.";
}

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as ApiError).response === "object"
    );
}

import { AxiosError } from "axios";

/**
 * Extracts a human-readable message from an Axios error response.
 * Falls back to a generic message if the server didn't return one.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    // Try common server error shapes
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (typeof data === "string") return data;

    // HTTP status fallbacks
    if (error.response?.status === 400) return "Invalid request.";
    if (error.response?.status === 403) return "You don't have permission to do this.";
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status === 409) return "A conflict occurred.";
  }

  return fallback;
}
