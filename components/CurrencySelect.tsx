"use client";

import { useCurrencies } from "@/lib/hooks/useCurrency";
import { saveSelectedCurrency } from "@/lib/hooks/useSelectedCurrency";

type CurrencySelectProps = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  label?: string;
  className?: string;
  selectClassName?: string;
};

export default function CurrencySelect({
  value,
  onChange,
  name = "Currency",
  label = "Currency",
  className = "",
  selectClassName = "",
}: CurrencySelectProps) {
  const { data: currencies = [], isLoading, isError } = useCurrencies({ isActive: true });
  const normalizedValue = (value || "USD").toUpperCase();
  const options = currencies.length > 0 ? currencies : [
    {
      id: "USD",
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      exchangeRate: 1,
      decimalPlaces: 2,
      isActive: true,
      isBaseCurrency: true,
      createdAtUtc: "",
      updatedAtUtc: null,
    },
  ];

  const handleChange = (nextValue: string) => {
    const normalizedNextValue = saveSelectedCurrency(nextValue);
    onChange(normalizedNextValue);
  };

  return (
    <label className={className}>
      <span className="mb-1.5 block truncate text-[13px] font-medium leading-none text-[#1F4D3D] sm:text-[14px]">
        {label}
      </span>
      <select
        name={name}
        value={normalizedValue}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isLoading && currencies.length === 0}
        aria-label={label}
        className={selectClassName}
      >
        {options.map((currency) => (
          <option key={currency.id} value={currency.code}>
            {currency.code}
          </option>
        ))}
        {isError && !options.some((currency) => currency.code === normalizedValue) && (
          <option value={normalizedValue}>{normalizedValue}</option>
        )}
      </select>
    </label>
  );
}
