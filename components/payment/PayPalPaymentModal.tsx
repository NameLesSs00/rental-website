"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { PayPalProvider } from "./PayPalProvider";
import { PayPalCheckout } from "./PayPalCheckout";
import type { CapturePaypalResponseData } from "@/lib/hooks/usePayment";
import { formatCurrency } from "@/lib/utils/currency";

export interface PendingBookingPayment {
  kind: "rent" | "transfer";
  bookingId: string;
  bookingNumber: string;
  title: string;
  subtitle?: string;
  amount: number;
  currency: string;
  stayDates?: {
    checkIn: string;
    checkOut: string;
  };
  guests?: number;
  transferDetails?: {
    pickupDate: string;
    pickupTime: string;
    passengers: number;
  };
}

interface PayPalPaymentModalProps {
  isOpen: boolean;
  booking: PendingBookingPayment | null;
  onClose: () => void;
  onPaymentSuccess?: (captureData: CapturePaypalResponseData) => void;
}

const FIVE_MINUTES_IN_SECONDS = 5 * 60;

function ExpiryBar({ onExpire }: { onExpire: () => void }) {
  const { t } = useI18n();
  const [secondsRemaining, setSecondsRemaining] = useState(FIVE_MINUTES_IN_SECONDS);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, onExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between border-b border-[#fef3d6] bg-[#fef9ec] px-6 py-2.5 text-[12px] text-[#8a6814]">
      <span className="flex items-center gap-1.5 font-medium">
        <Clock className="size-3.5 text-[#cfb072]" />
        {t("payment.expiryModal.timeRemaining")}
      </span>
      <span
        className={`font-mono text-[13px] font-bold ${
          secondsRemaining < 60 ? "animate-pulse text-red-600" : "text-[#183c2f]"
        }`}
      >
        {formattedTime}
      </span>
    </div>
  );
}

export function PayPalPaymentModal({
  isOpen,
  booking,
  onClose,
  onPaymentSuccess,
}: PayPalPaymentModalProps) {
  const { t, href, isRtl } = useI18n();
  const router = useRouter();
  const [isExpired, setIsExpired] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [captureResult, setCaptureResult] = useState<CapturePaypalResponseData | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsExpired(false);
      setIsSuccess(false);
      setCaptureResult(null);
    }
  }, [isOpen]);

  const handleExpire = React.useCallback(() => {
    setIsExpired(true);
  }, []);

  const handleSuccess = React.useCallback(
    (captureData: CapturePaypalResponseData) => {
      if (!booking) return;
      console.log("[PayPal] Payment captured successfully:", captureData);
      setIsSuccess(true);
      setCaptureResult(captureData);

      if (onPaymentSuccess) {
        onPaymentSuccess(captureData);
      } else {
        // Redirection to the success page is temporarily stopped/commented out for testing:
        // router.push(
        //   href(
        //     `/payment/success?bookingId=${booking.bookingId}&orderId=${captureData.payPalOrderId || ""}&captureId=${captureData.payPalCaptureId || ""}`
        //   )
        // );
      }
    },
    [booking, onPaymentSuccess]
  );

  if (!isOpen || !booking) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dfe8e4] bg-[#f8faf9] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#2e6f57]/10 text-[#2e6f57]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#183c2f]">
                {t("payment.expiryModal.title")}
              </h2>
              <p className="text-[12px] font-medium text-[#667c74]">
                {t("payment.detailLabels.bookingNumber")}: #{booking.bookingNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-lg text-[#667c74] transition hover:bg-[#dfe8e4]/60 hover:text-[#183c2f]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Expiry Bar */}
        <ExpiryBar onExpire={handleExpire} />

        {/* Content Body */}
        <div className="space-y-4 p-6">
          {/* Booking Summary Box */}
          <div className="rounded-xl border border-[#dfe8e4] bg-[#fbfdfc] p-4 text-[13px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-[#183c2f]">{booking.title}</h3>
                {booking.subtitle && (
                  <p className="mt-0.5 text-[12px] text-[#667c74]">{booking.subtitle}</p>
                )}
              </div>
              <div className="text-right rtl:text-left">
                <span className="text-[11px] uppercase tracking-wider text-[#8a9a94]">
                  {t("payment.detailLabels.amountPaid")}
                </span>
                <p className="text-[16px] font-extrabold text-[#183c2f]">
                  {formatCurrency(booking.amount, booking.currency, 2)}
                </p>
              </div>
            </div>

            {/* Stay Dates / Details */}
            {booking.stayDates && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#edf2ef] pt-2.5 text-[12px] text-[#40544c]">
                <span>
                  <strong>{t("payment.detailLabels.checkIn")}:</strong> {booking.stayDates.checkIn}
                </span>
                <span>•</span>
                <span>
                  <strong>{t("payment.detailLabels.checkOut")}:</strong> {booking.stayDates.checkOut}
                </span>
                {typeof booking.guests === "number" && (
                  <>
                    <span>•</span>
                    <span>
                      <strong>{t("payment.detailLabels.guests")}:</strong> {booking.guests}
                    </span>
                  </>
                )}
              </div>
            )}

            {booking.transferDetails && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#edf2ef] pt-2.5 text-[12px] text-[#40544c]">
                <span>
                  <strong>{t("payment.detailLabels.pickupDate")}:</strong>{" "}
                  {booking.transferDetails.pickupDate} {booking.transferDetails.pickupTime}
                </span>
                <span>•</span>
                <span>
                  <strong>{t("payment.detailLabels.passengers")}:</strong>{" "}
                  {booking.transferDetails.passengers}
                </span>
              </div>
            )}
          </div>

          {/* Payment Success View (while redirect is commented out) */}
          {isSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <ShieldCheck className="size-6" />
              </div>
              <h4 className="mt-3 text-[16px] font-bold text-green-900">
                Payment Captured Successfully!
              </h4>
              <p className="mt-1 text-[13px] text-green-700">
                Payment has been successfully processed on the backend.
                <br />
                <span className="text-[12px] text-green-600">(Success redirect is paused for testing)</span>
              </p>
              {captureResult && (
                <div className="mt-3 rounded-lg bg-white/90 p-3 text-left font-mono text-[11px] text-[#183c2f] rtl:text-right">
                  <p><strong>Order ID:</strong> {captureResult.payPalOrderId || captureResult.transactionId}</p>
                  {captureResult.payPalCaptureId && (
                    <p><strong>Capture ID:</strong> {captureResult.payPalCaptureId}</p>
                  )}
                  {captureResult.paymentStatus && (
                    <p><strong>Status:</strong> {captureResult.paymentStatus}</p>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2e6f57] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#255f49]"
              >
                Close
              </button>
            </div>
          ) : isExpired ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="size-5" />
              </div>
              <h4 className="mt-2 text-[14px] font-bold text-red-800">Reservation Expired</h4>
              <p className="mt-1 text-[12px] text-red-600">
                The 5-minute temporary hold has elapsed. Please try booking again.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-red-700"
              >
                Close
              </button>
            </div>
          ) : (
            <PayPalProvider currency={booking.currency}>
              <div className="pt-1">
                <PayPalCheckout
                  bookingId={booking.bookingId}
                  onSuccess={handleSuccess}
                  onError={(err) => console.error("PAYPAL MODAL ERROR:", err)}
                />
              </div>
            </PayPalProvider>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-[#8a9a94]">
            <ShieldCheck className="size-3.5 text-[#2e6f57]" />
            <span>{t("payment.paypal.securePayment")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayPalPaymentModal;
