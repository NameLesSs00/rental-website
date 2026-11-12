export type PaymentBookingKind = "rent" | "transfer" | "buy";
export type PaymentGateway = "paypal" | "paymob";

export interface PaymentBookingContext {
  kind: PaymentBookingKind;
  bookingId?: string;
  bookingNumber?: string;
  title?: string;
  propertyId?: string;
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  journeyId?: string;
  journeyName?: string;
  pickupDate?: string;
  pickupTime?: string;
  passengers?: number;
  buyingId?: string;
  amount?: number;
  currency?: string;
  checkoutUrl?: string;
  paymentId?: string;
  gateway?: PaymentGateway;
  expiresAt?: number;
}

export const PAYMENT_BOOKING_CONTEXT_KEY = "payment_booking_context";
export const ACTIVE_PENDING_BOOKING_PREFIX = "active_pending_booking_";

export function savePaymentBookingContext(context: PaymentBookingContext) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAYMENT_BOOKING_CONTEXT_KEY, JSON.stringify(context));
}

export function readPaymentBookingContext(): PaymentBookingContext | null {
  if (typeof window === "undefined") return null;

  const rawContext = localStorage.getItem(PAYMENT_BOOKING_CONTEXT_KEY);
  if (!rawContext) return null;

  try {
    const parsed = JSON.parse(rawContext) as PaymentBookingContext;
    if (parsed.kind === "rent" || parsed.kind === "transfer" || parsed.kind === "buy") {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearPaymentBookingContext() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PAYMENT_BOOKING_CONTEXT_KEY);
}

/**
 * Storage helpers for unexpired 5-minute reservation holds
 */
export function saveActiveHold(booking: any) {
  if (typeof window === "undefined" || !booking) return;
  const key = `${ACTIVE_PENDING_BOOKING_PREFIX}${booking.kind}_${booking.propertyId || booking.journeyId || "latest"}`;
  try {
    localStorage.setItem(key, JSON.stringify(booking));
    localStorage.setItem(`${ACTIVE_PENDING_BOOKING_PREFIX}latest`, JSON.stringify(booking));
  } catch {
    // Ignore storage quota errors
  }
}

export function readActiveHold(kind: "rent" | "transfer", targetId?: string): any | null {
  if (typeof window === "undefined") return null;
  const key = targetId
    ? `${ACTIVE_PENDING_BOOKING_PREFIX}${kind}_${targetId}`
    : `${ACTIVE_PENDING_BOOKING_PREFIX}latest`;

  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.kind !== kind) return null;

    // Check if the 5-minute hold has expired
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      clearActiveHold(kind, targetId);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveHold(kind?: "rent" | "transfer", targetId?: string) {
  if (typeof window === "undefined") return;
  if (kind && targetId) {
    localStorage.removeItem(`${ACTIVE_PENDING_BOOKING_PREFIX}${kind}_${targetId}`);
  }
  localStorage.removeItem(`${ACTIVE_PENDING_BOOKING_PREFIX}latest`);
}
