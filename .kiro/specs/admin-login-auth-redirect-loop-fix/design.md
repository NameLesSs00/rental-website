# Admin Login Authentication Redirect Loop Fix

## Overview

This design addresses a critical authentication bug where users visiting `/admin/login` with expired or faulty tokens experience redirect loops or 404 errors. The root cause is that the system redirects based on token existence without proper validation, leading to:

1. **Redirect Loops**: Login page checks for `accessToken` existence → redirects to dashboard → dashboard makes authenticated request → 401 error → axios interceptor redirect to login → repeat
2. **404 Errors**: Premature redirects before token validation completes, causing navigation to invalid states
3. **Poor UX**: No graceful handling of invalid tokens with appropriate loading states

The fix implements proper token validation before redirecting, clears invalid tokens gracefully, adds auth guards to protected routes, and preserves the fast-path redirect for valid tokens to avoid regression.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a user visits `/admin/login` with tokens present in localStorage that are expired, invalid, or malformed
- **Property (P)**: The desired behavior when the bug condition holds - invalid tokens should be cleared, the user should see the login form without redirects, and no redirect loops should occur
- **Preservation**: Existing fast-path redirect behavior for users with valid tokens that must remain unchanged
- **Fast-Path Redirect**: The optimization where users with valid tokens are immediately redirected to `/admin/dashboard` without waiting for profile validation
- **Token Validation**: The process of verifying a token's validity by making an authenticated API call to `/api/auth/profile`
- **Auth Guard**: A component wrapper that validates authentication before rendering protected admin pages
- **useAuthStore**: Zustand store at `lib/stores/authStore.ts` that persists authentication state (accessToken, refreshToken, expiresAt, profile) to localStorage
- **axiosInstance**: Configured axios client at `lib/api/axiosInstance.ts` with interceptors that handle token refresh on 401 responses

## Bug Details

### Bug Condition

The bug manifests when a user visits `/admin/login` with tokens stored in localStorage that are expired, invalid, or malformed. The current `LoginForm` component's `useEffect` hook checks for token existence but does not validate the tokens before redirecting, causing:

1. **Immediate redirect** to `/admin/dashboard` based solely on `accessToken` presence
2. **Background validation attempt** using `/api/auth/profile` if only `refreshToken` exists
3. **No handling** of the case where `accessToken` exists but is invalid/expired
4. **Axios interceptor redirect** back to login when protected routes return 401
5. **Infinite loop** as step 1 repeats

**Formal Specification:**
```
FUNCTION isBugCondition(state)
  INPUT: state containing { pathname, accessToken, refreshToken, tokensAreValid }
  OUTPUT: boolean
  
  RETURN state.pathname === '/admin/login'
         AND (state.accessToken !== null OR state.refreshToken !== null)
         AND state.tokensAreValid === false
END FUNCTION
```

### Examples

**Example 1: Expired Access Token**
- **Scenario**: User logged in yesterday, token expired overnight, browser still has stale token in localStorage
- **Current Behavior**: Login page checks `accessToken` → exists → redirects to `/admin/dashboard` → dashboard makes API call → 401 error → axios interceptor tries refresh → refresh fails → redirects back to login → repeat
- **Expected Behavior**: Login page validates token → determines it's expired → clears tokens → shows login form

**Example 2: Invalid Refresh Token**
- **Scenario**: User's refresh token was revoked server-side (admin reset, security incident), but still exists in localStorage
- **Current Behavior**: Login page checks `accessToken` → null → checks `refreshToken` → exists → calls `/api/auth/profile` → 401 → interceptor tries refresh → refresh fails with invalid token → clears auth → redirects to login → but `isCheckingAuth` might already be false, causing race conditions
- **Expected Behavior**: Login page attempts validation → refresh fails → clears tokens gracefully → shows login form with clear state

**Example 3: Malformed Token Data**
- **Scenario**: localStorage was manually edited or corrupted, tokens have invalid format
- **Current Behavior**: Login page redirects → API calls fail → unpredictable behavior depending on where validation occurs
- **Expected Behavior**: Login page validates tokens → detects malformation → clears tokens → shows login form

**Example 4: Valid Token (Edge Case - Preservation)**
- **Scenario**: User with valid, non-expired token visits `/admin/login` directly
- **Current Behavior**: Immediately redirects to `/admin/dashboard` (fast-path)
- **Expected Behavior**: Should continue to redirect immediately to preserve performance (no regression)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Users with valid, non-expired tokens must be redirected to `/admin/dashboard` immediately (fast-path optimization)
- Token refresh mechanism in axios interceptors must continue to work for protected routes
- Successful login flow must redirect to `/admin/dashboard` as before
- All non-login admin pages must continue to function normally for authenticated users
- Profile fetching and caching via React Query must remain unchanged

**Scope:**
All inputs that do NOT involve visiting `/admin/login` with invalid/expired tokens should be completely unaffected by this fix. This includes:
- Normal login flow with credentials
- Authenticated navigation within admin dashboard
- Token refresh during active sessions
- Logout functionality
- Password reset flows

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Premature Redirect Without Validation**: The `useEffect` in `LoginForm` (line 21-38) redirects immediately if `accessToken` exists without validating its actual validity:
   ```typescript
   if (accessToken) {
     router.replace("/admin/dashboard");
     return;
   }
   ```
   This assumes token existence equals validity, which is false for expired/revoked tokens.

2. **Incomplete Validation Logic**: The refresh token branch (line 29-36) attempts validation but only when `accessToken` is null:
   ```typescript
   if (refreshToken && !accessToken) {
     axiosInstance.get("/api/auth/profile")...
   }
   ```
   This misses the case where `accessToken` exists but is invalid.

3. **Race Conditions with Loading State**: `isCheckingAuth` is set to false before async validation completes, potentially showing the form briefly before redirect or causing state inconsistencies.

4. **No Auth Guard on Protected Routes**: Protected admin pages lack validation, relying entirely on axios interceptor redirects, which creates the redirect loop when combined with issue #1.

5. **Axios Interceptor Redirect Timing**: The interceptor (line 137-139 in `axiosInstance.ts`) redirects to login after clearing auth, but the login page immediately redirects back if stale tokens still exist in state during the render cycle before `clearAuth()` completes.

## Correctness Properties

Property 1: Bug Condition - Invalid Token Graceful Handling

_For any_ user who visits `/admin/login` with expired, invalid, or malformed tokens in localStorage, the fixed login page SHALL validate the tokens, clear invalid auth state, display the login form without redirects, and show appropriate loading states during validation.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Valid Token Fast-Path

_For any_ user who visits `/admin/login` with valid, non-expired tokens, the fixed login page SHALL immediately redirect to `/admin/dashboard` without additional validation delays, preserving the current fast-path optimization behavior exactly as it works in the original code.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct, we need to implement validation-before-redirect and auth guards.

#### File 1: `app/admin/login/page.tsx`

**Function**: `LoginForm` component

**Specific Changes**:

1. **Add Token Validation Helper**: Create an async function to validate tokens before redirecting:
   ```typescript
   async function validateTokens(accessToken: string | null, refreshToken: string | null): Promise<boolean> {
     if (!accessToken && !refreshToken) return false;
     if (!accessToken && refreshToken) {
       // Let axios interceptor handle refresh attempt
       try {
         await axiosInstance.get("/api/auth/profile");
         return true;
       } catch {
         return false;
       }
     }
     if (accessToken) {
       // Validate access token with profile call
       try {
         await axiosInstance.get("/api/auth/profile");
         return true;
       } catch {
         // Try refresh if available
         if (refreshToken) {
           try {
             await axiosInstance.get("/api/auth/profile"); // Interceptor will refresh
             return true;
           } catch {
             return false;
           }
         }
         return false;
       }
     }
     return false;
   }
   ```

2. **Refactor useEffect Logic**: Replace the current validation logic (lines 21-38) with proper validation:
   ```typescript
   useEffect(() => {
     let mounted = true;
     
     async function checkAuth() {
       const { accessToken, refreshToken, clearAuth } = useAuthStore.getState();
       
       // No tokens - show login form
       if (!accessToken && !refreshToken) {
         if (mounted) setIsCheckingAuth(false);
         return;
       }
       
       // Validate tokens before redirecting
       const isValid = await validateTokens(accessToken, refreshToken);
       
       if (!mounted) return;
       
       if (isValid) {
         router.replace("/admin/dashboard");
       } else {
         // Clear invalid tokens and show login form
         clearAuth();
         setIsCheckingAuth(false);
       }
     }
     
     checkAuth();
     
     return () => {
       mounted = false;
     };
   }, []); // Remove accessToken/refreshToken dependencies to prevent re-validation loops
   ```

3. **Improve Loading State UX**: Keep the existing loading spinner but ensure it covers all validation paths

4. **Error Boundary for Validation**: Wrap validation in try-catch to handle network errors gracefully

5. **Remove Dependency on Token Changes**: Change `useEffect` dependencies to empty array to prevent re-triggering when tokens are cleared

#### File 2: `components/RequireAuth.tsx` (NEW FILE)

**Purpose**: Create reusable auth guard component for protected routes

**Implementation**:
```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import axiosInstance from "@/lib/api/axiosInstance";

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RequireAuth({ 
  children, 
  redirectTo = "/admin/login" 
}: RequireAuthProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { accessToken, refreshToken, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function validateAuth() {
      // No tokens - redirect to login
      if (!accessToken && !refreshToken) {
        if (mounted) {
          router.replace(redirectTo);
        }
        return;
      }

      try {
        // Validate with profile endpoint
        await axiosInstance.get("/api/auth/profile");
        if (mounted) {
          setIsAuthorized(true);
          setIsValidating(false);
        }
      } catch (error) {
        if (mounted) {
          clearAuth();
          router.replace(redirectTo);
        }
      }
    }

    validateAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, accessToken, refreshToken, router, redirectTo, clearAuth]);

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2e6f57] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
```

#### File 3: `components/AdminShell.tsx`

**Function**: Layout wrapper for admin pages

**Specific Changes**:

1. **Add Auth Guard to Protected Routes**: Wrap non-auth pages with RequireAuth component:
   ```typescript
   import RequireAuth from "./RequireAuth";
   
   // In the component:
   if (isAuthPage) {
     return <div className="min-h-screen bg-[#f5f7f6] font-[var(--font-poppins)]">{children}</div>;
   }
   
   // Wrap protected content
   return (
     <RequireAuth>
       <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f5f7f6] font-[var(--font-poppins)] text-[#183c2f] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
         {/* existing layout code */}
       </div>
     </RequireAuth>
   );
   ```

2. **Keep Auth Page Detection**: Preserve the existing `isAuthPage` logic to exclude login/forgot-password/reset-password from auth guards

#### File 4: `lib/utils/tokenValidator.ts` (NEW FILE)

**Purpose**: Centralized token validation utility

**Implementation**:
```typescript
import axiosInstance from "@/lib/api/axiosInstance";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Validates tokens by making an authenticated request to the profile endpoint.
 * The axios interceptor will automatically attempt token refresh if needed.
 * 
 * @returns Promise<boolean> - true if tokens are valid or successfully refreshed
 */
export async function validateTokens(): Promise<boolean> {
  const { accessToken, refreshToken } = useAuthStore.getState();
  
  // No tokens at all
  if (!accessToken && !refreshToken) {
    return false;
  }
  
  try {
    // Make authenticated request - interceptor handles refresh if needed
    await axiosInstance.get("/api/auth/profile");
    return true;
  } catch (error) {
    // Validation failed even after refresh attempt
    return false;
  }
}

/**
 * Checks if tokens exist in storage without making API calls
 */
export function hasTokens(): boolean {
  const { accessToken, refreshToken } = useAuthStore.getState();
  return !!(accessToken || refreshToken);
}

/**
 * Validates token format (basic structure check, not cryptographic validation)
 */
export function isValidTokenFormat(token: string | null): boolean {
  if (!token) return false;
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Each part should be base64url encoded (alphanumeric, -, _)
  const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => base64UrlPattern.test(part));
}
```

#### File 5: `lib/api/axiosInstance.ts`

**Function**: Axios interceptor response handler

**Specific Changes**:

1. **Improve Redirect Logic**: Add check to prevent redirect loops (lines 137-139):
   ```typescript
   clearAuth();
   // Only redirect if not already on login page
   if (typeof window !== "undefined" && 
       window.location.pathname !== "/admin/login" &&
       !window.location.pathname.startsWith("/admin/forgot-password") &&
       !window.location.pathname.startsWith("/admin/reset-password")) {
     window.location.href = "/admin/login";
   }
   ```

2. **Add Request Cancellation**: When clearing auth, cancel pending requests to prevent race conditions:
   ```typescript
   // At the top of the file, track ongoing requests
   const pendingRequests = new Map<string, AbortController>();
   
   // In request interceptor, register abort controller
   const controller = new AbortController();
   const requestKey = `${config.method}-${config.url}`;
   pendingRequests.set(requestKey, controller);
   config.signal = controller.signal;
   
   // In clearAuth calls, cancel pending requests
   pendingRequests.forEach(controller => controller.abort());
   pendingRequests.clear();
   ```

3. **Better Error Discrimination**: Distinguish between network errors and authentication errors to avoid clearing auth on temporary network issues

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code (exploratory testing), then verify the fix works correctly and preserves existing behavior (fix checking and preservation checking).

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis by observing redirect loops and 404 errors with invalid tokens. If we refute, we will need to re-hypothesize.

**Test Plan**: Manually test the login flow with various token states on the UNFIXED code. Use browser DevTools to observe redirects and network requests. Manipulate localStorage to create invalid token scenarios.

**Test Cases**:

1. **Expired Access Token Test**: 
   - Set up: Login successfully, manually edit localStorage to set `expiresAt` to past date
   - Navigate to `/admin/login`
   - Expected on unfixed code: Immediate redirect to `/admin/dashboard` → API call fails → redirect back to login → infinite loop observed in network tab and navigation history

2. **Invalid Refresh Token Test**:
   - Set up: Login successfully, manually edit localStorage to corrupt `refreshToken` value
   - Clear `accessToken` from localStorage, keep corrupted `refreshToken`
   - Navigate to `/admin/login`
   - Expected on unfixed code: Loading state → profile call → 401 → refresh attempt fails → redirect to login → possible race condition where form flashes

3. **Malformed Token Format Test**:
   - Set up: Manually set `accessToken` in localStorage to invalid JWT format (e.g., "invalid.token")
   - Navigate to `/admin/login`
   - Expected on unfixed code: Redirect to dashboard → API calls fail → error handling varies

4. **Valid Token Test**:
   - Set up: Login successfully with valid tokens
   - Navigate directly to `/admin/login` via URL bar
   - Expected on unfixed code: Immediate redirect to dashboard (this should continue to work)

**Expected Counterexamples**:
- Browser developer tools show redirect loops in network tab (multiple login ↔ dashboard navigations)
- Console errors showing repeated 401 responses
- Loading states that never resolve
- Possible causes confirmed: premature redirect without validation, race conditions in auth state, missing auth guards

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (invalid tokens at login page), the fixed function produces the expected behavior (clear tokens, show login form, no loops).

**Pseudocode:**
```
FOR ALL state WHERE isBugCondition(state) DO
  result := LoginForm_fixed(state)
  ASSERT result.tokensCleared = true
  ASSERT result.loginFormDisplayed = true
  ASSERT result.redirectOccurred = false
  ASSERT result.loadingStateResolved = true
END FOR
```

**Test Implementation**: Write integration tests that simulate the bug scenarios and verify proper handling.

**Test Cases**:

1. **Unit Test - Token Validation Function**:
   ```typescript
   describe('validateTokens', () => {
     it('returns false for null tokens', async () => {
       expect(await validateTokens(null, null)).toBe(false);
     });
     
     it('returns false for expired tokens', async () => {
       mockAxios.get.mockRejectedValueOnce({ response: { status: 401 } });
       expect(await validateTokens('expired', 'invalid')).toBe(false);
     });
     
     it('returns true for valid tokens', async () => {
       mockAxios.get.mockResolvedValueOnce({ data: { profile: {} } });
       expect(await validateTokens('valid', 'valid')).toBe(true);
     });
   });
   ```

2. **Integration Test - Login Page with Invalid Token**:
   ```typescript
   it('clears invalid tokens and shows login form', async () => {
     // Setup: expired token in store
     useAuthStore.setState({ accessToken: 'expired', refreshToken: 'expired' });
     mockAxios.get.mockRejectedValueOnce({ response: { status: 401 } });
     
     render(<AdminLoginPage />);
     
     // Wait for validation
     await waitFor(() => {
       expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
     });
     
     // Verify: login form shown, tokens cleared
     expect(screen.getByPlaceholderText('Email or username')).toBeInTheDocument();
     expect(useAuthStore.getState().accessToken).toBeNull();
   });
   ```

3. **Integration Test - Protected Route Access**:
   ```typescript
   it('redirects to login when accessing protected route with invalid token', async () => {
     useAuthStore.setState({ accessToken: 'invalid', refreshToken: 'invalid' });
     mockAxios.get.mockRejectedValueOnce({ response: { status: 401 } });
     
     const { result } = renderHook(() => useRouter());
     render(<RequireAuth><ProtectedContent /></RequireAuth>);
     
     await waitFor(() => {
       expect(result.current.replace).toHaveBeenCalledWith('/admin/login');
     });
   });
   ```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (valid tokens, normal flows), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL state WHERE NOT isBugCondition(state) DO
  ASSERT LoginForm_original(state) = LoginForm_fixed(state)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (various valid token states, different user profiles, different timing scenarios)
- It catches edge cases that manual unit tests might miss (race conditions, concurrent navigation, token refresh during validation)
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: First observe and document current behavior on UNFIXED code for valid token scenarios, then write tests capturing that behavior to ensure it's preserved after the fix.

**Test Cases**:

1. **Preservation Test - Valid Token Fast-Path**: 
   - Observe on unfixed code: User with valid token visits `/admin/login` → immediately redirects to `/admin/dashboard` without loading delay
   - Write test:
   ```typescript
   it('preserves fast-path redirect for valid tokens', async () => {
     const { result } = renderHook(() => useRouter());
     useAuthStore.setState({ accessToken: 'valid', refreshToken: 'valid' });
     mockAxios.get.mockResolvedValueOnce({ data: { profile: {} } });
     
     render(<AdminLoginPage />);
     
     // Should redirect immediately after validation
     await waitFor(() => {
       expect(result.current.replace).toHaveBeenCalledWith('/admin/dashboard');
     });
   });
   ```

2. **Preservation Test - Successful Login Flow**:
   - Observe on unfixed code: User submits credentials → loading state → success → redirect to dashboard
   - Write test to verify this exact flow continues working

3. **Preservation Test - Token Refresh During Session**:
   - Observe on unfixed code: User makes API call → 401 → interceptor refreshes token → request retries successfully
   - Write test to verify refresh mechanism still works when NOT on login page

4. **Preservation Test - Protected Route Access with Valid Token**:
   - Observe on unfixed code: User with valid token navigates between admin pages → no redirects → pages load normally
   - Write property-based test generating random navigation sequences

### Unit Tests

- Test `validateTokens()` utility with various token states (null, expired, valid, malformed)
- Test `isValidTokenFormat()` with edge cases (empty string, wrong number of parts, invalid characters)
- Test `RequireAuth` component with different auth states and navigation scenarios
- Test `LoginForm` useEffect logic in isolation with mocked dependencies
- Test axios interceptor redirect logic doesn't trigger on login page

### Property-Based Tests

- Generate random token expiry times and verify correct validation behavior
- Generate random navigation sequences through admin pages and verify no unexpected redirects
- Generate random timing of token expiration during user session and verify graceful handling
- Generate random combinations of network errors and auth errors to verify proper error discrimination

### Integration Tests

- Full login flow: credentials → success → dashboard with valid session
- Full logout flow: logout → clear tokens → login page
- Protected route access with various auth states (no token, invalid token, valid token, expired token)
- Token refresh during active session across multiple concurrent requests
- Password reset flow with query parameters preserved
- Browser back/forward navigation with auth state changes
- Multiple tabs with shared localStorage auth state
