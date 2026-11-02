"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  PayPalButtons,
  FUNDING,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  useInitializePaypalPayment,
  useCapturePaypalPayment,
  type CapturePaypalResponseData,
} from "@/lib/hooks/usePayment";
import { useI18n } from "@/components/I18nProvider";
import { Lock, CreditCard } from "lucide-react";

export interface PayPalCheckoutProps {
  bookingId: string;
  onSuccess: (captureData: CapturePaypalResponseData) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

const isWindowClosedError = (err: unknown): boolean => {
  if (!err) return false;
  const msg =
    typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err);
  return (
    msg.includes("Target window is closed") ||
    msg.includes("Window was closed") ||
    msg.includes("popup close") ||
    msg.includes("closed")
  );
};

function CardSubmitButton({
  isCapturing,
  onStartCapturing,
  onError,
}: {
  isCapturing: boolean;
  onStartCapturing: () => void;
  onError: (msg: string) => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();

  const handlePayClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFieldsForm) return;

    setIsSubmitting(true);
    try {
      const state = await cardFieldsForm.getState();
      if (!state.isFormValid) {
        setIsSubmitting(false);
        onError("Please fill in all card details correctly.");
        return;
      }

      onStartCapturing();
      // cardFieldsForm.submit() executes tokenization & 3D Secure,
      // which triggers onApprove on PayPalCardFieldsProvider upon success.
      await cardFieldsForm.submit();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Card submission failed.";
      onError(msg);
    }
  };

  const isBusy = isCapturing || isSubmitting;

  return (
    <button
      type="button"
      onClick={handlePayClick}
      disabled={isBusy}
      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2e6f57] text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#255f49] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isBusy ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>{t("payment.paypal.processing")}</span>
        </>
      ) : (
        <>
          <Lock className="size-4" />
          <span>{t("common.bookNow")}</span>
        </>
      )}
    </button>
  );
}

export function PayPalCheckout({
  bookingId,
  onSuccess,
  onCancel,
  onError,
}: PayPalCheckoutProps) {
  const { t } = useI18n();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const isCapturingRef = useRef(false);

  const { mutateAsync: initializePaypal } = useInitializePaypalPayment();
  const { mutateAsync: capturePaypal } = useCapturePaypalPayment();

  const handleCreateOrder = async () => {
    setLocalError(null);
    try {
      console.log("[PayPal] Initializing payment for booking:", bookingId);
      const res = await initializePaypal({ bookingId });
      console.log("[PayPal] Initialized order response:", res);
      if (!res.orderId) {
        throw new Error("No PayPal Order ID was returned by the server.");
      }
      return res.orderId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("booking.errors.paymentStartFailed");
      setLocalError(message);
      onError?.(err instanceof Error ? err : new Error(message));
      throw err;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturing(true);
    setLocalError(null);

    try {
      console.log("[PayPal] onApprove received data:", data);
      const capturePayload = {
        orderId: data.orderID,
        bookingId,
      };
      console.log("[PayPal] Sending capture request with payload:", capturePayload);
      const captureRes = await capturePaypal(capturePayload);
      console.log("[PayPal] Capture successful:", captureRes);
      onSuccess(captureRes);
    } catch (err: unknown) {
      isCapturingRef.current = false;
      setIsCapturing(false);
      console.error("[PayPal] Capture request failed:", err);
      const message = err instanceof Error ? err.message : t("payment.paypal.captureFailed");
      setLocalError(message);
      onError?.(err instanceof Error ? err : new Error(message));
    }
  };

  const handleCancel = () => {
    setLocalError(t("payment.paypal.cancelled"));
    onCancel?.();
  };

  const handleError = (err: unknown) => {
    console.error("PAYPAL SDK ERROR:", err);
    setIsCapturing(false);
    isCapturingRef.current = false;
    if (isWindowClosedError(err)) {
      setLocalError(t("payment.paypal.cancelled"));
      return;
    }
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : t("payment.paypal.captureFailed");
    setLocalError(message);
    onError?.(new Error(message));
  };

  if (isRejected) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-[13px] font-medium text-red-700">
          {t("payment.paypal.sdkFailed")}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-[12px] font-semibold text-red-800 underline hover:no-underline"
        >
          {t("payment.statusMessages.tryAgain")}
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-[#dfe8e4] bg-[#f8faf9] p-6">
        <span className="size-6 animate-spin rounded-full border-2 border-[#183c2f] border-t-transparent" />
        <span className="text-[13px] font-medium text-[#667c74]">
          {t("payment.paypal.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isCapturing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
          <span className="size-7 animate-spin rounded-full border-2 border-[#2e6f57] border-t-transparent" />
          <p className="mt-2 text-[13px] font-medium text-[#183c2f]">
            {t("payment.paypal.processing")}
          </p>
        </div>
      )}

      {localError && (
        <div className="mb-3.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700">
          <p className="font-medium leading-relaxed">{localError}</p>
        </div>
      )}

      {/* 1. Yellow PayPal Button (Direct PayPal window popup) */}
      <div className="space-y-1.5">
        <label className="block text-[12px] font-semibold text-[#183c2f]">
          Quick Checkout with PayPal
        </label>
        <div className="w-full overflow-hidden rounded-xl border border-[#e8dcb5] bg-[#fffbf0] p-1 shadow-xs">
          <PayPalButtons
            fundingSource={FUNDING.PAYPAL}
            style={{
              layout: "horizontal",
              color: "gold",
              shape: "rect",
              height: 44,
              tagline: false,
              label: "paypal",
            }}
            disabled={isCapturing}
            forceReRender={[bookingId]}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onError={handleError}
          />
        </div>
      </div>

      {/* 2. Subtle Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e2e8f0]" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-[#8a9a94]">
          or pay with card
        </span>
      </div>

      {/* 3. Card Fields */}
      <PayPalCardFieldsProvider
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={handleError}
        style={{
          input: {
            "font-size": "15px",
            "font-family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "#183c2f",
            border: "1px solid #d4dfda",
            borderRadius: "10px",
            padding: "11px 15px",
            "line-height": "1.4",
            outline: "none",
            transition: "all 0.2s ease-in-out",
          },
          ":focus": {
            border: "1px solid #2e6f57",
            boxShadow: "0 0 0 3px rgba(46, 111, 87, 0.12)",
            color: "#183c2f",
          },
          ".invalid": {
            border: "1px solid #dc2626",
            boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
            color: "#dc2626",
          },
        }}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
          {/* Cardholder Name */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-[#183c2f]">
              <span>Cardholder Name</span>
            </label>
            <PayPalNameField
              placeholder="e.g. John Doe"
              className="h-[46px] w-full"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-[#183c2f]">
              <span className="flex items-center gap-1.5">
                <CreditCard className="size-4 text-[#2e6f57]" />
                Card Number
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded bg-[#f0f4f2] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#2e6f57]">VISA</span>
                <span className="rounded bg-[#f0f4f2] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#c25e00]">MC</span>
              </span>
            </label>
            <PayPalNumberField
              placeholder="4032 0000 0000 0001"
              className="h-[46px] w-full"
            />
          </div>

          {/* Expiry and CVV side by side */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#183c2f]">
                Expiration Date
              </label>
              <PayPalExpiryField
                placeholder="MM / YY"
                className="h-[46px] w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#183c2f]">
                Security Code
              </label>
              <PayPalCVVField
                placeholder="CVV"
                className="h-[46px] w-full"
              />
            </div>
          </div>

          <CardSubmitButton
            isCapturing={isCapturing}
            onStartCapturing={() => {
              setIsCapturing(true);
              setLocalError(null);
            }}
            onError={(msg) => {
              setIsCapturing(false);
              setLocalError(msg);
            }}
          />
        </form>
      </PayPalCardFieldsProvider>
    </div>
  );
}

export default PayPalCheckout;
