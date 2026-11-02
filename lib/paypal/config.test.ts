import { describe, it, expect } from "vitest";
import { PAYPAL_CLIENT_ID, PAYPAL_CURRENCY, getPayPalLocale } from "./config";

describe("PayPal config", () => {
  it("provides a valid fallback client id", () => {
    expect(PAYPAL_CLIENT_ID).toBeDefined();
    expect(PAYPAL_CLIENT_ID.length).toBeGreaterThan(10);
  });

  it("provides a default currency", () => {
    expect(PAYPAL_CURRENCY).toBe("USD");
  });

  it("maps app locales to PayPal SDK supported locales", () => {
    expect(getPayPalLocale("ar")).toBe("ar_EG");
    expect(getPayPalLocale("de")).toBe("de_DE");
    expect(getPayPalLocale("fr")).toBe("fr_FR");
    expect(getPayPalLocale("ru")).toBe("ru_RU");
    expect(getPayPalLocale("en")).toBe("en_US");
    expect(getPayPalLocale("unknown")).toBe("en_US");
  });
});

