import type { Currency, PriceInfo } from "@/lib/types/currency";

function getFiniteNumber(value: number | null | undefined, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  return Number.isFinite(value) ? value : fallback;
}

export function formatUsd(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
    maximumFractionDigits,
  }).format(getFiniteNumber(value));
}

export function formatCurrency(value: number | null | undefined, currencyCode: string = "USD", maximumFractionDigits = 0) {
  const amount = getFiniteNumber(value);
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "code",
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `${currencyCode} ${new Intl.NumberFormat("en", { maximumFractionDigits }).format(
      amount
    )}`;
  }
}

export function formatPriceInfo(
  priceInfo: PriceInfo | null | undefined,
  fallbackAmount: number | null | undefined,
  fallbackCurrency = "USD",
  maximumFractionDigits = 0
) {
  return formatCurrency(
    priceInfo?.amount ?? getFiniteNumber(fallbackAmount),
    priceInfo?.currency ?? fallbackCurrency,
    maximumFractionDigits
  );
}

export function formatPriceForCurrency(
  priceInfo: PriceInfo | null | undefined,
  fallbackAmount: number | null | undefined,
  selectedCurrency: string,
  currencies: Currency[],
  maximumFractionDigits = 0
) {
  const targetCode = (selectedCurrency || priceInfo?.currency || "USD").toUpperCase();
  const infoCurrency = priceInfo?.currency?.toUpperCase();

  if (priceInfo && infoCurrency === targetCode) {
    return formatCurrency(priceInfo.amount, targetCode, maximumFractionDigits);
  }

  const targetCurrency = currencies.find((currency) => currency.code.toUpperCase() === targetCode);
  if (targetCurrency) {
    const baseCode = (priceInfo?.baseCurrency || "USD").toUpperCase();
    const sourceCurrency = currencies.find((currency) => currency.code.toUpperCase() === baseCode);
    const sourceRate = sourceCurrency?.exchangeRate || 1;
    const baseAmount = getFiniteNumber(priceInfo?.baseAmount, getFiniteNumber(fallbackAmount));
    const convertedAmount = sourceRate ? (baseAmount / sourceRate) * targetCurrency.exchangeRate : baseAmount;

    return formatCurrency(convertedAmount, targetCode, maximumFractionDigits);
  }

  return formatPriceInfo(priceInfo, fallbackAmount, targetCode, maximumFractionDigits);
}

export function getPriceInfoAmount(priceInfo: PriceInfo | null | undefined, fallbackAmount: number | null | undefined) {
  return getFiniteNumber(priceInfo?.amount, getFiniteNumber(fallbackAmount));
}

export function getPriceInfoCurrency(priceInfo: PriceInfo | null | undefined, fallbackCurrency = "USD") {
  return priceInfo?.currency || fallbackCurrency;
}
