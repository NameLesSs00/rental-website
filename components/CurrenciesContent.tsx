"use client";

import { useMemo, useState, type FormEvent } from "react";
import ConfirmModal from "./ConfirmModal";
import {
  useCurrencies,
  useCurrency,
  useCreateCurrency,
  useDeleteCurrency,
  useUpdateCurrency,
} from "@/lib/hooks/useCurrency";
import type { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from "@/lib/types/currency";

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

function CurrencyFormPanel({
  currency,
  isOpen,
  onClose,
  onSaved,
}: {
  currency: Currency | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!currency;
  const { data: loadedCurrency, isLoading: isLoadingCurrency, isError: isCurrencyError } =
    useCurrency(currency?.id ?? "", isOpen && isEditing);
  const { mutate: createCurrency, isPending: isCreating } = useCreateCurrency();
  const { mutate: updateCurrency, isPending: isUpdating } = useUpdateCurrency();

  const activeCurrency = loadedCurrency ?? currency;
  const isBaseCurrency = Boolean(activeCurrency?.isBaseCurrency);
  const [code, setCode] = useState(currency?.code ?? "");
  const [name, setName] = useState(currency?.name ?? "");
  const [symbol, setSymbol] = useState(currency?.symbol ?? "");
  const [exchangeRate, setExchangeRate] = useState(
    String(currency?.isBaseCurrency ? 1 : currency?.exchangeRate ?? 1)
  );
  const [decimalPlaces, setDecimalPlaces] = useState(String(currency?.decimalPlaces ?? 2));
  const [isActive, setIsActive] = useState(currency?.isActive ?? true);

  if (!isOpen) return null;

  const trimmedCode = code.trim().toUpperCase();
  const rateValue = isBaseCurrency || trimmedCode === "USD" ? 1 : Number(exchangeRate);
  const decimalsValue = Number(decimalPlaces);
  const isSaving = isCreating || isUpdating;
  const canEdit = !isEditing || Boolean(activeCurrency);
  const isHydrating = isEditing && isLoadingCurrency;
  const isFormValid =
    canEdit &&
    (isEditing || trimmedCode.length === 3) &&
    name.trim().length > 0 &&
    symbol.trim().length > 0 &&
    Number.isFinite(rateValue) &&
    rateValue > 0 &&
    Number.isInteger(decimalsValue) &&
    decimalsValue >= 0 &&
    decimalsValue <= 4;

  function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!isFormValid) return;

    if (isEditing && activeCurrency) {
      const payload: UpdateCurrencyRequest = {
        name: name.trim(),
        symbol: symbol.trim(),
        exchangeRate: isBaseCurrency ? 1 : rateValue,
        decimalPlaces: decimalsValue,
        isActive: isBaseCurrency ? true : isActive,
      };

      updateCurrency(
        { id: activeCurrency.id, payload },
        {
          onSuccess: onSaved,
        }
      );
      return;
    }

    const payload: CreateCurrencyRequest = {
      code: trimmedCode,
      name: name.trim(),
      symbol: symbol.trim(),
      exchangeRate: trimmedCode === "USD" ? 1 : rateValue,
      decimalPlaces: decimalsValue,
    };

    createCurrency(payload, {
      onSuccess: onSaved,
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#dfe8e4] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#183c2f]">
              {isEditing ? "Edit Currency" : "Create Currency"}
            </h2>
            {activeCurrency?.isBaseCurrency && (
              <p className="mt-0.5 text-[12px] text-[#8a9a94]">
                Base currency settings are protected.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-[#8a9a94] transition hover:bg-[#f5f7f6] hover:text-[#183c2f]"
            aria-label="Close panel"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {isHydrating && (
              <div className="rounded-xl border border-[#dfe8e4] bg-[#f5f7f6] px-4 py-3 text-[13px] text-[#667c74]">
                Loading currency details before editing...
              </div>
            )}

            {isCurrencyError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                Could not load this currency. Please close the panel and try again.
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#183c2f]">
                Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase().slice(0, 3))}
                disabled={isEditing || isSaving}
                placeholder="USD"
                className="w-full rounded-xl border border-[#dfe8e4] px-4 py-2.5 text-[14px] uppercase outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57] disabled:bg-[#f5f7f6] disabled:text-[#8a9a94]"
              />
              <p className="mt-1 text-[12px] text-[#8a9a94]">
                Three-letter ISO currency code. This cannot be changed after creation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#183c2f]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={!canEdit || isSaving}
                  placeholder="US Dollar"
                  className="w-full rounded-xl border border-[#dfe8e4] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57] disabled:bg-[#f5f7f6] disabled:text-[#8a9a94]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#183c2f]">
                  Symbol
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value)}
                  disabled={!canEdit || isSaving}
                  placeholder="$"
                  className="w-full rounded-xl border border-[#dfe8e4] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57] disabled:bg-[#f5f7f6] disabled:text-[#8a9a94]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#183c2f]">
                  Exchange Rate
                </label>
                <input
                  type="number"
                  min="0.000001"
                  step="0.000001"
                  value={isBaseCurrency || trimmedCode === "USD" ? "1" : exchangeRate}
                  onChange={(event) => setExchangeRate(event.target.value)}
                  disabled={!canEdit || isSaving || isBaseCurrency || trimmedCode === "USD"}
                  className="w-full rounded-xl border border-[#dfe8e4] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57] disabled:bg-[#f5f7f6] disabled:text-[#8a9a94]"
                />
                <p className="mt-1 text-[12px] text-[#8a9a94]">
                  Represents how much target currency equals 1 USD.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#183c2f]">
                  Decimal Places
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="1"
                  value={decimalPlaces}
                  onChange={(event) => setDecimalPlaces(event.target.value)}
                  disabled={!canEdit || isSaving}
                  className="w-full rounded-xl border border-[#dfe8e4] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#2e6f57] focus:ring-1 focus:ring-[#2e6f57] disabled:bg-[#f5f7f6] disabled:text-[#8a9a94]"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-between rounded-xl border border-[#dfe8e4] p-4">
                <div>
                  <p className="text-[14px] font-medium text-[#183c2f]">Active currency</p>
                  <p className="text-[12px] text-[#8a9a94]">
                    Inactive currencies stay stored but should not be offered to users.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((value) => !value)}
                  disabled={!canEdit || isSaving || isBaseCurrency}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2e6f57] focus:ring-offset-2 ${
                    isActive ? "bg-[#2e6f57]" : "bg-[#dfe8e4]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                  aria-label="Toggle active status"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="border-t border-[#dfe8e4] bg-[#f5f7f6] p-6">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full px-5 py-2.5 text-[14px] font-medium text-[#667c74] transition hover:bg-[#dfe8e4] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !isFormValid}
              className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-full bg-[#2e6f57] px-5 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#255f49] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Currency"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CurrenciesContent() {
  const [filter, setFilter] = useState<CurrencyFilter>("all");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const query = useMemo(() => (filter === "active" ? { isActive: true } : {}), [filter]);
  const { data: currencies = [], isLoading, isError, isFetching } = useCurrencies(query);
  const { mutate: deleteCurrency } = useDeleteCurrency();

  function openCreatePanel() {
    setEditingCurrency(null);
    setIsPanelOpen(true);
  }

  function openEditPanel(currency: Currency) {
    setEditingCurrency(currency);
    setIsPanelOpen(true);
  }

  function confirmDelete(id: string) {
    setDeletingId(id);
    deleteCurrency(id, {
      onSettled: () => {
        setDeletingId(null);
        setCurrencyToDelete(null);
      },
    });
  }

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
            Manage exchange rates used to convert prices from the USD base currency.
          </p>
        </div>
        <button
          onClick={openCreatePanel}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2e6f57] px-5 text-[14px] font-medium text-white shadow-sm transition hover:bg-[#255f49] hover:shadow"
        >
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Add Currency
        </button>
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
            <p className="mb-6 mt-1 max-w-sm text-[14px] text-[#667c74]">
              Add exchange rates so prices can be displayed outside the USD base currency.
            </p>
            <button
              onClick={openCreatePanel}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#2e6f57] px-4 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#255f49]"
            >
              Create first currency
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[880px] w-full text-left">
              <thead className="bg-[#f5f7f6] text-[12px] uppercase tracking-[0.12em] text-[#667c74]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Currency</th>
                  <th className="px-5 py-3 font-semibold">Rate</th>
                  <th className="px-5 py-3 font-semibold">Preview</th>
                  <th className="px-5 py-3 font-semibold">Decimals</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
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
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditPanel(currency)}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#dfe8e4] bg-white px-3 text-[12px] font-medium text-[#2e6f57] transition hover:border-[#2e6f57] hover:bg-[#f5f7f6]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrencyToDelete(currency)}
                          disabled={currency.isBaseCurrency || deletingId === currency.id}
                          title={currency.isBaseCurrency ? "Base currency cannot be deleted" : undefined}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#fecaca] bg-white px-3 text-[12px] font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {deletingId === currency.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isPanelOpen && (
        <CurrencyFormPanel
          isOpen={isPanelOpen}
          currency={editingCurrency}
          onClose={() => setIsPanelOpen(false)}
          onSaved={() => setIsPanelOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={!!currencyToDelete}
        title="Delete Currency"
        message={`Are you sure you want to delete "${currencyToDelete?.code}"? This will soft delete the currency.`}
        confirmText="Delete Currency"
        onConfirm={() => currencyToDelete && confirmDelete(currencyToDelete.id)}
        onCancel={() => setCurrencyToDelete(null)}
        isPending={deletingId === currencyToDelete?.id}
      />
    </div>
  );
}
