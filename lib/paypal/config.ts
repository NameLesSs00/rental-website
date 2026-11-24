export const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAAPv2Q1jTlhM_svxPXJS885oPS8pRMGzwV65gwaPDP2euuJ98LSKIAn5fVHrEbycBVVhcVueSGwpplupM";

export const PAYPAL_CURRENCY =
  process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD";

/**
 * Map app locale (en, ar, de, fr, ru) to PayPal SDK supported locale string.
 */
export function getPayPalLocale(appLocale: string): string {
  switch (appLocale) {
    case "ar":
      return "ar_EG";
    case "de":
      return "de_DE";
    case "fr":
      return "fr_FR";
    case "ru":
      return "ru_RU";
    case "en":
    default:
      return "en_US";
  }
}

