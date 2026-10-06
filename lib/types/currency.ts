export interface PriceInfo {
  baseAmount: number;
  baseCurrency: string;
  amount: number;
  currency: string;
  conversionRate: number;
  currencySymbol: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
  isActive: boolean;
  isBaseCurrency: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface CurrenciesQuery {
  isActive?: boolean;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
}

export interface UpdateCurrencyRequest {
  name: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
  isActive: boolean;
}

export interface CurrencyApiResponse<T = Currency> {
  data: T | null;
  isSuccess: boolean;
  message: string | null;
  errors: string[];
  type: number;
}
