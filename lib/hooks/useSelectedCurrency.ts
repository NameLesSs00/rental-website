"use client";

import { useCallback, useEffect, useState } from "react";

export const DEFAULT_CURRENCY = "USD";
export const SELECTED_CURRENCY_STORAGE_KEY = "selected_currency";
export const SELECTED_CURRENCY_EVENT = "selected-currency-change";

function normalizeCurrency(value: string | null | undefined) {
  const normalized = value?.trim().toUpperCase();
  return normalized || DEFAULT_CURRENCY;
}

function readSelectedCurrency() {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  return normalizeCurrency(window.localStorage.getItem(SELECTED_CURRENCY_STORAGE_KEY));
}

export function saveSelectedCurrency(value: string) {
  const normalized = normalizeCurrency(value);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SELECTED_CURRENCY_STORAGE_KEY, normalized);
    window.dispatchEvent(new CustomEvent<string>(SELECTED_CURRENCY_EVENT, { detail: normalized }));
  }
  return normalized;
}

export function useSelectedCurrency(urlCurrency?: string | null) {
  const normalizedUrlCurrency = urlCurrency ? normalizeCurrency(urlCurrency) : "";
  const [currency, setCurrencyState] = useState(() => normalizedUrlCurrency || DEFAULT_CURRENCY);

  useEffect(() => {
    if (normalizedUrlCurrency) {
      window.setTimeout(() => {
        setCurrencyState(saveSelectedCurrency(normalizedUrlCurrency));
      }, 0);
      return;
    }

    const stored = readSelectedCurrency();
    if (stored) {
      setCurrencyState(stored);
    }
  }, [normalizedUrlCurrency]);

  useEffect(() => {
    const handleCurrencyChange = (event: Event) => {
      const nextCurrency = (event as CustomEvent<string>).detail;
      setCurrencyState(normalizeCurrency(nextCurrency));
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SELECTED_CURRENCY_STORAGE_KEY) {
        setCurrencyState(normalizeCurrency(event.newValue));
      }
    };

    window.addEventListener(SELECTED_CURRENCY_EVENT, handleCurrencyChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(SELECTED_CURRENCY_EVENT, handleCurrencyChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setSelectedCurrency = useCallback((value: string) => {
    setCurrencyState(saveSelectedCurrency(value));
  }, []);

  return [currency, setSelectedCurrency] as const;
}
