import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateTokens, hasTokens, isValidTokenFormat } from "./tokenValidator";
import axiosInstance from "@/lib/api/axiosInstance";
import { useAuthStore } from "@/lib/stores/authStore";

// Mock the axios instance
vi.mock("@/lib/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock the auth store
vi.mock("@/lib/stores/authStore", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

describe("tokenValidator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validateTokens", () => {
    it("should return true when profile fetch succeeds with valid response", async () => {
      const mockAxiosGet = vi.mocked(axiosInstance.get);
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { isSuccess: true },
      });

      const result = await validateTokens();

      expect(result).toBe(true);
      expect(mockAxiosGet).toHaveBeenCalledWith("/api/auth/profile");
    });

    it("should return false when profile fetch fails with error", async () => {
      const mockAxiosGet = vi.mocked(axiosInstance.get);
      mockAxiosGet.mockRejectedValueOnce(new Error("Network error"));

      const result = await validateTokens();

      expect(result).toBe(false);
    });

    it("should return false when response status is not 200", async () => {
      const mockAxiosGet = vi.mocked(axiosInstance.get);
      mockAxiosGet.mockResolvedValueOnce({
        status: 401,
        data: { isSuccess: false },
      });

      const result = await validateTokens();

      expect(result).toBe(false);
    });

    it("should return false when response data isSuccess is false", async () => {
      const mockAxiosGet = vi.mocked(axiosInstance.get);
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { isSuccess: false },
      });

      const result = await validateTokens();

      expect(result).toBe(false);
    });

    it("should rely on axios interceptor for automatic token refresh", async () => {
      // The axios interceptor handles 401 errors and token refresh automatically
      // This test verifies that validateTokens doesn't prevent that behavior
      const mockAxiosGet = vi.mocked(axiosInstance.get);
      mockAxiosGet.mockRejectedValueOnce({ response: { status: 401 } });

      const result = await validateTokens();

      expect(result).toBe(false);
      expect(mockAxiosGet).toHaveBeenCalledWith("/api/auth/profile");
    });
  });

  describe("hasTokens", () => {
    it("should return true when both access token and refresh token exist", () => {
      const mockGetState = vi.mocked(useAuthStore.getState);
      mockGetState.mockReturnValueOnce({
        accessToken: "valid-access-token",
        refreshToken: "valid-refresh-token",
        expiresAt: null,
        profile: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      const result = hasTokens();

      expect(result).toBe(true);
    });

    it("should return false when access token is missing", () => {
      const mockGetState = vi.mocked(useAuthStore.getState);
      mockGetState.mockReturnValueOnce({
        accessToken: null,
        refreshToken: "valid-refresh-token",
        expiresAt: null,
        profile: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      const result = hasTokens();

      expect(result).toBe(false);
    });

    it("should return false when refresh token is missing", () => {
      const mockGetState = vi.mocked(useAuthStore.getState);
      mockGetState.mockReturnValueOnce({
        accessToken: "valid-access-token",
        refreshToken: null,
        expiresAt: null,
        profile: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      const result = hasTokens();

      expect(result).toBe(false);
    });

    it("should return false when both tokens are missing", () => {
      const mockGetState = vi.mocked(useAuthStore.getState);
      mockGetState.mockReturnValueOnce({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        profile: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      const result = hasTokens();

      expect(result).toBe(false);
    });

    it("should return false when access token is empty string", () => {
      const mockGetState = vi.mocked(useAuthStore.getState);
      mockGetState.mockReturnValueOnce({
        accessToken: "",
        refreshToken: "valid-refresh-token",
        expiresAt: null,
        profile: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      const result = hasTokens();

      expect(result).toBe(false);
    });
  });

  describe("isValidTokenFormat", () => {
    it("should return true for valid JWT format", () => {
      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      const result = isValidTokenFormat(validToken);

      expect(result).toBe(true);
    });

    it("should return true for JWT with base64url characters including - and _", () => {
      const validToken = "header-part_123.payload-part_456.signature-part_789";

      const result = isValidTokenFormat(validToken);

      expect(result).toBe(true);
    });

    it("should return false for token with less than 3 parts", () => {
      const invalidToken = "part1.part2";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });

    it("should return false for token with more than 3 parts", () => {
      const invalidToken = "part1.part2.part3.part4";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });

    it("should return false for token with empty parts", () => {
      const invalidToken = "part1..part3";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });

    it("should return false for null token", () => {
      const result = isValidTokenFormat(null as any);

      expect(result).toBe(false);
    });

    it("should return false for undefined token", () => {
      const result = isValidTokenFormat(undefined as any);

      expect(result).toBe(false);
    });

    it("should return false for empty string token", () => {
      const result = isValidTokenFormat("");

      expect(result).toBe(false);
    });

    it("should return false for non-string token", () => {
      const result = isValidTokenFormat(123 as any);

      expect(result).toBe(false);
    });

    it("should return false for token with invalid characters", () => {
      const invalidToken = "part1+invalid.part2/invalid.part3=invalid";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });

    it("should return false for token with spaces", () => {
      const invalidToken = "part1 with space.part2.part3";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });

    it("should return false for token with special characters", () => {
      const invalidToken = "part1@#$.part2!&*.part3%^&";

      const result = isValidTokenFormat(invalidToken);

      expect(result).toBe(false);
    });
  });
});
