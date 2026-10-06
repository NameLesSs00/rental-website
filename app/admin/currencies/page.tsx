import type { Metadata } from "next";
import CurrenciesContent from "@/components/CurrenciesContent";

export const metadata: Metadata = {
  title: "Currencies | Admin",
  description: "Manage currency exchange rates and status.",
};

export default function CurrenciesPage() {
  return <CurrenciesContent />;
}
