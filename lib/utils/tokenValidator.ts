import axiosInstance from "@/lib/api/axiosInstance";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Validates the current tokens by making an authenticated request to the profile endpoint.
 * 
 * This function attempts to fetch the user profile using the tokens stored in the auth store.
 * The axios interceptor will automatically attempt to refresh expired tokens if needed.
 * 
 * @returns Promise<boolean> - true if tokens are valid (profile fetch succeeds), false otherwise
 * 
 * @example
 * ```typescript
 * const isValid = await validateTokens();
 * if (isValid) {
 *   // Tokens are valid, proceed with authenticated actions
 * } else {
 *   // Tokens are invalid or expired, show login form
 * }
 * ```
 */
export async function validateTokens(): Promise<boolean> {
  try {
    // Attempt to fetch the user profile
    // The axios interceptor will automatically:
    // 1. Attach the access token to the request
    // 2. Attempt token refresh if the request returns 401
    // 3. Retry the request with the new token if refresh succeeds
    const response = await axiosInstance.get("/api/auth/profile");
    
    // If we get here, the request succeeded (tokens are valid)
    return response.status === 200 && response.data?.isSuccess === true;
  } catch (error) {
    // Token validation failed - either tokens are invalid, refresh failed,
    // or there was a network/server error
    return false;
  }
}

/**
 * Checks if authentication tokens exist in the store.
 * 
 * This is a synchronous check that only verifies token presence,
 * not validity. Use validateTokens() to verify actual token validity.
 * 
 * @returns boolean - true if both access token and refresh token exist, false otherwise
 * 
 * @example
 * ```typescript
 * if (hasTokens()) {
 *   // Tokens exist in store, but may be expired
 *   const isValid = await validateTokens();
 * } else {
 *   // No tokens, show login form immediately
 * }
 * ```
 */
export function hasTokens(): boolean {
  const { accessToken, refreshToken } = useAuthStore.getState();
  return Boolean(accessToken && refreshToken);
}

/**
 * Validates the structural format of a JWT token.
 * 
 * Checks if the token:
 * - Has exactly 3 parts separated by dots (header.payload.signature)
 * - Each part is valid base64url encoded data
 * 
 * Note: This only validates the structure, not the signature or expiration.
 * Use validateTokens() for full token validation against the server.
 * 
 * @param token - The JWT token string to validate
 * @returns boolean - true if the token has valid JWT structure, false otherwise
 * 
 * @example
 * ```typescript
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
 * if (isValidTokenFormat(token)) {
 *   // Token has valid JWT structure
 * } else {
 *   // Token is malformed or corrupted
 * }
 * ```
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  // JWT tokens must have exactly 3 parts: header.payload.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  // Validate that each part is valid base64url encoded
  // Base64url uses: A-Z, a-z, 0-9, -, _ (no padding required)
  const base64urlPattern = /^[A-Za-z0-9_-]+$/;
  
  return parts.every((part) => {
    // Each part must be non-empty and match base64url pattern
    return part.length > 0 && base64urlPattern.test(part);
  });
}
