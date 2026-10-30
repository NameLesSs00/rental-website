"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import axiosInstance from "@/lib/api/axiosInstance";
import type { ProfileResponse } from "@/lib/types/auth";

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function RequireAuth({
  children,
  redirectTo = "/admin/login",
}: RequireAuthProps) {
  const [hasHydrated, setHasHydrated] = useState(() =>
    typeof window !== "undefined" ? useAuthStore.persist.hasHydrated() : false
  );
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, refreshToken, clearAuth } = useAuthStore();

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    let mounted = true;

    const validateAuth = async () => {
      const currentAccess = accessToken ?? useAuthStore.getState().accessToken;
      const currentRefresh = refreshToken ?? useAuthStore.getState().refreshToken;

      // Fast path: no tokens after hydration means immediate redirect
      if (!currentAccess || !currentRefresh) {
        if (mounted) {
          router.replace(redirectTo);
        }
        return;
      }

      // Tokens exist: validate them with API call
      try {
        await axiosInstance.get<ProfileResponse>("/api/auth/profile");

        // Success: tokens are valid
        if (mounted) {
          setIsAuthorized(true);
          setIsValidating(false);
        }
      } catch (error) {
        // Validation failed: clear auth and redirect
        if (mounted) {
          clearAuth();
          router.replace(redirectTo);
        }
      }
    };

    validateAuth();

    return () => {
      mounted = false;
    };
  }, [hasHydrated, pathname, accessToken, refreshToken, router, redirectTo, clearAuth]);

  // Show loading spinner while validating
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2e6f57] border-t-transparent" />
      </div>
    );
  }

  // Not authorized: render nothing (redirect is happening)
  if (!isAuthorized) {
    return null;
  }

  // Authorized: render protected content
  return <>{children}</>;
}
