/**
 * Example usage and manual testing for tokenValidator module
 * This file demonstrates how to use the tokenValidator functions
 */

import { validateTokens, hasTokens, isValidTokenFormat } from "./tokenValidator";

// ─── Example 1: Check if tokens exist ─────────────────────────────────────────
export async function exampleCheckTokens() {
  if (hasTokens()) {
    console.log("✓ Tokens found in store");
    
    // Validate token validity with server
    const isValid = await validateTokens();
    if (isValid) {
      console.log("✓ Tokens are valid - user is authenticated");
      return true;
    } else {
      console.log("✗ Tokens are invalid or expired");
      return false;
    }
  } else {
    console.log("✗ No tokens found - user needs to login");
    return false;
  }
}

// ─── Example 2: Validate token format before sending to server ───────────────
export function exampleValidateFormat() {
  const exampleTokens = [
    {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      description: "Valid JWT",
    },
    {
      token: "invalid.token",
      description: "Invalid (only 2 parts)",
    },
    {
      token: "part1..part3",
      description: "Invalid (empty middle part)",
    },
    {
      token: "invalid+chars.part2/invalid.part3=invalid",
      description: "Invalid (special characters)",
    },
  ];

  console.log("\n=== Token Format Validation Examples ===\n");
  exampleTokens.forEach(({ token, description }) => {
    const isValid = isValidTokenFormat(token);
    console.log(`${description}: ${isValid ? "✓ VALID" : "✗ INVALID"}`);
  });
}

// ─── Example 3: Login page redirect logic ────────────────────────────────────
export async function exampleLoginPageLogic() {
  console.log("\n=== Login Page Redirect Logic ===\n");

  // Step 1: Check if tokens exist
  if (!hasTokens()) {
    console.log("No tokens found → Show login form");
    return { action: "SHOW_LOGIN_FORM" };
  }

  console.log("Tokens found → Validating with server...");

  // Step 2: Validate tokens with server (includes automatic refresh attempt)
  const isValid = await validateTokens();

  if (isValid) {
    console.log("Tokens valid → Redirect to dashboard");
    return { action: "REDIRECT_TO_DASHBOARD" };
  } else {
    console.log("Tokens invalid → Clear auth and show login form");
    return { action: "CLEAR_AUTH_AND_SHOW_LOGIN" };
  }
}

// ─── Example 4: Protected route auth check ───────────────────────────────────
export async function exampleProtectedRouteCheck() {
  console.log("\n=== Protected Route Auth Check ===\n");

  // Check if user has valid authentication
  const isValid = await validateTokens();

  if (isValid) {
    console.log("✓ User authenticated → Render protected content");
    return { canAccess: true };
  } else {
    console.log("✗ User not authenticated → Redirect to login");
    return { canAccess: false, redirect: "/admin/login" };
  }
}

// ─── Run examples if executed directly ────────────────────────────────────────
if (require.main === module) {
  (async () => {
    console.log("=== Token Validator Examples ===\n");
    
    console.log("1. Checking tokens:");
    await exampleCheckTokens();
    
    console.log("\n2. Format validation:");
    exampleValidateFormat();
    
    console.log("\n3. Login page logic:");
    await exampleLoginPageLogic();
    
    console.log("\n4. Protected route check:");
    await exampleProtectedRouteCheck();
  })();
}
