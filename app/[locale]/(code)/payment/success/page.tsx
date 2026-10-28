"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCapturePaypalPayment, CapturePaymentData } from "@/lib/hooks/usePayment";
import axiosInstance from "@/lib/api/axiosInstance";
import type { AdminBookingApiResponse, AdminBookingDetails } from "@/lib/types/booking";
import {
  clearPaymentBookingContext,
  PaymentBookingContext,
  PaymentBookingKind,
  readPaymentBookingContext,
} from "@/lib/utils/paymentBookingContext";
import { formatCurrency, formatUsd } from "@/lib/utils/currency";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

type PageState = "loading" | "success" | "error";
type BookingKind = PaymentBookingKind | "extension" | "booking";

type DetailRow = {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
};

const bookingCopy: Record<
  BookingKind,
  {
    label: string;
    title: string;
    message: string;
    next: string;
    retryHref: string;
  }
> = {
  rent: {
    label: "Rental",
    title: "Rental Booking Confirmed!",
    message: "Your rental booking has been successfully completed.",
    next: "We will confirm your stay details by email. Please keep your phone available in case we need to contact you before check-in.",
    retryHref: "/rent",
  },
  extension: {
    label: "Stay Extension",
    title: "Stay Extension Payment Confirmed!",
    message: "Your stay extension payment has been successfully completed.",
    next: "We will update the booking extension status after payment confirmation. Please keep your phone available in case our team needs to contact you.",
    retryHref: "/rent",
  },
  transfer: {
    label: "Transfer",
    title: "Transfer Booking Confirmed!",
    message: "Your transfer booking has been successfully completed.",
    next: "Our driver will contact you before your scheduled pickup. Please keep your phone available and check your email for the booking confirmation.",
    retryHref: "/transfer",
  },
  buy: {
    label: "Purchase",
    title: "Purchase Request Confirmed!",
    message: "Your property purchase request has been successfully completed.",
    next: "Our sales team will review your request and contact you with the next steps. Please keep your phone available and check your email for confirmation.",
    retryHref: "/buy",
  },
  booking: {
    label: "Booking",
    title: "Booking Confirmed!",
    message: "Your booking has been successfully completed.",
    next: "We will send your confirmation by email. Please keep your phone available in case our team needs to contact you.",
    retryHref: "/",
  },
};

function normalizeBookingType(value: unknown): BookingKind | null {
  if (value === undefined || value === null) return null;

  const normalized = String(value).trim().toLowerCase();
  if (["rent", "rental", "property", "propertybooking", "property-booking"].includes(normalized)) return "rent";
  if (["transfer", "journey"].includes(normalized)) return "transfer";
  if (["extension", "bookingextension", "booking-extension", "stayextension", "stay-extension"].includes(normalized)) return "extension";
  if (["buy", "buying", "purchase", "propertybuying", "property-buying"].includes(normalized)) return "buy";

  return null;
}

function resolveBookingKind(
  paymentData?: CapturePaymentData | null,
  context?: PaymentBookingContext | null
): BookingKind {
  const explicitType =
    normalizeBookingType(paymentData?.bookingType) ||
    normalizeBookingType(paymentData?.bookingCategory) ||
    normalizeBookingType(paymentData?.paymentTypeName) ||
    normalizeBookingType(paymentData?.paymentType) ||
    normalizeBookingType(paymentData?.type);

  if (explicitType) return explicitType;

  if (Number(paymentData?.paymentType) === 2) return "extension";
  if (paymentData?.bookingExtensionId) return "extension";

  const bookingNumber = paymentData?.bookingNumber || context?.bookingNumber || "";
  if (bookingNumber.startsWith("TR-")) return "transfer";
  if (bookingNumber.startsWith("BK-")) return "rent";

  return context?.kind || "rent";
}

function optionalDetail(label: string, value?: string | number | null): DetailRow | null {
  if (value === undefined || value === null || value === "") return null;
  return { label, value: String(value) };
}

function PaymentSuccessContent() {
  const { t, tArray, href, isRtl } = useI18n();
  const searchParams = useSearchParams();

  // Paymob redirect query params
  const paymobSuccess = searchParams.get("success");
  const paymobTxnId = searchParams.get("id");
  const paymobOrderId = searchParams.get("order");
  const paymobAmountCents = searchParams.get("amount_cents");
  const paymobCurrency = searchParams.get("currency") || "EGP";
  const paymobMessage = searchParams.get("data.message");

  // Legacy PayPal params
  const legacyToken = searchParams.get("token") || searchParams.get("orderId");

  const [bookingContext] = useState<PaymentBookingContext | null>(() => readPaymentBookingContext());
  const [bookingDetails, setBookingDetails] = useState<AdminBookingDetails | null>(null);
  const [paymentData, setPaymentData] = useState<CapturePaymentData | null>(null);

  const [state, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasExecutedRef = useRef(false);

  const { mutate: capturePaypalPayment } = useCapturePaypalPayment();

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    // ── Scenario A: Paymob Gateway Redirect ──────────────────────────────────
    if (paymobSuccess !== null) {
      if (paymobSuccess === "true") {
        // Payment succeeded
        const bookingId = bookingContext?.bookingId;
        if (bookingId) {
          // Fetch complete verified booking details from backend
          axiosInstance
            .get<AdminBookingApiResponse<AdminBookingDetails>>(`/api/property-bookings/${bookingId}`)
            .then((res) => {
              if (res.data?.data) {
                setBookingDetails(res.data.data);
              }
            })
            .catch((err) => {
              console.warn("Could not fetch server booking details", err);
            })
            .finally(() => {
              localStorage.removeItem("paypal_order_id");
              if (bookingContext?.propertyId) {
                try {
                  localStorage.removeItem(`rent_booking_draft_${bookingContext.propertyId}`);
                } catch {
                  // Ignore
                }
              }
              setPageState("success");
            });
        } else {
          setPageState("success");
        }
      } else {
        // Payment failed or was cancelled by user
        const reason =
          paymobMessage ||
          t("payment.statusMessages.declined") ||
          "Payment was declined or cancelled.";
        setErrorMessage(reason);
        setPageState("error");
      }
      return;
    }

    // ── Scenario B: Legacy PayPal Redirect ────────────────────────────────────
    if (legacyToken) {
      capturePaypalPayment(legacyToken, {
        onSuccess: (res) => {
          if (res.isSuccess && res.data) {
            localStorage.removeItem("paypal_order_id");
            clearPaymentBookingContext();
            setPaymentData(res.data);
            setPageState("success");
          } else {
            const errMsg = res.errors?.[0] ?? t("payment.genericFailed");
            setErrorMessage(errMsg);
            setPageState("error");
          }
        },
        onError: (err: unknown) => {
          const apiError = err as { response?: { data?: { errors?: string[]; message?: string } } };
          const msg = apiError.response?.data?.errors?.[0] || apiError.response?.data?.message;
          setErrorMessage(msg || t("payment.captureFailed"));
          setPageState("error");
        },
      });
      return;
    }

    // ── Scenario C: No parameter provided ─────────────────────────────────────
    if (bookingContext?.bookingNumber) {
      setPageState("success");
    } else {
      setErrorMessage(t("payment.sessionMissing"));
      setPageState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render Loading ────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 font-[var(--font-poppins)]">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="size-16 animate-spin rounded-full border-4 border-[#dfe8e4] border-t-[#2e6f57]" />
          <h1 className="text-[22px] font-semibold text-[#183c2f]">{t("payment.loadingTitle")}</h1>
          <p className="max-w-sm text-[14px] text-[#667c74]">
            {t("payment.loadingBody")}
          </p>
        </div>
      </main>
    );
  }

  // ── Render Success ────────────────────────────────────────────────────────
  if (state === "success") {
    const bookingKind = resolveBookingKind(paymentData, bookingContext);
    const localizedKind = tArray<string>(`payment.kinds.${bookingKind}`);
    const copy =
      localizedKind.length >= 4
        ? {
            label: localizedKind[0],
            title: localizedKind[1],
            message: localizedKind[2],
            next: localizedKind[3],
            retryHref: bookingCopy[bookingKind].retryHref,
          }
        : bookingCopy[bookingKind];

    // Compute display amount
    const paidAmountValue = paymobAmountCents
      ? Number(paymobAmountCents) / 100
      : bookingDetails?.paidAmount ?? paymentData?.amount ?? bookingContext?.amount ?? 0;
    const paidCurrencyValue = paymobCurrency || bookingDetails?.price ? "EGP" : paymentData?.currency || bookingContext?.currency || "EGP";

    const details: DetailRow[] = [
      {
        label: t("payment.detailLabels.bookingNumber"),
        value: bookingDetails?.bookingNumber || paymentData?.bookingNumber || bookingContext?.bookingNumber || "-",
        mono: true,
      },
      {
        label: t("payment.detailLabels.bookingType"),
        value: copy.label,
        strong: true,
      },
      {
        label: t("payment.detailLabels.paymentStatus"),
        value: bookingDetails?.statusName || paymentData?.paymentStatusName || "Paid",
        strong: true,
      },
      {
        label: t("payment.detailLabels.amountPaid"),
        value: `${paidCurrencyValue} ${paidAmountValue.toFixed(2)}`,
        strong: true,
      },
      {
        label: t("payment.detailLabels.transactionId"),
        value: paymobTxnId || paymentData?.transactionId || paymobOrderId || "-",
        mono: true,
      },
      optionalDetail(
        t("payment.detailLabels.property"),
        bookingDetails?.property?.propertyName || paymentData?.propertyName || bookingContext?.propertyName
      ),
      optionalDetail(
        t("payment.detailLabels.checkIn"),
        bookingDetails?.stay?.checkIn || paymentData?.checkIn || bookingContext?.checkIn
      ),
      optionalDetail(
        t("payment.detailLabels.checkOut"),
        bookingDetails?.stay?.checkOut || paymentData?.checkOut || bookingContext?.checkOut
      ),
      optionalDetail(
        t("payment.detailLabels.guests"),
        bookingDetails?.guest?.person || paymentData?.guests || bookingContext?.guests
      ),
    ].filter(Boolean) as DetailRow[];

    const retryTarget = bookingContext?.propertyId ? `/rent/${bookingContext.propertyId}` : copy.retryHref;

    return (
      <main className="bg-white font-[var(--font-poppins)] text-[#404944] min-h-[80vh] py-12">
        <section className="px-5 pb-12 pt-6 lg:px-0">
          <div className="mx-auto flex w-full max-w-[360px] flex-col items-center lg:max-w-[720px]">
            <SuccessIcon />
            <h1 className="mt-5 text-center text-[24px] font-bold leading-[40px] tracking-[-0.03em] text-[#183c2f] lg:mt-6 lg:text-[34px]">
              {copy.title}
            </h1>
            <div className="mt-2 text-center text-[13px] leading-6 text-[#667c74] lg:text-[15px]">
              <p>{copy.message}</p>
            </div>

            {/* Details Summary Card */}
            <section className="mt-6 flex w-full flex-col gap-6 rounded-2xl border border-[#dfe8e4] bg-[#fbfdfc] p-5 shadow-sm lg:mt-10 lg:p-8">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:gap-x-10 lg:gap-y-7">
                {details.map((d) => (
                  <div key={d.label} className="min-w-0">
                    <dt className="text-[12px] font-semibold tracking-wide text-[#667c74]">{d.label}</dt>
                    <dd
                      className={`mt-1.5 break-all leading-6 ${
                        d.strong
                          ? "text-[14px] font-bold text-[#183c2f] lg:text-[16px]"
                          : d.mono
                          ? "font-mono text-[12px] font-semibold text-[#2e6f57] lg:text-[14px]"
                          : "text-[13px] font-medium text-[#414847] lg:text-[15px]"
                      }`}
                    >
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* What's Next Box */}
              <div className="flex w-full items-start gap-4 rounded-xl border border-[#dfe8e4] bg-white p-5 lg:gap-5">
                <InfoIcon />
                <div className="min-w-0">
                  <h2 className="text-[14px] font-bold leading-5 text-[#183c2f]">{t("payment.whatsNext")}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#667c74]">{copy.next}</p>
                </div>
              </div>
            </section>

            {/* Navigation buttons */}
            <div className="mt-8 flex w-full flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={href(retryTarget)}
                className="flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center rounded-full bg-[#2e6f57] px-6 text-[14px] font-semibold text-white shadow transition hover:bg-[#255f49]"
              >
                {t("property.vacationHomes") || "Browse Homes"}
              </Link>
              <Link
                href={href("/")}
                className="flex h-12 w-full sm:w-auto min-w-[160px] items-center justify-center rounded-full border border-[#dfe8e4] bg-white px-6 text-[14px] font-medium text-[#667c74] transition hover:bg-[#f5f7f6]"
              >
                {t("common.backToHome")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Render Error / Declined ───────────────────────────────────────────────
  const errorKind = resolveBookingKind(null, bookingContext);
  const errorCopy = bookingCopy[errorKind];
  const retryTarget = bookingContext?.propertyId ? `/rent/${bookingContext.propertyId}` : errorCopy.retryHref;

  return (
    <main className="bg-white font-[var(--font-poppins)] text-[#404944] min-h-[80vh] py-12">
      <section className="px-5 pb-12 pt-6 lg:px-0">
        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center lg:max-w-[700px]">
          <ErrorIcon />
          <h1 className="mt-5 text-center text-[24px] font-bold leading-[40px] tracking-[-0.03em] text-[#183c2f] lg:mt-6 lg:text-[34px]">
            {t("payment.failedTitle")}
          </h1>
          <div className="mt-2 text-center text-[13px] leading-6 text-[#667c74] lg:text-[15px]">
            <p className="max-w-md">{t("payment.failedBody")}</p>
          </div>

          {/* Error Reason Banner */}
          {errorMessage && (
            <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50/90 p-4 text-center text-[14px] text-red-700 font-medium">
              <div className="flex items-center justify-center gap-2">
                <svg className="size-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Booking Context Preview */}
          {bookingContext && (
            <div className="mt-6 w-full rounded-2xl border border-[#dfe8e4] bg-[#fbfdfc] p-5 text-[13px]">
              <div className="flex justify-between py-1 border-b border-[#edf2ef]">
                <span className="text-[#667c74]">{t("payment.detailLabels.bookingNumber")}</span>
                <span className="font-mono font-bold text-[#183c2f]">{bookingContext.bookingNumber || "-"}</span>
              </div>
              {bookingContext.propertyName && (
                <div className="flex justify-between py-1 border-b border-[#edf2ef]">
                  <span className="text-[#667c74]">{t("payment.detailLabels.property")}</span>
                  <span className="font-semibold text-[#183c2f]">{bookingContext.propertyName}</span>
                </div>
              )}
              {bookingContext.checkIn && bookingContext.checkOut && (
                <div className="flex justify-between py-1">
                  <span className="text-[#667c74]">{t("property.availability")}</span>
                  <span className="font-medium text-[#183c2f]">
                    {bookingContext.checkIn} → {bookingContext.checkOut}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex w-full flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={href(retryTarget)}
              className="flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center rounded-full bg-[#2e6f57] px-6 text-[14px] font-semibold text-white shadow transition hover:bg-[#255f49]"
            >
              {t("payment.statusMessages.tryAgain") || t("common.tryAgain")}
            </Link>
            <Link
              href={href("/")}
              className="flex h-12 w-full sm:w-auto min-w-[160px] items-center justify-center rounded-full border border-[#dfe8e4] bg-white px-6 text-[14px] font-medium text-[#667c74] transition hover:bg-[#f5f7f6]"
            >
              {t("common.backToHome")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">
          <span className="size-10 animate-spin rounded-full border-4 border-[#dfe8e4] border-t-[#2e6f57]" />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

function SuccessIcon() {
  return (
    <div className="relative grid size-28 shrink-0 place-items-center lg:size-36" aria-hidden="true">
      <span className="absolute size-28 rounded-full bg-[#eef7f3] opacity-60 lg:size-36" />
      <span className="relative grid size-20 place-items-center rounded-full bg-[#dfeee7] lg:size-24">
        <span className="grid size-14 place-items-center rounded-full bg-[#2e6f57] lg:size-16 shadow-lg shadow-[#2e6f57]/20">
          <svg className="size-7 text-white lg:size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </span>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="relative grid size-28 shrink-0 place-items-center lg:size-36" aria-hidden="true">
      <span className="absolute size-28 rounded-full bg-red-50 opacity-60 lg:size-36" />
      <span className="relative grid size-20 place-items-center rounded-full bg-red-100 lg:size-24">
        <span className="grid size-14 place-items-center rounded-full bg-red-500 lg:size-16 shadow-lg shadow-red-500/20">
          <svg className="size-7 text-white lg:size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg className="mt-0.5 size-5 shrink-0 text-[#2e6f57]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
