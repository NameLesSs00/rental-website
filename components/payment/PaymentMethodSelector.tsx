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

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* Option 1: Credit / Debit Card (PayPal) */}
        <button
          type="button"
          onClick={() => onSelect("paypal")}
          className={`relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all rtl:text-right ${
            selected === "paypal"
              ? "border-[#2e6f57] bg-[#f4f8f6] shadow-sm ring-1 ring-[#2e6f57]"
              : "border-[#dfe8e4] bg-white hover:border-[#b8ccc4] hover:bg-[#fafcfb]"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-lg transition ${
                  selected === "paypal"
                    ? "bg-[#2e6f57] text-white"
                    : "bg-[#edf2ef] text-[#40544c]"
                }`}
              >
                <CreditCard className="size-4" />
              </div>
              <span className="text-[13px] font-bold text-[#183c2f]">
                {t("payment.methods.paypalTitle")}
              </span>
            </div>

            <div
              className={`flex size-4 items-center justify-center rounded-full border transition ${
                selected === "paypal"
                  ? "border-[#2e6f57] bg-[#2e6f57] text-white"
                  : "border-[#cfded7] bg-white"
              }`}
            >
              {selected === "paypal" && <Check className="size-2.5 stroke-[3]" />}
            </div>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-[#667c74]">
            {t("payment.methods.paypalSubtitle")}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#183c2f] shadow-xs ring-1 ring-[#dfe8e4]">
              VISA
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#c25e00] shadow-xs ring-1 ring-[#dfe8e4]">
              MC
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#006fcf] shadow-xs ring-1 ring-[#dfe8e4]">
              AMEX
            </span>
          </div>
        </button>

        {/* Option 2: Paymob (Local Cards & Wallets) */}
        <button
          type="button"
          onClick={() => onSelect("paymob")}
          className={`relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all rtl:text-right ${
            selected === "paymob"
              ? "border-[#2e6f57] bg-[#f4f8f6] shadow-sm ring-1 ring-[#2e6f57]"
              : "border-[#dfe8e4] bg-white hover:border-[#b8ccc4] hover:bg-[#fafcfb]"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-lg transition ${
                  selected === "paymob"
                    ? "bg-[#2e6f57] text-white"
                    : "bg-[#edf2ef] text-[#40544c]"
                }`}
              >
                <Wallet className="size-4" />
              </div>
              <span className="text-[13px] font-bold text-[#183c2f]">
                {t("payment.methods.paymobTitle")}
              </span>
            </div>

            <div
              className={`flex size-4 items-center justify-center rounded-full border transition ${
                selected === "paymob"
                  ? "border-[#2e6f57] bg-[#2e6f57] text-white"
                  : "border-[#cfded7] bg-white"
              }`}
            >
              {selected === "paymob" && <Check className="size-2.5 stroke-[3]" />}
            </div>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-[#667c74]">
            {t("payment.methods.paymobSubtitle")}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#183c2f] shadow-xs ring-1 ring-[#dfe8e4]">
              Meeza
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#e11400] shadow-xs ring-1 ring-[#dfe8e4]">
              Wallets
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#0091ff] shadow-xs ring-1 ring-[#dfe8e4]">
              ValU
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodSelector;

