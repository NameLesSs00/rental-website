"use client";

import React, { useState } from "react";
import { useInitializePaymobPayment } from "@/lib/hooks/usePayment";
import { savePaymentBookingContext, type PaymentBookingKind } from "@/lib/utils/paymentBookingContext";
import { useI18n } from "@/components/I18nProvider";
import { formatCurrency } from "@/lib/utils/currency";
import { ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";

export interface PaymobCheckoutProps {
  bookingId: string;
  bookingNumber: string;
  amount: number;
  currency: string;
  propertyId?: string;
  kind?: PaymentBookingKind;
  onError?: (error: Error) => void;
}

export function PaymobCheckout({
  bookingId,
  bookingNumber,
  amount,
  currency,
  propertyId,
  kind = "rent",
  onError,
}: PaymobCheckoutProps) {
  const { t } = useI18n();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: initializePaymob } = useInitializePaymobPayment();

  const handlePaymobClick = async () => {
    setIsLoading(true);
    setLocalError(null);

    try {
      // Save context so success page can read details upon callback
      savePaymentBookingContext({
        bookingId,
        bookingNumber,
        propertyId,
        kind,
        amount,
        currency,
        gateway: "paymob",
      });

      const res = await initializePaymob({ bookingId });
      if (!res.checkoutUrl) {
        throw new Error("Paymob did not return a valid checkout URL.");
      }

      // Redirect guest to Paymob Unified Checkout
      window.location.href = res.checkoutUrl;
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to initialize Paymob payment.";
      setLocalError(msg);
      onError?.(err instanceof Error ? err : new Error(msg));
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {localError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
            <p className="font-medium leading-relaxed">{localError}</p>
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="rounded-xl border border-[#dfe8e4] bg-[#f9fbfa] p-4 text-[13px] text-[#40544c]">
        <div className="flex items-center gap-2 font-semibold text-[#183c2f]">
          <ShieldCheck className="size-4 text-[#2e6f57]" />
          <span>Paymob Secure Gateway</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#667c74]">
          {t("payment.methods.paymobRedirectNotice")}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#edf2ef] pt-2.5 text-[11px] font-medium text-[#667c74]">
          <span>Accepted:</span>
          <span className="font-bold text-[#183c2f]">Meeza Cards</span>
          <span>•</span>
          <span className="font-bold text-[#183c2f]">Mobile Wallets</span>
          <span>•</span>
          <span className="font-bold text-[#183c2f]">Egyptian Debit/Credit</span>
          <span>•</span>
          <span className="font-bold text-[#183c2f]">ValU</span>
        </div>
      </div>

      {/* Paymob Action Button */}
      <button
        type="button"
        onClick={handlePaymobClick}
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2e6f57] text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#255f49] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>{t("payment.paypal.processing")}</span>
          </>
        ) : (
          <>
            <span>{t("payment.methods.payWithPaymob")}</span>
            <span className="text-[13px] font-normal opacity-90">
              ({formatCurrency(amount, currency, 2)})
            </span>
            <ExternalLink className="size-4 ml-1 opacity-80" />
          </>
        )}
      </button>
    </div>
  );
}

export default PaymobCheckout;

