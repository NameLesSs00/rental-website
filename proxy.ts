import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/stores/authStore";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

/**
 * Next.js 16 Proxy (formerly middleware)
 *
 * Protects all /admin/* routes except /admin/login.
 * Unauthenticated requests are rewritten to /not-found so the user
 * sees a 404 page — not a redirect to login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // ========================================
  // TEMPORARILY BLOCKED: Buy Properties Routes
  // ========================================
  // To re-enable buy pages:
  // 1. Comment out or remove this entire block (lines below)
  // 2. Uncomment the buy links in components/Header.tsx
  // 3. Uncomment the buy links in components/Footer.tsx
  // 4. Uncomment the buy links in components/AdminSidebar.tsx
  //
  // Block public buy pages (with or without locale prefix)
  if (
    pathname.includes("/buy") ||
    pathname.includes("/billing/buy") ||
    pathname.startsWith("/property-buying")
  ) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
  
  // Block admin buy property management pages
  if (
    pathname.startsWith("/admin/property-buying") ||
    pathname === "/admin/property-buyings"
  ) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
  // ========================================
  // END: Buy Properties Block
  // ========================================

  if (pathname.startsWith("/admin")) {
    // Allow public auth pages through unconditionally
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/forgot-password" ||
      pathname === "/admin/reset-password"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!token && !refreshToken) {
      // Rewrite to the app's not-found page (shows 404, no redirect)
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    return NextResponse.next();
  }

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  if (locales.includes(firstSegment as (typeof locales)[number])) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
