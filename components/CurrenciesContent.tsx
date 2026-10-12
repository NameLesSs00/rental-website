"use client";

import { useMemo, useState } from "react";
import { useCurrencies } from "@/lib/hooks/useCurrency";
import type { Currency } from "@/lib/types/currency";

type CurrencyFilter = "all" | "active";

function formatRate(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 6,
  }).format(Number.isFinite(value) ? value : 0);
}

function getCurrencyPreview(currency: Currency) {
  const sampleUsd = 100;
  const converted = sampleUsd * currency.exchangeRate;

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "code",
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(Number.isFinite(converted) ? converted : 0);
}

export default function CurrenciesContent() {
  const [filter, setFilter] = useState<CurrencyFilter>("all");

  const query = useMemo(() => (filter === "active" ? { isActive: true } : {}), [filter]);
  const { data: currencies = [], isLoading, isError, isFetching } = useCurrencies(query);

  const baseCurrency = currencies.find((currency) => currency.isBaseCurrency);

  return (
    <div className="w-full min-w-0">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#d9a441]">
            Management
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight text-[#183c2f] lg:text-[32px]">
            Currencies
          </h1>
          <p className="mt-1 text-[14px] text-[#667c74]">
            View exchange rates used to convert prices from the USD base currency.
          </p>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl border border-[#dfe8e4] bg-white p-1 text-[13px]">
          {(["all", "active"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`h-8 rounded-lg px-3 font-medium capitalize transition ${
                filter === item
                  ? "bg-[#2e6f57] text-white shadow-sm"
                  : "text-[#667c74] hover:text-[#183c2f]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {!isLoading && (
          <span className="rounded-full bg-[#f5f7f6] px-3 py-1 text-[12px] font-medium text-[#667c74]">
            {currencies.length} Currenc{currencies.length === 1 ? "y" : "ies"}
          </span>
        )}

        {baseCurrency && (
          <span className="rounded-full bg-[#fff8ec] px-3 py-1 text-[12px] font-semibold text-[#d9a441]">
            Base: {baseCurrency.code}
          </span>
        )}

        {isFetching && !isLoading && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#8a9a94]">
            <span className="size-3 animate-spin rounded-full border-2 border-[#dfe8e4] border-t-[#2e6f57]" />
            Refreshing
          </span>
        )}
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-[#dfe8e4] bg-white shadow-[0_8px_24px_rgba(31,77,61,0.05)]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[14px] text-[#8a9a94]">
            <span className="mr-2 inline-block size-5 animate-spin rounded-full border-2 border-[#dfe8e4] border-t-[#2e6f57]" />
            Loading currencies...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[15px] font-medium text-[#183c2f]">Failed to load currencies</p>
            <p className="mt-1 text-[13px] text-[#667c74]">Check your connection and try again.</p>
          </div>
        ) : currencies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#f5f7f6] text-[#8a9a94]">
              <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M8.5 9.5h5.5a2.5 2.5 0 0 1 0 5H10a2.5 2.5 0 0 0 0 5h5.5M5 5h14M5 19h14" />
              </svg>
            </div>
            <p className="text-[16px] font-medium text-[#183c2f]">No currencies found</p>
            <p className="mt-1 max-w-sm text-[14px] text-[#667c74]">
              No currencies are currently available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-left">
              <thead className="bg-[#f5f7f6] text-[12px] uppercase tracking-[0.12em] text-[#667c74]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Currency</th>
                  <th className="px-5 py-3 font-semibold">Rate</th>
                  <th className="px-5 py-3 font-semibold">Preview</th>
                  <th className="px-5 py-3 font-semibold">Decimals</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f2]">
                {currencies.map((currency) => (
                  <tr key={currency.id} className="transition hover:bg-[#f5f7f6]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f5f7f6] text-[15px] font-semibold text-[#2e6f57]">
                          {currency.symbol}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-[14px] font-semibold text-[#183c2f]">
                              {currency.code}
                            </p>
                            {currency.isBaseCurrency && (
                              <span className="rounded-full bg-[#fff8ec] px-2 py-0.5 text-[11px] font-semibold text-[#d9a441]">
                                Base
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[13px] text-[#667c74]">
                            {currency.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] font-medium text-[#183c2f]">
                        {formatRate(currency.exchangeRate)}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#8a9a94]">
                        1 USD = {formatRate(currency.exchangeRate)} {currency.code}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] font-medium text-[#183c2f]">
                        {getCurrencyPreview(currency)}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#8a9a94]">from USD 100</p>
                    </td>
                    <td className="px-5 py-4 text-[14px] text-[#183c2f]">
                      {currency.decimalPlaces}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                          currency.isActive
                            ? "bg-[#f5f7f6] text-[#2e6f57]"
                            : "bg-[#f5f5f5] text-[#8a9a94]"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            currency.isActive ? "bg-[#2e6f57]" : "bg-[#8a9a94]"
                          }`}
                        />
                        {currency.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
