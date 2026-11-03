"use client";

import React, { ReactNode, useEffect, useMemo } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY, getPayPalLocale } from "@/lib/paypal/config";
import { useI18n } from "@/components/I18nProvider";

interface PayPalProviderProps {
  children: ReactNode;
  currency?: string;
}

export function PayPalProvider({ children, currency }: PayPalProviderProps) {
  const { locale } = useI18n();

  // Intercept Post-Robot / PayPal window closure exceptions so they don't trigger Next.js error overlays
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isPostRobotWindowClosed = (msg: string) => {
      const lower = msg.toLowerCase();
      return (
        lower.includes("window is closed") ||
        lower.includes("target window is closed") ||
        lower.includes("can not determine type") ||
        lower.includes("postrobot_method")
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      const msg =
        reason instanceof Error
          ? reason.message
          : typeof reason === "object" && reason && "message" in reason
          ? String(reason.message)
          : String(reason || "");

      if (isPostRobotWindowClosed(msg)) {
        event.preventDefault();
        console.warn("[PayPal] Intercepted benign window closure rejection:", msg);
      }
    };

    const handleError = (event: ErrorEvent) => {
      const msg = event?.message || (event?.error instanceof Error ? event.error.message : "");
      if (isPostRobotWindowClosed(msg)) {
        event.preventDefault();
        console.warn("[PayPal] Intercepted benign window closure error:", msg);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  const options = useMemo(
    () => ({
      clientId: PAYPAL_CLIENT_ID,
      currency: currency || PAYPAL_CURRENCY,
      intent: "capture" as const,
      components: "buttons,card-fields",
      locale: getPayPalLocale(locale),
    }),
    [currency, locale]
  );

  return (
    <PayPalScriptProvider options={options}>
      {children}
    </PayPalScriptProvider>
  );
}

export default PayPalProvider;
