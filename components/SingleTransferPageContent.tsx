"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import Image from "next/image";
import { Clock, CreditCard, X } from "lucide-react";
import { useJourneyById } from "@/lib/hooks/useJourney";
import { useCreateTransferBooking } from "@/lib/hooks/useBooking";
import { useCurrencies } from "@/lib/hooks/useCurrency";
import PayPalPaymentModal, { type PendingBookingPayment } from "@/components/payment/PayPalPaymentModal";
import { API_BASE_URL } from "@/lib/api/config";
import {
  savePaymentBookingContext,
  saveActiveHold,
  readActiveHold,
  clearActiveHold,
} from "@/lib/utils/paymentBookingContext";
import { formatUsd } from "@/lib/utils/currency";
import { toast } from "sonner";
import { useI18n } from "./I18nProvider";
import { useHeaderStore } from "@/lib/headerStore";

function resolveImageUrl(url: string): string {
  if (!url || url.trim() === "") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http")) return trimmed;
  return `${API_BASE_URL}/${trimmed.replace(/^\//, "")}`;
}

type TransferBookingForm = {
  fullName: string;
  email: string;
  phone: string;
  tripType: number;
  passengers: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  flightNumber: string;
  pickupNotes: string;
  dropOffNotes: string;
};

type TransferFormProps = {
  data: TransferBookingForm;
  setData: Dispatch<SetStateAction<TransferBookingForm>>;
};

interface SingleTransferPageContentProps {
  id: string;
}

export default function SingleTransferPageContent({ id }: SingleTransferPageContentProps) {
  const { t } = useI18n();
  const { data: journey, isLoading, isError } = useJourneyById(id);
  const { mutate: createTransferBooking, isPending: isCreatingBooking } = useCreateTransferBooking();
  const { data: currencies = [] } = useCurrencies({ isActive: true });
  const egpCurrency = currencies.find((c) => c.code.toUpperCase() === "EGP");
  const egpRate = egpCurrency?.exchangeRate || 50;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<PendingBookingPayment | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const setPageEntity = useHeaderStore((state) => state.setPageEntity);

  useEffect(() => {
    setPageEntity(id, "transfer");
    return () => setPageEntity(null, null);
  }, [id, setPageEntity]);

  // Re-hydrate any active unexpired 5-minute hold on mount
  useEffect(() => {
    const existingHold = readActiveHold("transfer", id) as PendingBookingPayment | null;
    if (existingHold && existingHold.expiresAt && existingHold.expiresAt > Date.now()) {
      setPendingBooking(existingHold);
      if (existingHold.transferDetails) {
        setTransferData((prev) => ({
          ...prev,
          pickupDate: existingHold.transferDetails?.pickupDate || prev.pickupDate,
          pickupTime: existingHold.transferDetails?.pickupTime || prev.pickupTime,
          passengers: String(existingHold.transferDetails?.passengers || prev.passengers),
        }));
      }
    }
  }, [id]);

  // Keep countdown timer synced with wall-clock and auto-clear when hold expires
  useEffect(() => {
    if (!pendingBooking?.expiresAt) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (pendingBooking.expiresAt && now >= pendingBooking.expiresAt) {
        clearActiveHold("transfer", id);
        setPendingBooking(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingBooking?.expiresAt, id]);

  const hasActiveHold = Boolean(
    pendingBooking &&
    pendingBooking.expiresAt &&
    pendingBooking.expiresAt > currentTime
  );

  const remainingSeconds = pendingBooking?.expiresAt
    ? Math.max(0, Math.floor((pendingBooking.expiresAt - currentTime) / 1000))
    : 0;
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;
  const formattedCountdown = `${remainingMinutes.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;

  const handleCancelHold = () => {
    clearActiveHold("transfer", id);
    setPendingBooking(null);
    setIsPaymentModalOpen(false);
  };

  const isPending = isCreatingBooking;

  const [transferData, setTransferData] = useState<TransferBookingForm>({
    fullName: "",
    email: "",
    phone: "",
    tripType: 1, // 1 = One Way, 2 = Round Trip
    passengers: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    flightNumber: "",
    pickupNotes: "",
    dropOffNotes: "",
  });

  if (isLoading) {
    return <div className="p-20 text-center text-gray-500">{t("common.loading")}</div>;
  }

  if (isError || !journey) {
    return <div className="p-20 text-center text-red-500">{t("transfer.failed")}</div>;
  }

  const handleTransferSubmit = () => {
    if (
      !transferData.fullName.trim() ||
      !transferData.email.trim() ||
      !transferData.phone.trim() ||
      !transferData.passengers ||
      !transferData.pickupDate ||
      !transferData.pickupTime
    ) {
      toast.error(t("transfer.errors.required"));
      return;
    }

    if (transferData.tripType === 2 && (!transferData.returnDate || !transferData.returnTime)) {
      toast.error(t("transfer.errors.returnRequired"));
      return;
    }

    createTransferBooking(
      {
        journeyId: id,
        tripType: transferData.tripType,
        passengers: Number(transferData.passengers),
        pickupDate: transferData.pickupDate,
        pickupTime: transferData.pickupTime,
        returnDate: transferData.tripType === 2 ? transferData.returnDate : null,
        returnTime: transferData.tripType === 2 ? transferData.returnTime : null,
        flightNumber: transferData.flightNumber,
        pickupNotes: transferData.pickupNotes,
        dropOffNotes: transferData.dropOffNotes,
        fullName: transferData.fullName,
        email: transferData.email,
        phone: transferData.phone,
      },
      {
        onSuccess: (res) => {
          const bookingId = res.data.bookingId;
          const transferTotalUsd = (journey?.basePrice ?? 0) * (transferData.tripType === 2 ? 2 : 1);
          const transferDepositUsd = Math.round(transferTotalUsd * 0.5 * 100) / 100;
          const transferRemainingUsd = Math.round((transferTotalUsd - transferDepositUsd) * 100) / 100;

          const transferTotalEgp = Math.round(transferTotalUsd * egpRate * 100) / 100;
          const transferDepositEgp = Math.round(transferTotalEgp * 0.5 * 100) / 100;
          const transferRemainingEgp = Math.round((transferTotalEgp - transferDepositEgp) * 100) / 100;

          const expiresAt = Date.now() + 5 * 60 * 1000;

          savePaymentBookingContext({
            kind: "transfer",
            bookingId,
            bookingNumber: res.data.bookingNumber,
            journeyId: id,
            journeyName: journey?.name || "Transfer",
            pickupDate: transferData.pickupDate,
            pickupTime: transferData.pickupTime,
            passengers: Number(transferData.passengers),
            amount: transferDepositUsd,
            currency: "USD",
            expiresAt,
          });

          const newPending: PendingBookingPayment = {
            kind: "transfer",
            bookingId,
            bookingNumber: res.data.bookingNumber,
            journeyId: id,
            title: journey?.name || t("transfer.title"),
            subtitle: transferData.tripType === 2 ? "Round Trip" : "One Way",
            usd: {
              total: transferTotalUsd,
              deposit: transferDepositUsd,
              remaining: transferRemainingUsd,
            },
            egp: {
              total: transferTotalEgp,
              deposit: transferDepositEgp,
              remaining: transferRemainingEgp,
            },
            amount: transferDepositUsd,
            amountUsd: transferDepositUsd,
            currency: "USD",
            expiresAt,
            transferDetails: {
              pickupDate: transferData.pickupDate,
              pickupTime: transferData.pickupTime,
              passengers: Number(transferData.passengers),
            },
          };

          saveActiveHold(newPending);
          setPendingBooking(newPending);
          setIsPaymentModalOpen(true);
        },
        onError: (err) => {
          console.error("Failed to create transfer booking:", err);
          toast.error(t("transfer.errors.createFailed"));
        },
      }
    );
  };

  const totals = [
    [t("transfer.rideFare"), formatUsd(journey.basePrice)],
  ];
  const dueToday = formatUsd(journey.basePrice);

  return (
    <main className="bg-[#f8f9fa] font-[var(--font-poppins)] text-[#0f172a]">
      <section className="px-5 pb-12 pt-[30px] lg:px-0 lg:pb-20 lg:pt-14">
        <div className="mx-auto max-w-[335px] lg:max-w-[1277px]">
          {/* ─── Top Active Hold Alert Banner (Highly Visible) ─── */}
          {hasActiveHold && pendingBooking && (
            <div className="mb-6 rounded-2xl border-2 border-[#2e6f57]/30 bg-[#f4f9f6] p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2e6f57] text-white shadow-xs">
                    <Clock className="size-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-bold text-[#183c2f]">
                        {t("payment.hold.activeTitle") || "Active Reservation Hold"}
                      </h2>
                      <span className="rounded-md bg-[#2e6f57]/15 px-2 py-0.5 font-mono text-[11px] font-bold text-[#2e6f57]">
                        #{pendingBooking.bookingNumber}
                      </span>
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-900">
                         {formattedCountdown}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-[#40544c]">
                      {pendingBooking.transferDetails ? (
                        <>
                          Pickup: <strong>{pendingBooking.transferDetails.pickupDate} {pendingBooking.transferDetails.pickupTime}</strong> ({pendingBooking.transferDetails.passengers} passengers)
                        </>
                      ) : (
                        t("payment.hold.holdingNotice")
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2e6f57] px-5 text-[13px] font-bold text-white shadow-md transition hover:bg-[#255f49] hover:shadow-lg active:scale-95"
                  >
                    <CreditCard className="size-4" />
                    <span>{t("payment.hold.resumeButton") || "Resume Payment"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelHold}
                    className="flex h-11 items-center justify-center rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[12px] font-medium text-[#667c74] transition hover:bg-[#edf2ef] hover:text-red-600"
                  >
                    {t("payment.hold.cancelButton") || "Cancel Hold"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <header className="hidden h-[76px] flex-col items-start gap-2 pt-2 lg:flex">
            <h1 className="text-[30px] font-medium leading-9 text-[#0f172a]">{t("transfer.bookTitle", { name: journey.name })}</h1>
            <p className="text-[16px] leading-6 text-[#475569]">
              {t("transfer.bookSubtitle")}
            </p>
          </header>

          <div className="lg:mt-6 lg:grid lg:grid-cols-[minmax(0,845px)_minmax(0,412px)] lg:items-start lg:gap-x-5">
            <div className="flex flex-col gap-8">
              <TransferCustomerInfo data={transferData} setData={setTransferData} />
              <TransferDetailsInfo data={transferData} setData={setTransferData} />
            </div>

            <aside className="mt-6 flex flex-col gap-6 lg:mt-0 lg:w-full">
              <div className="overflow-hidden rounded-xl border border-[#f1f5f9] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#e5e7eb] p-6 pb-[17px]">
                  <h2 className="text-[20px] font-semibold leading-7 text-[#1b1b1c]">{t("transfer.summary")}</h2>
                  
                  <div className="relative mt-4 h-[187.88px] overflow-hidden rounded-md bg-gray-100">
                    {journey.imageUrl && journey.imageUrl.trim() !== "" && (
                      <Image
                        src={resolveImageUrl(journey.imageUrl)}
                        alt={journey.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute right-2 top-2 rounded bg-[#3b82f6] px-2 py-1 text-[12px] font-medium leading-[17px] text-white">
                      {t("transfer.transfer")}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[20px] font-semibold leading-7 text-[#1b1b1c]">{journey.name}</h3>
                  <div className="mt-2 flex items-center gap-[9px] text-[12px] leading-4 text-[#4d434f]">
                    <span>{journey.fromLocationName} &rarr; {journey.toLocationName}</span>
                  </div>

                  <dl className="mt-5 space-y-3 text-[12px] leading-[16.8px]">
                    <div className="flex items-center justify-between gap-5">
                      <dt className="font-medium text-[#4d434f]">{t("transfer.estimatedDuration")}</dt>
                      <dd className="font-semibold text-[#1b1b1c]">{journey.estimatedDurationMinutes} {t("transfer.minutes")}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-[#f6f3f4] p-6">
                  <dl className="space-y-3 text-[12px] leading-[16.8px]">
                    {totals.map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3">
                        <dt className="font-medium text-[#4d434f]">{label}</dt>
                        <dd className="whitespace-nowrap font-semibold text-[#1b1b1c]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex items-center justify-between border-t border-[#e5e7eb] pt-[17px]">
                    <span className="text-[16px] font-semibold leading-7 text-[#1b1b1c] lg:text-[20px]">{t("transfer.totalDue")}</span>
                    <span className="text-[16px] font-semibold leading-7 text-[#2e6f57] lg:text-[20px]">{dueToday}</span>
                  </div>
                </div>
              </div>

              <SectionCard className="p-[25px]">
                <SectionHeading>{t("transfer.paymentMethod")}</SectionHeading>
                <div className="mt-6 space-y-4">
                  <label className="flex h-[70px] items-center justify-between rounded-xl border border-[#cfb072] bg-[#fcf9f6] px-4 py-[17px]">
                    <input type="radio" name="payment-method" defaultChecked className="sr-only" />
                    <span className="flex items-center">
                      <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#cfb072]">
                        <div className="size-2 rounded-full bg-white" />
                      </span>
                      <span className="ml-3">
                        <span className="block text-[14px] font-medium leading-5 text-[#0f172a] lg:font-bold">{t("transfer.payNowOnline")}</span>
                        <span className="block text-[12px] leading-4 text-[#8a9a94]">{t("transfer.securePaypal")}</span>
                      </span>
                    </span>
                  </label>
                </div>
                
                {hasActiveHold ? (
                  <div className="mt-[24px] space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-[48px] bg-[#2e6f57] text-[16px] font-medium leading-6 text-white transition hover:bg-[#255f49] lg:h-14 lg:font-bold"
                    >
                      {t("payment.hold.resumeButton") || "Resume Payment"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelHold}
                      className="w-full text-center text-[12px] text-[#667c74] underline transition hover:text-red-600"
                    >
                      {t("payment.hold.cancelButton") || "Cancel Hold"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleTransferSubmit}
                    disabled={isPending}
                    className="mt-[24px] flex h-12 w-full items-center justify-center gap-2 rounded-[48px] bg-[#2e6f57] text-[16px] font-medium leading-6 text-white transition hover:bg-[#255f49] lg:h-14 lg:font-bold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? t("common.processing") : t("transfer.payConfirm")}
                  </button>
                )}
              </SectionCard>
            </aside>
          </div>
        </div>
      </section>

      <PayPalPaymentModal
        isOpen={isPaymentModalOpen}
        booking={pendingBooking}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          clearActiveHold("transfer", id);
          setPendingBooking(null);
          setTransferData({
            fullName: "",
            email: "",
            phone: "",
            tripType: 1,
            passengers: "",
            pickupDate: "",
            pickupTime: "",
            returnDate: "",
            returnTime: "",
            flightNumber: "",
            pickupNotes: "",
            dropOffNotes: "",
          });
        }}
      />
      {/* ─── Floating Sticky Resume Widget (Always Visible Anywhere on the Page) ─── */}
      {hasActiveHold && pendingBooking && !isPaymentModalOpen && (
        <aside
          aria-label="Pending transfer recovery"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[90] flex items-center gap-3 rounded-2xl border border-[#2e6f57]/30 bg-white/95 p-3 sm:p-3.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 rtl:right-auto rtl:left-5 sm:rtl:left-6"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#2e6f57] text-white shadow-xs">
            <Clock className="size-4.5 animate-pulse" />
          </div>
          <div className="hidden sm:block min-w-0 pr-1 rtl:pr-0 rtl:pl-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#183c2f]">
                {t("payment.hold.activeTitle") || "Active Hold"}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#2e6f57]">
                {formattedCountdown}
              </span>
            </div>
            <p className="text-[11px] text-[#667c74] truncate max-w-[200px]">
              #{pendingBooking.bookingNumber} • {pendingBooking.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#2e6f57] px-4 text-[13px] font-bold text-white shadow-md transition hover:bg-[#255f49] active:scale-95"
          >
            <CreditCard className="size-3.5" />
            <span>{t("payment.hold.resumeButton") || "Resume Payment"}</span>
          </button>
          <button
            type="button"
            onClick={handleCancelHold}
            aria-label="Cancel Hold"
            title="Cancel hold"
            className="flex size-8 items-center justify-center rounded-lg text-[#8a9a94] transition hover:bg-[#dfe8e4]/60 hover:text-red-600"
          >
            <X className="size-4" />
          </button>
        </aside>
      )}
    </main>
  );
}

function TransferCustomerInfo({ data, setData }: TransferFormProps) {
  const { t } = useI18n();

  return (
    <SectionCard className="p-[25px]">
      <SectionHeading>{t("transfer.customerInfo")}</SectionHeading>
      <div className="mt-6 grid gap-x-6 gap-y-[23.59px] lg:grid-cols-2">
        <label className="block">
          <span className="text-[14px] font-medium leading-5 text-[#4d434f]">{t("booking.fullName")}</span>
          <input
            type="text"
            value={data.fullName}
            placeholder={t("booking.fullNamePlaceholder")}
            required
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium leading-5 text-[#4d434f]">{t("booking.email")}</span>
          <input
            type="email"
            value={data.email}
            placeholder={t("booking.emailPlaceholder")}
            required
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-[14px] font-medium leading-5 text-[#4d434f]">{t("booking.phone")}</span>
          <input
            type="tel"
            value={data.phone}
            placeholder={t("booking.phonePlaceholder")}
            required
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>
      </div>
    </SectionCard>
  );
}

function TransferDetailsInfo({ data, setData }: TransferFormProps) {
  const { t } = useI18n();

  return (
    <SectionCard className="p-[25px]">
      <SectionHeading>{t("transfer.details")}</SectionHeading>
      <div className="mt-6 grid gap-x-6 gap-y-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-[14px] font-bold text-[#4d434f]">{t("transfer.tripType")}</span>
          <select
            value={data.tripType}
            onChange={(e) => setData({ ...data, tripType: parseInt(e.target.value) })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          >
            <option value={1}>{t("transfer.oneWay")}</option>
            <option value={2}>{t("transfer.roundTrip")}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[14px] font-bold text-[#4d434f]">{t("transfer.passengers")}</span>
          <input
            type="number"
            min="1"
            value={data.passengers}
            placeholder={t("transfer.passengersPlaceholder")}
            required
            onChange={(e) => setData({ ...data, passengers: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.pickupDate")}</span>
          <input
            type="date"
            value={data.pickupDate}
            required
            onChange={(e) => setData({ ...data, pickupDate: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.pickupTime")}</span>
          <input
            type="time"
            value={data.pickupTime}
            required
            onChange={(e) => setData({ ...data, pickupTime: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>

        {data.tripType === 2 && (
          <>
            <label className="block">
              <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.returnDate")}</span>
              <input
                type="date"
                value={data.returnDate}
                required
                onChange={(e) => setData({ ...data, returnDate: e.target.value })}
                className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
              />
            </label>
            <label className="block">
              <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.returnTime")}</span>
              <input
                type="time"
                value={data.returnTime}
                required
                onChange={(e) => setData({ ...data, returnTime: e.target.value })}
                className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
              />
            </label>
          </>
        )}

        <label className="block lg:col-span-2">
          <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.flightNumber")}</span>
          <input
            type="text"
            value={data.flightNumber}
            placeholder={t("transfer.flightPlaceholder")}
            onChange={(e) => setData({ ...data, flightNumber: e.target.value })}
            className="mt-2 h-[43.59px] w-full rounded-lg border border-[#cbd5e1] bg-white px-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.pickupNotes")}</span>
          <textarea
            value={data.pickupNotes}
            placeholder={t("transfer.pickupPlaceholder")}
            onChange={(e) => setData({ ...data, pickupNotes: e.target.value })}
            className="mt-2 w-full rounded-lg border border-[#cbd5e1] bg-white p-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
            rows={2}
          />
        </label>
        
        <label className="block lg:col-span-2">
          <span className="text-[14px] font-medium text-[#4d434f]">{t("transfer.dropoffNotes")}</span>
          <textarea
            value={data.dropOffNotes}
            placeholder={t("transfer.dropoffPlaceholder")}
            onChange={(e) => setData({ ...data, dropOffNotes: e.target.value })}
            className="mt-2 w-full rounded-lg border border-[#cbd5e1] bg-white p-[13px] text-[14px] outline-none focus:border-[#2e6f57]"
            rows={2}
          />
        </label>
      </div>
    </SectionCard>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[16px] font-semibold leading-7 text-[#1b1b1c] lg:text-[20px]">
      <div className={`shrink-0 size-4 bg-[#2e6f57] rounded-sm`} /> 
      {children}
    </h2>
  );
}
