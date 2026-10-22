# Implementation Plan

## Overview
This document provides actionable implementation tasks for fixing the admin login authentication redirect loop bug. The tasks follow the exploratory bugfix workflow: explore the bug with tests first, write preservation tests, then implement the fix with confidence.

---

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Invalid Token Redirect Loop Detection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate redirect loops and improper handling of invalid tokens
  - **Scoped PBT Approach**: Test concrete failing cases - expired tokens, invalid tokens, malformed tokens
  - Create test file: `__tests__/bugfix/invalid-token-handling.test.tsx`
  - Test implementation details from Bug Condition in design:
    - User visits `/admin/login` with expired `accessToken` in localStorage
    - User visits `/admin/login` with invalid `refreshToken` (corrupted value)
    - User visits `/admin/login` with malformed token (not JWT format)
  - The test assertions should match the Expected Behavior Properties from design:
    - ASSERT: Invalid tokens are cleared from auth store
    - ASSERT: Login form is displayed without redirects
    - ASSERT: No redirect loop occurs (track navigation calls)
    - ASSERT: Loading state resolves to show form (not infinite loading)
  - Mock dependencies: `next/navigation` router, `axiosInstance`, `useAuthStore`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - Record redirect loops in test output
    - Capture 401 error patterns
    - Note race conditions with loading states
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Valid Token Fast-Path Redirect Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (valid tokens):
    - User with valid token visits `/admin/login` → immediate redirect to `/admin/dashboard`
    - User successfully logs in with credentials → redirect to dashboard
    - User navigates between protected admin pages → no unexpected redirects
    - Token refresh during session works correctly on protected routes (NOT on login page)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - **Test 1: Fast-Path Redirect for Valid Tokens**
      - Setup: Store valid `accessToken` and `refreshToken` in auth store
      - Mock successful `/api/auth/profile` response
      - Render `AdminLoginPage` component
      - Assert: Router calls `replace('/admin/dashboard')` immediately after validation
      - Assert: No loading spinner shown for extended time
    - **Test 2: Successful Login Flow Preserved**
      - Setup: Mock successful login API response
      - Simulate form submission with valid credentials
      - Assert: Loading state shown during submission
      - Assert: Redirect to dashboard on success
      - Assert: Tokens stored in auth store
    - **Test 3: Protected Route Access with Valid Token**
      - Setup: Valid tokens in store, render protected admin page
      - Mock successful profile validation
      - Assert: Page content renders without redirect
      - Assert: No redirect to login page
    - **Test 4: Token Refresh During Session**
      - Setup: Valid refresh token, expired access token
      - User on protected route (NOT login page) makes API call
      - Mock 401 response → successful refresh → retry succeeds
      - Assert: Request completes successfully after refresh
      - Assert: No redirect to login page during refresh
  - Create test file: `__tests__/bugfix/valid-token-preservation.test.tsx`
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Fix for admin login authentication redirect loop

  - [ ] 3.1 Create token validation utility module
    - Create new file: `lib/utils/tokenValidator.ts`
    - Implement `validateTokens()` function:
      - Accepts no parameters (reads from auth store internally)
      - Returns `Promise<boolean>` indicating token validity
      - Makes authenticated request to `/api/auth/profile`
      - Relies on axios interceptor to handle automatic token refresh
      - Returns `true` if validation succeeds (including successful refresh)
      - Returns `false` if validation fails after all retry attempts
    - Implement `hasTokens()` helper:
      - Returns `boolean` indicating if any tokens exist in store
      - Does not make API calls (synchronous check)
    - Implement `isValidTokenFormat()` helper:
      - Validates JWT structure (3 parts separated by dots)
      - Validates base64url encoding of each part
      - Returns `boolean` for format validity
      - Does not validate token signature (server-side responsibility)
    - Add comprehensive JSDoc comments for each function
    - Export all functions as named exports
    - _Bug_Condition: isBugCondition(state) where state.pathname === '/admin/login' AND tokens exist AND tokensAreValid === false_
    - _Expected_Behavior: validateTokens() returns false for invalid/expired tokens, clearing them gracefully; returns true for valid tokens_
    - _Preservation: Validation logic should not affect token refresh mechanism in axios interceptors_
    - _Requirements: 2.1, 2.2, 2.3, 3.1_

  - [ ] 3.2 Create RequireAuth guard component
    - Create new file: `components/RequireAuth.tsx`
    - Mark as client component with `"use client"` directive
    - Accept props: `children: React.ReactNode`, `redirectTo?: string` (default: `/admin/login`)
    - Implement validation state management:
      - `isValidating` state: tracks ongoing validation (initial: `true`)
      - `isAuthorized` state: tracks authorization result (initial: `false`)
    - Implement validation `useEffect` hook:
      - Check for token existence first (fast path)
      - If no tokens: redirect to login immediately
      - If tokens exist: call `/api/auth/profile` to validate
      - On success: set `isAuthorized = true`, `isValidating = false`
      - On failure: call `clearAuth()`, redirect to login
      - Handle cleanup with mounted flag to prevent state updates after unmount
      - Dependencies: `[pathname, accessToken, refreshToken, router, redirectTo, clearAuth]`
    - Implement render logic:
      - If `isValidating`: show loading spinner (full screen centered)
      - If `!isAuthorized`: return `null` (redirect already initiated)
      - If authorized: render `children`
    - Use existing loading spinner styles from login page for consistency
    - _Bug_Condition: Protected routes accessed with invalid tokens should not cause redirect loops_
    - _Expected_Behavior: Auth guard validates tokens before rendering, redirects gracefully on invalid tokens_
    - _Preservation: Valid tokens should pass through guard without delays or side effects_
    - _Requirements: 2.2, 2.3, 2.4, 3.2_

  - [ ] 3.3 Update AdminShell to use RequireAuth guard
    - Open file: `components/AdminShell.tsx`
    - Add import: `import RequireAuth from "./RequireAuth"`
    - Locate the protected content render logic (non-auth pages)
    - Wrap protected layout content with `<RequireAuth>` component
    - Keep existing `isAuthPage` detection logic unchanged:
      - Login, forgot-password, reset-password pages should NOT be wrapped
      - These pages should render without auth checks
    - Ensure grid layout structure remains intact inside RequireAuth wrapper
    - Verify no duplicate loading states (RequireAuth provides its own)
    - Test navigation between protected pages to ensure smooth transitions
    - _Bug_Condition: Users accessing protected routes with invalid tokens_
    - _Expected_Behavior: Auth guard intercepts access, validates tokens, redirects if invalid_
    - _Preservation: Normal navigation for authenticated users should remain unchanged_
    - _Requirements: 2.3, 2.4, 3.2_

  - [ ] 3.4 Refactor login page validation logic
    - Open file: `app/admin/login/page.tsx`
    - Import `validateTokens` from `lib/utils/tokenValidator`
    - Replace existing `useEffect` hook (lines 21-38) with new validation logic:
      - Initialize `mounted` flag for cleanup
      - Create async `checkAuth()` function inside effect
      - Get current auth state: `const { accessToken, refreshToken, clearAuth } = useAuthStore.getState()`
      - If no tokens at all: set `isCheckingAuth = false`, return early (show form)
      - Call `const isValid = await validateTokens()`
      - Check `mounted` flag before any state updates
      - If valid: `router.replace("/admin/dashboard")`
      - If invalid: call `clearAuth()`, set `isCheckingAuth = false`
      - Wrap entire async function in try-catch for network errors
      - On error: clear auth, show login form
      - Return cleanup function setting `mounted = false`
    - Change `useEffect` dependencies to `[]` (empty array):
      - Prevents re-triggering when tokens are cleared
      - Validation only runs on initial mount
      - Avoids validation loops
    - Remove direct dependencies on `accessToken` and `refreshToken`
    - Keep existing loading spinner UI (conditional render based on `isCheckingAuth`)
    - Remove the separate refresh token validation branch (now unified in `validateTokens()`)
    - _Bug_Condition: isBugCondition(state) where user visits /admin/login with invalid tokens_
    - _Expected_Behavior: Validate tokens before redirect, clear invalid tokens, show login form without loops_
    - _Preservation: Fast-path redirect for valid tokens must be preserved (no added delays)_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.3_

  - [ ] 3.5 Improve axios interceptor redirect logic
    - Open file: `lib/api/axiosInstance.ts`
    - Locate response error interceptor (around lines 137-139)
    - Add redirect loop prevention check:
      - Before `window.location.href = "/admin/login"`, add condition:
      - Check `window.location.pathname !== "/admin/login"`
      - Check `!window.location.pathname.startsWith("/admin/forgot-password")`
      - Check `!window.location.pathname.startsWith("/admin/reset-password")`
      - Only redirect if NOT already on an auth page
    - Add request cancellation mechanism:
      - Create `pendingRequests` Map at module level: `new Map<string, AbortController>()`
      - In request interceptor: create `AbortController`, store in map with key `${config.method}-${config.url}`
      - Attach `controller.signal` to `config.signal`
      - In response interceptor success: remove request from map
      - In `clearAuth()` calls: iterate map and call `controller.abort()` on each, then clear map
      - Handle `AbortError` gracefully (don't show to user)
    - Improve error discrimination:
      - Check `error.response?.status === 401` explicitly (not just truthy error)
      - Check `error.code !== 'ERR_NETWORK'` (don't clear auth on network issues)
      - Only clear auth and redirect for actual authentication failures
    - Add comments explaining redirect loop prevention logic
    - _Bug_Condition: Axios interceptor redirects back to login, causing loop with login page redirects_
    - _Expected_Behavior: Interceptor checks current page before redirecting, preventing loops_
    - _Preservation: Token refresh mechanism must continue to work for protected routes_
    - _Requirements: 2.2, 2.4, 3.2_

  - [ ] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Invalid Token Handling Verified
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run command: `npm test __tests__/bugfix/invalid-token-handling.test.tsx`
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify all assertions pass:
      - Invalid tokens are cleared from auth store ✓
      - Login form is displayed without redirects ✓
      - No redirect loop occurs ✓
      - Loading state resolves properly ✓
    - Check test output for any warnings or console errors
    - If test fails: debug the specific assertion that's failing, review implementation
    - Document test results in task notes
    - _Requirements: Expected Behavior Properties from design - 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Valid Token Behavior Preserved
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run command: `npm test __tests__/bugfix/valid-token-preservation.test.tsx`
    - **EXPECTED OUTCOME**: All tests PASS (confirms no regressions)
    - Verify each preservation test passes:
      - Fast-path redirect for valid tokens ✓
      - Successful login flow preserved ✓
      - Protected route access with valid token ✓
      - Token refresh during session ✓
    - Manually test edge cases:
      - Navigate to `/admin/login` with valid token → should redirect immediately
      - Login with credentials → should redirect to dashboard
      - Navigate between admin pages → no unexpected redirects
      - Let session expire → token refresh should work on protected routes
    - Check for performance regressions (timing of redirects)
    - If any test fails: identify which behavior regressed, review specific implementation
    - Document preservation verification results
    - _Requirements: Preservation Requirements from design - 3.1, 3.2, 3.3_

- [ ] 4. Checkpoint - Ensure all tests pass and manual validation
  - Run full test suite: `npm test`
  - Verify all existing tests still pass (no regressions in other features)
  - Perform manual testing scenarios:
    1. **Expired Token Scenario**:
       - Login successfully
       - Use DevTools to modify `expiresAt` in localStorage to past date
       - Navigate to `/admin/login`
       - Expected: Login form shown, no redirect loop, tokens cleared
    2. **Invalid Refresh Token Scenario**:
       - Login successfully
       - Use DevTools to corrupt `refreshToken` value
       - Clear `accessToken`
       - Navigate to `/admin/login`
       - Expected: Login form shown after brief validation attempt, tokens cleared
    3. **Malformed Token Scenario**:
       - Use DevTools to set `accessToken` to invalid value (e.g., "malformed.token")
       - Navigate to `/admin/login`
       - Expected: Login form shown, tokens cleared gracefully
    4. **Valid Token Fast-Path Scenario**:
       - Login successfully
       - Navigate directly to `/admin/login` via URL bar
       - Expected: Immediate redirect to `/admin/dashboard` (fast-path preserved)
    5. **Protected Route Access Scenario**:
       - Without logging in, navigate to `/admin/dashboard`
       - Expected: Redirect to `/admin/login`
       - Login with valid credentials
       - Expected: Redirect to dashboard, normal navigation works
    6. **Token Refresh During Session Scenario**:
       - Login successfully, navigate to a protected page
       - Wait for access token to expire (or manually expire it)
       - Trigger an API call (e.g., load data)
       - Expected: Token refreshes automatically, request succeeds, no redirect
  - Use browser DevTools Network tab to verify no redirect loops
  - Check console for errors or warnings
  - Verify loading states are appropriate (not too brief, not infinite)
  - Test in multiple browsers (Chrome, Firefox, Safari) if possible
  - Test with slow network throttling to catch race conditions
  - Document any issues found and resolve before marking complete
  - Ask user if questions arise or unexpected behavior is observed
  - _Requirements: All requirements (2.1-2.4, 3.1-3.3)_

---

## Notes

### Testing Framework
- Use Jest with React Testing Library for component tests
- Use `@testing-library/react-hooks` for hook testing
- Mock `next/navigation`, `axiosInstance`, and `useAuthStore` in tests
- Use `waitFor` for async state updates
- Use `act` to wrap state updates

### Test File Locations
- Bug condition test: `__tests__/bugfix/invalid-token-handling.test.tsx`
- Preservation tests: `__tests__/bugfix/valid-token-preservation.test.tsx`
- Create `__tests__/bugfix/` directory if it doesn't exist

### Implementation Order
The tasks MUST be completed in order:
1. Write and run exploration test (expect failure)
2. Write and run preservation tests (expect success)
3. Implement all fixes (3.1-3.5)
4. Verify exploration test now passes (3.6)
5. Verify preservation tests still pass (3.7)
6. Manual checkpoint testing (4)

### Key Constraints
- DO NOT skip the exploration test phase - it validates our understanding of the bug
- DO NOT modify tests after they fail - use them to guide implementation
- DO NOT add new features - focus only on fixing the identified bug
- PRESERVE all existing behavior for valid token scenarios
- ENSURE no performance regressions in fast-path redirect

### Success Criteria
- All exploration tests pass after fix
- All preservation tests pass after fix
- Manual testing confirms no redirect loops
- No console errors or warnings
- Fast-path redirect performance unchanged
- Clean separation of auth and non-auth pages
