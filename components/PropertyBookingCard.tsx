"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Clock, CreditCard, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { useI18n } from "./I18nProvider";
import type { PendingBookingPayment } from "@/components/payment/PayPalPaymentModal";
import type { CalendarDay } from "./SinglePropertyPageContent";

interface PropertyBookingCardProps {
  idPrefix?: string;
  propertyId: string;
  propertyName: string;
  basePrice: number;
  currencyCode?: string;
  capacity: number;
  rating?: number;
  totalReviews?: number;
  todayString: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  onClearDates: () => void;
  isDateBooked?: (dateString: string) => boolean;
  onSelectDate?: (day: CalendarDay) => void;
  bookingForm: {
    fullName: string;
    email: string;
    phone: string;
    person: number;
  };
  setBookingForm: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      email: string;
      phone: string;
      person: number;
    }>
  >;
  hasAcceptedRules: boolean;
  setHasAcceptedRules: (accepted: boolean) => void;
  formError: string;
  isPending: boolean;
  isCheckingPrice: boolean;
  isPriceUnavailable: boolean;
  estimatedTotal: number;
  missingDates: string[];
  onSubmitBooking: (e: React.FormEvent<HTMLFormElement>) => void;
  onScrollToCalendar?: () => void;
  activeHold?: PendingBookingPayment | null;
  onResumeHold?: () => void;
  onCancelHold?: () => void;
}

export default function PropertyBookingCard({
  idPrefix,
  basePrice,
  currencyCode = "USD",
  capacity,
  rating = 0,
  totalReviews = 0,
  todayString,
  checkIn,
  checkOut,
  nights,
  onCheckInChange,
  onCheckOutChange,
  onClearDates,
  isDateBooked,
  onSelectDate,
  bookingForm,
  setBookingForm,
  hasAcceptedRules,
  setHasAcceptedRules,
  formError,
  isPending,
  isCheckingPrice,
  isPriceUnavailable,
  estimatedTotal,
  missingDates,
  onSubmitBooking,
  onScrollToCalendar,
  activeHold,
  onResumeHold,
  onCancelHold,
}: PropertyBookingCardProps) {
  const { t, href, locale } = useI18n();
  const isFormValid =
    !isPending &&
    !isPriceUnavailable &&
    bookingForm.fullName.trim() !== "" &&
    bookingForm.email.trim() !== "" &&
    bookingForm.phone.trim() !== "" &&
    Boolean(checkIn) &&
    Boolean(checkOut) &&
    checkOut > checkIn &&
    bookingForm.person <= capacity &&
    hasAcceptedRules;

  // Custom calendar popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // Initial month view from checkIn or todayString
  const [viewYear, setViewYear] = useState(() => {
    if (checkIn && checkIn.length >= 10) return parseInt(checkIn.slice(0, 4), 10);
    return parseInt(todayString.slice(0, 4), 10);
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (checkIn && checkIn.length >= 10) return parseInt(checkIn.slice(5, 7), 10) - 1;
    return parseInt(todayString.slice(5, 7), 10) - 1;
  });

  // When checkIn changes externally, sync view
  useEffect(() => {
    if (checkIn && checkIn.length >= 10 && isCalendarOpen) {
      setViewYear(parseInt(checkIn.slice(0, 4), 10));
      setViewMonth(parseInt(checkIn.slice(5, 7), 10) - 1);
    }
  }, [checkIn, isCalendarOpen]);

  // Click outside to close calendar
  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(e.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  // Month navigation
  const todayYear = parseInt(todayString.slice(0, 4), 10);
  const todayMonth = parseInt(todayString.slice(5, 7), 10) - 1;
  const canGoPrev = viewYear > todayYear || (viewYear === todayYear && viewMonth > todayMonth);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = new Date(viewYear, viewMonth, 1).getDay();
  const monthDate = new Date(viewYear, viewMonth, 1);
  const monthTitle = monthDate.toLocaleString(locale, { month: "long", year: "numeric" });

  const handleDayClick = (dayDate: string, dayNum: number) => {
    const isPast = dayDate < todayString;
    const isBooked = isDateBooked ? isDateBooked(dayDate) : false;
    if (isPast || isBooked) return;

    if (onSelectDate) {
      onSelectDate({
        day: dayNum,
        date: dayDate,
        status: "available",
      });
      if (checkIn && !checkOut && dayDate > checkIn) {
        setIsCalendarOpen(false);
      }
    } else {
      if (!checkIn || checkOut || dayDate <= checkIn) {
        onCheckInChange(dayDate);
        onCheckOutChange("");
      } else {
        onCheckOutChange(dayDate);
        setIsCalendarOpen(false);
      }
    }
  };

  return (
    <div
      id={idPrefix ? `booking-card-${idPrefix}` : "booking-card"}
      className="scroll-mt-24 rounded-2xl border border-[#dfe8e4] bg-white p-4 shadow-[0_4px_24px_rgba(24,60,47,0.06)] transition hover:shadow-[0_8px_32px_rgba(24,60,47,0.1)] sm:p-5"
    >
      {/* ─── Card Header: Price & Rating ─── */}
      <div className="flex items-baseline justify-between border-b border-[#edf2ef] pb-3.5">
        <div>
          <span className="text-[26px] font-bold text-[#183c2f] lg:text-[28px]">
            {formatCurrency(basePrice, currencyCode)}
          </span>
          <span className="text-[13px] font-medium text-[#667c74]"> / {t("common.night")}</span>
        </div>

        {totalReviews > 0 ? (
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#183c2f]">
            <span className="text-[#cfb072]">★</span>
            <span>{rating.toFixed(1)}</span>
            <span className="text-[12px] font-normal text-[#8a9a94]">
              ({totalReviews})
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f7f5] px-2.5 py-1 text-[11px] font-semibold text-[#2e6f57]">
            ★ New
          </span>
        )}
      </div>

      {/* ─── Active Hold Notice Banner ─── */}
      {activeHold && (
        <div className="mt-3.5 rounded-xl border border-amber-300 bg-[#fef9ec] p-3.5 text-amber-900 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-[#cfb072] animate-pulse" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[12.5px] font-bold text-[#183c2f]">
                  {t("payment.hold.activeTitle") || "Active Reservation Hold"}
                </p>
                <span className="font-mono text-[11px] font-bold text-[#2e6f57]">
                  #{activeHold.bookingNumber}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#667c74]">
                {t("payment.hold.holdingNotice") ||
                  "Your selected dates are temporarily held. Complete payment before the hold expires."}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onResumeHold}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2e6f57] px-3 py-1.5 text-[11.5px] font-bold text-white shadow-xs transition hover:bg-[#255f49]"
                >
                  <CreditCard className="size-3.5" />
                  <span>{t("payment.hold.resumeButton") || "Resume Payment"}</span>
                </button>
                {onCancelHold && (
                  <button
                    type="button"
                    onClick={onCancelHold}
                    className="rounded-lg border border-[#dfe8e4] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#667c74] transition hover:bg-[#edf2ef] hover:text-red-600"
                  >
                    {t("payment.hold.cancelButton") || "Cancel Hold"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmitBooking} className="mt-3.5 space-y-3.5">
        {/* ─── Date Picker Trigger & Custom Availability Calendar Popover ─── */}
        <div ref={calendarContainerRef} className="relative">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsCalendarOpen((prev) => !prev);
              }
            }}
            className={`cursor-pointer rounded-xl border bg-[#fbfdfc] p-3 transition ${
              isCalendarOpen
                ? "border-[#2e6f57] ring-2 ring-[#2e6f57]/15"
                : "border-[#dfe8e4] hover:border-[#2e6f57]"
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#667c74]">
                  {t("booking.checkIn")}
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-[13px] font-semibold ${checkIn ? "text-[#183c2f]" : "text-[#8a9a94]"}`}>
                    {checkIn || t("booking.selectDates")}
                  </span>
                  <Calendar className="size-4 text-[#2e6f57]" />
                </div>
              </div>
              <div className="border-l border-[#dfe8e4] pl-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#667c74]">
                  {t("booking.checkout")}
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className={`text-[13px] font-semibold ${checkOut ? "text-[#183c2f]" : "text-[#8a9a94]"}`}>
                    {checkOut || t("booking.selectDates")}
                  </span>
                  <Calendar className="size-4 text-[#2e6f57]" />
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-[#edf2ef] pt-2 text-[11px]">
              <span className="text-[#667c74]">
                {checkIn && checkOut
                  ? t("booking.selectedRange", {
                      count: nights,
                      label: nights === 1 ? t("common.night") : t("common.nights"),
                    })
                  : checkIn
                  ? t("booking.selectCheckout")
                  : t("booking.selectDates")}
              </span>
              <div className="flex items-center gap-2">
                {onScrollToCalendar && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCalendarOpen(false);
                      onScrollToCalendar();
                    }}
                    className="font-medium text-[#2e6f57] hover:underline"
                  >
                    {t("property.viewCalendar")}
                  </button>
                )}
                {(checkIn || checkOut) && (
                  <>
                    <span className="text-[#d0ded8]">•</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearDates();
                      }}
                      className="font-medium text-[#cfb072] hover:underline"
                    >
                      {t("common.clear")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ─── Interactive Popover Calendar (Only available dates selectable) ─── */}
          {isCalendarOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[#dfe8e4] bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {/* Header Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-[#edf2ef]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevMonth();
                  }}
                  disabled={!canGoPrev}
                  className="flex size-8 items-center justify-center rounded-lg text-[#667c74] transition hover:bg-[#edf2ef] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                </button>
                <span className="text-[13px] font-bold text-[#183c2f] capitalize">
                  {monthTitle}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextMonth();
                  }}
                  className="flex size-8 items-center justify-center rounded-lg text-[#667c74] transition hover:bg-[#edf2ef]"
                  aria-label="Next Month"
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Status Hint */}
              <div className="py-2 text-center text-[11px] font-medium text-[#2e6f57]">
                {!checkIn
                  ? t("booking.selectDates") || "Select check-in date"
                  : !checkOut
                  ? t("booking.selectCheckout") || "Select check-out date"
                  : t("booking.selectedRange", {
                      count: nights,
                      label: nights === 1 ? t("common.night") : t("common.nights"),
                    })}
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold text-[#8a9a94]">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                  <span key={dayName} className="py-1">
                    {dayName}
                  </span>
                ))}
              </div>

              {/* Days grid */}
              <div className="mt-1 grid grid-cols-7 gap-1">
                {Array.from({ length: startOffset }).map((_, i) => (
                  <span key={`blank-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInViewMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const isPast = dayDate < todayString;
                  const isBooked = isDateBooked ? isDateBooked(dayDate) : false;
                  const isDisabled = isPast || isBooked;
                  const isStart = dayDate === checkIn;
                  const isEnd = dayDate === checkOut;
                  const isRangeEdge = isStart || isEnd;
                  const isInRange = Boolean(checkIn && checkOut && dayDate > checkIn && dayDate < checkOut);

                  return (
                    <button
                      key={dayDate}
                      type="button"
                      disabled={isDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(dayDate, dayNum);
                      }}
                      className={`flex h-8 items-center justify-center rounded-lg text-[11.5px] transition ${
                        isRangeEdge
                          ? "bg-[#2e6f57] font-bold text-white shadow-xs"
                          : isInRange
                          ? "bg-[#2e6f57]/15 font-semibold text-[#183c2f]"
                          : isBooked
                          ? "bg-[#e9eef3] text-[#94a3b8] line-through opacity-60 cursor-not-allowed select-none"
                          : isPast
                          ? "text-[#cbd5e1] cursor-not-allowed opacity-40 select-none"
                          : "bg-[#f5f7f6] text-[#2e6f57] font-bold border border-[#2e6f57]/20 hover:bg-[#2e6f57] hover:text-white"
                      }`}
                      title={isBooked ? t("property.booked") || "Booked" : dayDate}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Legend & Close Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-[#edf2ef] pt-2.5 text-[11px] text-[#667c74]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#2e6f57]" />
                    {t("property.available") || "Available"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#94a3b8]" />
                    {t("property.booked") || "Booked"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCalendarOpen(false);
                  }}
                  className="rounded-lg bg-[#edf2ef] px-2.5 py-1 text-[11px] font-semibold text-[#183c2f] transition hover:bg-[#dfe8e4]"
                >
                  {t("common.close") || "Close"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Guests Selector ─── */}
        <div>
          <label className="block text-[12px] font-semibold text-[#183c2f]">
            {t("common.guests")}
          </label>
          <select
            value={bookingForm.person}
            onChange={(e) =>
              setBookingForm((prev) => ({
                ...prev,
                person: Number(e.target.value),
              }))
            }
            className="mt-1.5 h-11 w-full rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] text-[#183c2f] outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57]"
          >
            {Array.from(
              { length: Math.max(1, capacity) },
              (_, index) => index + 1
            ).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? t("common.guest") : t("common.guests")}{" "}
                {count === capacity ? `(${t("common.maxCapacity")})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* ─── Guest Contact Fields ─── */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[12px] font-semibold text-[#183c2f]">
              {t("booking.fullName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t("booking.fullNamePlaceholder")}
              value={bookingForm.fullName}
              onChange={(e) =>
                setBookingForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] text-[#183c2f] outline-none transition placeholder:text-[#aab4b0] focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#183c2f]">
              {t("booking.email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder={t("booking.emailPlaceholder")}
              value={bookingForm.email}
              onChange={(e) =>
                setBookingForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] text-[#183c2f] outline-none transition placeholder:text-[#aab4b0] focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#183c2f]">
              {t("booking.phone")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder={t("booking.phonePlaceholder")}
              value={bookingForm.phone}
              onChange={(e) =>
                setBookingForm((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/[^\d+]/g, ""),
                }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] text-[#183c2f] outline-none transition placeholder:text-[#aab4b0] focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57]"
            />
          </div>
        </div>

        {/* ─── Price Breakdown Summary ─── */}
        <div className="rounded-xl border border-[#edf2ef] bg-[#fbfdfc] p-4">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#183c2f]">
            {t("booking.priceSummary")}
          </h4>
          <dl className="mt-2.5 space-y-2 text-[13px]">
            <div className="flex justify-between text-[#667c74]">
              <span>
                {formatCurrency(basePrice, currencyCode)} × {nights || 0}{" "}
                {nights === 1 ? t("common.night") : t("common.nights")}
              </span>
              <span className="font-semibold text-[#183c2f]">
                {isCheckingPrice && checkIn && checkOut
                  ? t("common.checking")
                  : formatCurrency(estimatedTotal, currencyCode)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#edf2ef] pt-2 text-[14px]">
              <span className="font-bold text-[#183c2f]">{t("common.total")}</span>
              <span className="text-[17px] font-bold text-[#2e6f57]">
                {isCheckingPrice && checkIn && checkOut
                  ? t("common.checking")
                  : formatCurrency(estimatedTotal, currencyCode)}
              </span>
            </div>
            {checkIn && checkOut && !isCheckingPrice && estimatedTotal > 0 ? (
              <div className="mt-2 rounded-lg border border-[#2e6f57]/20 bg-[#edf6f2] px-3 py-2 text-[12px]">
                <div className="flex items-center justify-between font-semibold text-[#183c2f]">
                  <span>{t("payment.detailLabels.depositDueNow")}</span>
                  <span className="font-bold text-[#2e6f57]">
                    {formatCurrency(Math.round(estimatedTotal * 0.5 * 100) / 100, currencyCode)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#667c74]">
                  <span>{t("payment.detailLabels.remainingBalance")}</span>
                  <span className="font-medium text-[#40544c]">
                    {formatCurrency(
                      Math.round((estimatedTotal - Math.round(estimatedTotal * 0.5 * 100) / 100) * 100) / 100,
                      currencyCode
                    )}
                  </span>
                </div>
              </div>
            ) : null}
          </dl>
          {!checkIn || !checkOut ? (
            <p className="mt-2 text-[11px] text-[#8a9a94]">
              {t("booking.selectDatesPrice")}
            </p>
          ) : null}
        </div>

        {/* Alerts & Errors */}
        {isPriceUnavailable && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-700">
            {t("booking.pricingMissing", { dates: missingDates.length ? missingDates.join(", ") : t("booking.selectDates") })}
          </div>
        )}

        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-600">
            {formError}
          </div>
        )}

        {/* House Rules Acceptance */}
        <label className="flex items-start gap-2.5 text-[12px] leading-5 text-[#656566] cursor-pointer">
          <input
            type="checkbox"
            checked={hasAcceptedRules}
            onChange={(e) => setHasAcceptedRules(e.target.checked)}
            className="mt-0.5 size-4 rounded accent-[#2e6f57] cursor-pointer"
          />
          <span>
            {t("booking.rulesAgreement")}{" "}
            <Link
              href={href("/house-rules")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2e6f57] underline hover:text-[#183c2f]"
            >
              {t("common.houseRules")}
            </Link>
            .
          </span>
        </label>

        {/* Submit / Resume CTA Button */}
        {activeHold && onResumeHold ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onResumeHold}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2e6f57] text-[15px] font-semibold text-white shadow-md transition-all hover:bg-[#255f49] hover:shadow-lg active:scale-[0.99]"
            >
              <CreditCard className="size-4.5" />
              <span>{t("payment.hold.resumeButton") || "Resume Payment"}</span>
              <svg
                className="size-4 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            {onCancelHold && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onCancelHold}
                  className="text-[11.5px] font-medium text-[#667c74] underline transition hover:text-red-600"
                >
                  {t("payment.hold.changeDatesPrompt") || "Want to select different dates? Cancel hold"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2e6f57] text-[15px] font-semibold text-white shadow-md transition-all hover:bg-[#255f49] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>{t("common.processing")}</span>
              </>
            ) : (
              <>
                <span>{t("payment.paypal.payButton") || t("common.bookNow")}</span>
                <svg
                  className="size-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        )}

        {/* Trust Badges */}
        <div className="space-y-2 border-t border-[#edf2ef] pt-3.5 text-[12px] text-[#667c74]">
          <div className="flex items-center gap-2">
            <svg
              className="size-4 text-[#2e6f57] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>{t("payment.paypal.securePayment") || t("booking.secure")}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
