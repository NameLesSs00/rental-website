"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldCheck, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { PayPalProvider } from "./PayPalProvider";
import { PayPalCheckout } from "./PayPalCheckout";
import { PaymobCheckout } from "./PaymobCheckout";
import { PaymentMethodSelector, type PaymentGatewayMethod } from "./PaymentMethodSelector";
import type { CapturePaypalResponseData } from "@/lib/hooks/usePayment";
import { formatCurrency } from "@/lib/utils/currency";

export interface BookingPriceBreakdown {
  total: number;
  deposit: number;
  remaining: number;
}

export interface PendingBookingPayment {
  kind: "rent" | "transfer";
  bookingId: string;
  bookingNumber: string;
  title: string;
  subtitle?: string;
  usd: BookingPriceBreakdown;
  egp: BookingPriceBreakdown;
  /** Legacy fields for backward compatibility */
  amount?: number;
  currency?: string;
  amountUsd?: number;
  stayDates?: {
    checkIn: string;
    checkOut: string;
    nights?: number;
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
    <div className="flex shrink-0 items-center justify-between border-b border-[#fef3d6] bg-[#fef9ec] px-6 py-2.5 text-[12px] text-[#8a6814]">
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
  const { t, tArray, isRtl } = useI18n();
  const [isExpired, setIsExpired] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [captureResult, setCaptureResult] = useState<CapturePaypalResponseData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayMethod>("paypal");

  // Lock body scroll and listen for Escape key when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
      setIsExpired(false);
      setIsSuccess(false);
      setCaptureResult(null);
      setPaymentMethod("paypal");
    }
  }, [isOpen, onClose]);

  const handleExpire = React.useCallback(() => {
    setIsExpired(true);
  }, []);

  const handleSuccess = React.useCallback(
    (captureData: CapturePaypalResponseData) => {
      if (!booking) return;
      console.log("[PayPal] Payment captured successfully:", captureData);
      setIsSuccess(true);
      setCaptureResult(captureData);
      onPaymentSuccess?.(captureData);
    },
    [booking, onPaymentSuccess]
  );

  if (!isOpen || !booking) return null;

  const usdBreakdown: BookingPriceBreakdown = booking.usd || {
    total: Math.round((booking.amountUsd || booking.amount || 0) * 10 * 100) / 100,
    deposit: booking.amountUsd || booking.amount || 0,
    remaining: Math.round((booking.amountUsd || booking.amount || 0) * 9 * 100) / 100,
  };

  const egpBreakdown: BookingPriceBreakdown = booking.egp || {
    total: Math.round(usdBreakdown.total * 50 * 100) / 100,
    deposit: Math.round(usdBreakdown.deposit * 50 * 100) / 100,
    remaining: Math.round(usdBreakdown.remaining * 50 * 100) / 100,
  };

  const activeBreakdown = paymentMethod === "paypal" ? usdBreakdown : egpBreakdown;
  const activeCurrency = paymentMethod === "paypal" ? "USD" : "EGP";

  const localizedKind = tArray<string>(`payment.kinds.${booking.kind}`);
  const successCopy =
    localizedKind.length >= 4
      ? {
          label: localizedKind[0],
          title: localizedKind[1],
          message: localizedKind[2],
          next: localizedKind[3],
        }
      : {
          label: booking.kind === "transfer" ? "Transfer" : "Rental",
          title: booking.kind === "transfer" ? "Transfer Booking Confirmed!" : "Rental Booking Confirmed!",
          message: "Your booking has been successfully completed.",
          next: "We will confirm your stay details by email. Please keep your phone available in case we need to contact you before check-in.",
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className={`fixed inset-y-0 ${
          isRtl ? "left-0" : "right-0"
        } z-[100] flex w-full max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-[560px] md:max-w-[580px]`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#dfe8e4] bg-[#f8faf9] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#2e6f57]/10 text-[#2e6f57]">
              {isSuccess ? <CheckCircle2 className="size-5" /> : <ShieldCheck className="size-5" />}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#183c2f]">
                {isSuccess ? successCopy.title : t("payment.expiryModal.title")}
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

        {/* Fixed Expiry Bar (hidden once paid) */}
        {!isSuccess && <ExpiryBar onExpire={handleExpire} />}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 overscroll-contain">
          {isSuccess ? (
            <div className="space-y-5 py-2">
              {/* Success Hero */}
              <div className="flex flex-col items-center text-center">
                <div className="relative grid size-20 shrink-0 place-items-center">
                  <span className="absolute size-20 rounded-full bg-[#eef7f3] opacity-70" />
                  <span className="relative grid size-14 place-items-center rounded-full bg-[#dfeee7]">
                    <span className="grid size-10 place-items-center rounded-full bg-[#2e6f57] shadow-md shadow-[#2e6f57]/20">
                      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </span>
                </div>
                <h3 className="mt-3 text-[20px] font-bold text-[#183c2f]">
                  {successCopy.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#667c74]">
                  {successCopy.message}
                </p>
              </div>

              {/* Details Summary Card (matching Success Page) */}
              <div className="rounded-2xl border border-[#dfe8e4] bg-[#fbfdfc] p-5 shadow-xs space-y-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-[13px]">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.bookingNumber")}
                    </dt>
                    <dd className="mt-1 font-mono text-[13px] font-semibold text-[#2e6f57]">
                      #{booking.bookingNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.bookingType")}
                    </dt>
                    <dd className="mt-1 font-bold text-[#183c2f]">
                      {successCopy.label}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.paymentStatus")}
                    </dt>
                    <dd className="mt-1 font-bold text-[#2e6f57]">
                      {captureResult?.paymentStatus || "Paid"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.amountPaid")}
                    </dt>
                    <dd className="mt-1 font-bold text-[#2e6f57]">
                      {formatCurrency(usdBreakdown.deposit, "USD", 2)} (10%)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.remainingBalance")}
                    </dt>
                    <dd className="mt-1 font-bold text-[#183c2f]">
                      {formatCurrency(usdBreakdown.remaining, "USD", 2)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {t("payment.detailLabels.transactionId")}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-[12px] font-semibold text-[#2e6f57]">
                      {captureResult?.payPalCaptureId || captureResult?.payPalOrderId || captureResult?.transactionId || "-"}
                    </dd>
                  </div>
                  <div className="col-span-2 border-t border-[#edf2ef] pt-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                      {booking.kind === "transfer" ? t("payment.detailLabels.transfer") : t("payment.detailLabels.property")}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#183c2f]">
                      {booking.title}
                    </dd>
                  </div>
                  {booking.stayDates && (
                    <>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                          {t("payment.detailLabels.checkIn")}
                        </dt>
                        <dd className="mt-1 font-medium text-[#414847]">
                          {booking.stayDates.checkIn}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                          {t("payment.detailLabels.checkOut")}
                        </dt>
                        <dd className="mt-1 font-medium text-[#414847]">
                          {booking.stayDates.checkOut}
                        </dd>
                      </div>
                      {typeof booking.guests === "number" && (
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                            {t("payment.detailLabels.guests")}
                          </dt>
                          <dd className="mt-1 font-medium text-[#414847]">
                            {booking.guests}
                          </dd>
                        </div>
                      )}
                    </>
                  )}
                  {booking.transferDetails && (
                    <>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                          {t("payment.detailLabels.pickupDate")}
                        </dt>
                        <dd className="mt-1 font-medium text-[#414847]">
                          {booking.transferDetails.pickupDate} {booking.transferDetails.pickupTime}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#667c74]">
                          {t("payment.detailLabels.passengers")}
                        </dt>
                        <dd className="mt-1 font-medium text-[#414847]">
                          {booking.transferDetails.passengers}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>

                {/* What's Next Box */}
                <div className="flex items-start gap-3 rounded-xl border border-[#dfe8e4] bg-white p-3.5">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#2e6f57]" />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-[#183c2f]">{t("payment.whatsNext")}</h4>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[#667c74]">
                      {t("payment.detailLabels.remainingNotice")}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#2e6f57] px-6 text-[14px] font-semibold text-white shadow transition hover:bg-[#255f49]"
              >
                {t("common.close") || "Done"}
              </button>
            </div>
          ) : (
            <>
              {/* Clean Transparent Price Breakdown Card */}
              <div className="rounded-2xl border border-[#dfe8e4] bg-[#fbfdfc] p-4 text-[13px] shadow-xs space-y-3.5">
                {/* Property / Transfer Heading */}
                <div>
                  <h3 className="text-[15px] font-bold text-[#183c2f] leading-snug">{booking.title}</h3>
                  {booking.subtitle && (
                    <p className="mt-0.5 text-[12px] text-[#667c74]">{booking.subtitle}</p>
                  )}
                </div>

                {/* Stay Dates / Passenger pill */}
                {booking.stayDates && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-[#f4f7f5] px-3 py-2 text-[12px] text-[#40544c]">
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
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-[#f4f7f5] px-3 py-2 text-[12px] text-[#40544c]">
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

                {/* Price Breakdown Rows */}
                <div className="border-t border-[#edf2ef] pt-3 space-y-2.5">
                  {/* Total Price */}
                  <div className="flex items-center justify-between text-[#667c74] px-0.5">
                    <span className="text-[12px] font-medium">{t("payment.detailLabels.totalPrice")}</span>
                    <span className="text-[13px] font-semibold text-[#183c2f]">
                      {formatCurrency(activeBreakdown.total, activeCurrency, 2)}
                    </span>
                  </div>

                  {/* 10% Deposit (Pay Online Now) Highlight Box */}
                  <div className="rounded-xl border border-[#2e6f57]/20 bg-[#edf6f2] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[#183c2f]">
                            {t("payment.detailLabels.depositDueNow")}
                          </span>
                          <span className="rounded bg-[#2e6f57] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                            {t("payment.detailLabels.payOnlineNow")}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium text-[#2e6f57]">
                          {paymentMethod === "paypal"
                            ? t("payment.detailLabels.processedInUsdNotice")
                            : t("payment.detailLabels.processedInEgpNotice")}
                        </p>
                      </div>
                      <div className="text-right rtl:text-left">
                        <p className="text-[17px] font-black text-[#2e6f57]">
                          {formatCurrency(activeBreakdown.deposit, activeCurrency, 2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remaining 90% (Due at Check-in) */}
                  <div className="flex items-center justify-between px-0.5 pt-0.5 text-[#667c74]">
                    <div>
                      <span className="text-[12px] font-medium text-[#40544c]">
                        {t("payment.detailLabels.remainingBalance")}
                      </span>
                      <p className="text-[11px] text-[#8a9a94]">
                        {t("payment.detailLabels.payOnArrival")}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#40544c]">
                      {formatCurrency(activeBreakdown.remaining, activeCurrency, 2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway or Expired */}
              {isExpired ? (
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
                <div className="space-y-4">
                  {/* Payment Gateway Selector */}
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                    currency={activeCurrency}
                  />

                  {/* Dynamic Gateway View */}
                  {paymentMethod === "paypal" ? (
                    <PayPalProvider currency="USD">
                      <div className="pt-1">
                        <PayPalCheckout
                          bookingId={booking.bookingId}
                          onSuccess={handleSuccess}
                          onError={(err) => console.error("PAYPAL MODAL ERROR:", err)}
                        />
                      </div>
                    </PayPalProvider>
                  ) : (
                    <PaymobCheckout
                      bookingId={booking.bookingId}
                      bookingNumber={booking.bookingNumber}
                      amount={egpBreakdown.deposit}
                      currency="EGP"
                      kind={booking.kind}
                      onError={(err) => console.error("PAYMOB MODAL ERROR:", err)}
                    />
                  )}
                </div>
              )}
            </>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-4 text-center text-[11px] text-[#8a9a94]">
            <ShieldCheck className="size-3.5 text-[#2e6f57]" />
            <span>
              {paymentMethod === "paypal"
                ? t("payment.paypal.securePayment")
                : t("payment.paymob.securePayment")}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default PayPalPaymentModal;
