"use client";

import React, { ReactNode, useMemo } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY, getPayPalLocale } from "@/lib/paypal/config";
import { useI18n } from "@/components/I18nProvider";

interface PayPalProviderProps {
  children: ReactNode;
  currency?: string;
}

export function PayPalProvider({ children, currency }: PayPalProviderProps) {
  const { locale } = useI18n();

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
