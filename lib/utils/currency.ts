export function formatUsd(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCurrency(value: number, currencyCode: string = "USD", maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}
