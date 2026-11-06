"use client";

import React from "react";
import { CreditCard, Wallet, Check } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export type PaymentGatewayMethod = "paypal" | "paymob";

interface PaymentMethodSelectorProps {
  selected: PaymentGatewayMethod;
  onSelect: (method: PaymentGatewayMethod) => void;
  currency?: string;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  currency,
}: PaymentMethodSelectorProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2.5">
      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#667c74]">
        {t("payment.methods.title")}
      </label>

      <div className="space-y-2.5">
        {/* Option 1: Credit / Debit Card (PayPal) */}
        <button
          type="button"
          onClick={() => onSelect("paypal")}
          className={`group relative flex w-full flex-col gap-2.5 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:justify-between text-left transition-all rtl:text-right ${
            selected === "paypal"
              ? "border-[#2e6f57] bg-[#f4f8f6] shadow-xs ring-1 ring-[#2e6f57]"
              : "border-[#dfe8e4] bg-white hover:border-[#b8ccc4] hover:bg-[#fafcfb]"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Radio Circle */}
            <div
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                selected === "paypal"
                  ? "border-[#2e6f57] bg-[#2e6f57] text-white"
                  : "border-[#cfded7] bg-white group-hover:border-[#2e6f57]/60"
              }`}
            >
              {selected === "paypal" && <Check className="size-3 stroke-[3]" />}
            </div>

            {/* Icon */}
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition ${
                selected === "paypal"
                  ? "bg-[#2e6f57] text-white"
                  : "bg-[#edf2ef] text-[#40544c]"
              }`}
            >
              <CreditCard className="size-4.5" />
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold text-[#183c2f]">
                  {t("payment.methods.paypalTitle")}
                </span>
                <span className="rounded bg-[#edf4f1] px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#2e6f57]">
                  USD
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#667c74]">
                {t("payment.methods.paypalSubtitle")}
              </p>
            </div>
          </div>

          {/* Card Badges */}
          <div className="flex items-center gap-1.5 shrink-0 ltr:pl-8 sm:ltr:pl-0 rtl:pr-8 sm:rtl:pr-0">
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#183c2f] shadow-xs ring-1 ring-[#dfe8e4]">
              VISA
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#c25e00] shadow-xs ring-1 ring-[#dfe8e4]">
              MC
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#006fcf] shadow-xs ring-1 ring-[#dfe8e4]">
              AMEX
            </span>
          </div>
        </button>

        {/* Option 2: Paymob (Local Cards & Wallets) */}
        <button
          type="button"
          onClick={() => onSelect("paymob")}
          className={`group relative flex w-full flex-col gap-2.5 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:justify-between text-left transition-all rtl:text-right ${
            selected === "paymob"
              ? "border-[#2e6f57] bg-[#f4f8f6] shadow-xs ring-1 ring-[#2e6f57]"
              : "border-[#dfe8e4] bg-white hover:border-[#b8ccc4] hover:bg-[#fafcfb]"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Radio Circle */}
            <div
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                selected === "paymob"
                  ? "border-[#2e6f57] bg-[#2e6f57] text-white"
                  : "border-[#cfded7] bg-white group-hover:border-[#2e6f57]/60"
              }`}
            >
              {selected === "paymob" && <Check className="size-3 stroke-[3]" />}
            </div>

            {/* Icon */}
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition ${
                selected === "paymob"
                  ? "bg-[#2e6f57] text-white"
                  : "bg-[#edf2ef] text-[#40544c]"
              }`}
            >
              <Wallet className="size-4.5" />
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold text-[#183c2f]">
                  {t("payment.methods.paymobTitle")}
                </span>
                <span className="rounded bg-[#edf4f1] px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#2e6f57]">
                  EGP
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#667c74]">
                {t("payment.methods.paymobSubtitle")}
              </p>
            </div>
          </div>

          {/* Brand Badges */}
          <div className="flex items-center gap-1.5 shrink-0 ltr:pl-8 sm:ltr:pl-0 rtl:pr-8 sm:rtl:pr-0">
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#183c2f] shadow-xs ring-1 ring-[#dfe8e4]">
              Meeza
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#e11400] shadow-xs ring-1 ring-[#dfe8e4]">
              Wallets
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-[#0091ff] shadow-xs ring-1 ring-[#dfe8e4]">
              ValU
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodSelector;

