import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axiosInstance";
import type {
  CurrenciesQuery,
  Currency,
  CurrencyApiResponse,
  CreateCurrencyRequest,
  UpdateCurrencyRequest,
} from "@/lib/types/currency";

const CURRENCIES_KEY = "currencies";

export function useCurrencies(query: CurrenciesQuery = {}) {
  return useQuery({
    queryKey: [CURRENCIES_KEY, query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CurrencyApiResponse<Currency[]>>(
        "/api/currencies",
        { params: query }
      );
      return data.data ?? [];
    },
    staleTime: 30 * 1000,
  });
}

export function useCurrency(id: string, enabled = true) {
  return useQuery({
    queryKey: [CURRENCIES_KEY, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CurrencyApiResponse<Currency>>(
        `/api/currencies/${id}`
      );
      return data.data;
    },
    enabled: Boolean(id && enabled),
    staleTime: 30 * 1000,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCurrencyRequest) => {
      const { data } = await axiosInstance.post<CurrencyApiResponse<Currency>>(
        "/api/currencies",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENCIES_KEY] });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCurrencyRequest;
    }) => {
      const { data } = await axiosInstance.put<CurrencyApiResponse<Currency>>(
        `/api/currencies/${id}`,
        payload
      );
      return data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CURRENCIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [CURRENCIES_KEY, id] });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<CurrencyApiResponse<boolean>>(
        `/api/currencies/${id}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENCIES_KEY] });
    },
  });
}
