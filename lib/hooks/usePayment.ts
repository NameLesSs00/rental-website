import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axiosInstance";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreatePaypalOrderRequest {
  bookingId: string;
}

export interface CreatePaypalOrderResponse {
  orderId: string;
  approvalUrl: string;
}

export interface InitializePaypalRequest {
  bookingId: string;
}

export interface InitializePaypalResponseData {
  paymentId: string;
  bookingId: string;
  provider: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CapturePaypalRequest {
  orderId: string;
}

export interface CapturePaypalResponseData {
  paymentId: string;
  bookingId: string;
  provider: string;
  payPalOrderId: string;
  payPalCaptureId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: string;
  transactionId?: string;
  paymentStatusName?: string;
  bookingNumber?: string;
  bookingType?: string;
  bookingCategory?: string;
  paymentType?: string | number;
  paymentTypeName?: string;
  type?: string | number;
  bookingExtensionId?: string | null;
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface InitializePaymobRequest {
  bookingId: string;
}

export interface InitializePaymobResponseData {
  paymentId: string;
  bookingId: string;
  bookingNumber: string;
  payPalOrderId: string | null;
  providerOrderId: string;
  approveUrl: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
}

export interface CapturePaymentData {
  bookingId?: string;
  bookingExtensionId?: string | null;
  bookingNumber: string;
  bookingType?: string;
  bookingCategory?: string;
  type?: string | number;
  paymentType?: string | number;
  paymentTypeName?: string;
  paymentStatus: number;
  paymentStatusName: string;
  amount: number;
  currency: string;
  transactionId: string;
  message: string;
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  pickupDate?: string;
  pickupTime?: string;
  passengers?: number;
  buyingId?: string;
  propertyBuyingName?: string;
}

export interface PaymentApiResponse<T = CapturePaymentData> {
  data: T | null;
  isSuccess: boolean;
  message: string | null;
  errors: string[];
  type: number;
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  bookingExtensionId: string | null;
  amount: number;
  currency: string;
  provider: number;
  providerName: string;
  paymentType: number;
  paymentTypeName: string;
  payPalOrderId: string | null;
  payPalCaptureId: string | null;
  transactionId: string | null;
  payerEmail: string | null;
  status: number;
  statusName: string;
  failureReason: string | null;
  createdAtUtc: string;
  paidAt: string | null;
  refundedAt: string | null;
}

// ── Hooks ────────────────────────────────────────────────────────────────────

function extractApiError(err: unknown, fallback: string): string {
  const errorObj = err as {
    response?: {
      data?:
        | {
            detail?: string;
            title?: string;
            message?: string;
            errors?: string[] | Record<string, string[]>;
          }
        | string;
    };
    message?: string;
  };
  const data = errorObj.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    if (data.detail) return data.detail;
    if (Array.isArray(data.errors) && data.errors.length > 0) return data.errors[0];
    if (data.title) return data.title;
    if (data.message) return data.message;
  }
  return errorObj.message || fallback;
}

/**
 * Initialize PayPal payment for a booking using the backend endpoint.
 * POST /api/payments/paypal/initialize
 * Returns { paymentId, bookingId, provider, orderId, amount, currency, status }
 */
export function useInitializePaypalPayment() {
  return useMutation({
    mutationFn: async (payload: InitializePaypalRequest): Promise<InitializePaypalResponseData> => {
      try {
        const res = await axiosInstance.post<
          InitializePaypalResponseData | PaymentApiResponse<InitializePaypalResponseData>
        >("/api/payments/paypal/initialize", payload);
        const data = res.data;
        if (!data) throw new Error("No response from payment server.");

        if ("isSuccess" in data) {
          if (!data.isSuccess || !data.data) {
            throw new Error(data.errors?.[0] || data.message || "Failed to initialize PayPal payment.");
          }
          return data.data;
        }
        return data as InitializePaypalResponseData;
      } catch (err) {
        throw new Error(extractApiError(err, "Failed to initialize PayPal payment."));
      }
    },
  });
}

/**
 * Capture PayPal order after user approves the payment via SDK.
 * POST /api/payments/paypal/capture
 * Body: { orderId: string }
 */
export function useCapturePaypalPayment() {
  return useMutation({
    mutationFn: async (
      orderIdOrPayload: string | CapturePaypalRequest
    ): Promise<CapturePaypalResponseData> => {
      const orderId =
        typeof orderIdOrPayload === "string" ? orderIdOrPayload : orderIdOrPayload.orderId;
      const payload: CapturePaypalRequest = { orderId };

      try {
        const res = await axiosInstance.post<
          CapturePaypalResponseData | PaymentApiResponse<CapturePaypalResponseData>
        >("/api/payments/paypal/capture", payload);
        const data = res.data;
        if (!data) throw new Error("No response from payment server.");

        const raw = "isSuccess" in data ? (data.isSuccess && data.data ? data.data : null) : (data as CapturePaypalResponseData);
        if (!raw) {
          const errMessage = ("isSuccess" in data && data.errors?.[0]) || ("isSuccess" in data && data.message) || "Failed to capture PayPal payment.";
          throw new Error(errMessage);
        }
        return {
          ...raw,
          transactionId: raw.payPalCaptureId || raw.payPalOrderId || raw.transactionId || "",
          paymentStatusName: raw.paymentStatus || raw.paymentStatusName || "Paid",
          bookingNumber: raw.bookingNumber || "",
        };
      } catch (err) {
        throw new Error(extractApiError(err, "Failed to capture PayPal payment."));
      }
    },
  });
}

/**
 * Initialize Paymob payment for a booking and retrieve the Unified Checkout URL.
 * Returns { approveUrl, checkoutUrl, amount, currency, ... }
 * @deprecated Use useInitializePaypalPayment instead.
 */
export function useInitializePaymobPayment() {
  return useMutation({
    mutationFn: async (payload: InitializePaymobRequest) => {
      const { data } = await axiosInstance.post<PaymentApiResponse<InitializePaymobResponseData>>(
        "/api/payments/initialize",
        payload
      );
      if (!data.isSuccess || !data.data) {
        throw new Error(data.errors?.[0] || data.message || "Could not initialize payment.");
      }
      return data.data;
    },
  });
}

/**
 * Step 1b: After booking is created, create a PayPal order.
 * Returns { orderId, approvalUrl } — redirect user to approvalUrl.
 */
export function useCreatePaypalOrder() {
  return useMutation({
    mutationFn: async (payload: CreatePaypalOrderRequest) => {
      const { data } = await axiosInstance.post<{ orderId: string; approvalUrl: string }>(
        "/api/payments/paypal/create-order",
        payload
      );
      return data;
    },
  });
}

export function useBookingPayments(bookingId: string) {
  return useQuery({
    queryKey: ["payments", "booking", bookingId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<PaymentApiResponse<BookingPayment[]>>(
          `/api/payments/booking/${bookingId}`
        );
        return data.data || [];
      } catch (error) {
        const apiError = error as {
          response?: { status?: number; data?: PaymentApiResponse<BookingPayment[]> };
        };

        if (
          apiError.response?.status === 404 &&
          apiError.response.data?.message?.toLowerCase().includes("no payments found")
        ) {
          return [];
        }

        throw error;
      }
    },
    enabled: !!bookingId,
    staleTime: 30 * 1000,
  });
}


/**
 * Fallback: If capture fails or user cancels, call this to notify the backend.
 */
export function useCancelPayment() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axiosInstance.post("/api/payments/cancel", { orderId });
      return data;
    },
  });
}

/**
 * Edit an admin payment.
 */
export function useUpdateAdminPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, payload }: { paymentId: string; payload: { bookingId: string; payAmount: number; paidAmount: number } }) => {
      const { data } = await axiosInstance.put<PaymentApiResponse>(
        `/api/admin/payments/${paymentId}`,
        payload
      );
      return data;
    },
    onSuccess: (_data, { payload }) => {
      queryClient.invalidateQueries({ queryKey: ["payments", "booking", payload.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "admin", "property", payload.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "admin", "property"] });
    },
  });
}

export interface PaymentHistoryItem {
  id: string;
  paymentId: string;
  bookingId: string;
  previousAmount: number;
  newAmount: number;
  previousStatus: number;
  previousStatusName: string;
  newStatus: number;
  newStatusName: string;
  changedBy: string;
  changedAt: string;
}

/**
 * Get payment modification history for a specific payment.
 */
export function usePaymentHistory(paymentId: string) {
  return useQuery({
    queryKey: ["payments", "history", paymentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaymentApiResponse<PaymentHistoryItem[]>>(
        `/api/payments/${paymentId}/history`
      );
      return data.data || [];
    },
    enabled: !!paymentId,
    staleTime: 30 * 1000,
  });
}
