import type { Metadata } from "next";
import BuyPropertiesPageContent from "@/components/BuyPropertiesPageContent";

export const metadata: Metadata = {
  title: "Properties for Sale | Hurghada Vacation Homes",
  description: "Browse properties for sale in Hurghada. Find your dream home with Hurghada Vacation Homes.",
  alternates: { canonical: "/buy" },
};

export default function BuyPage() {
  return <BuyPropertiesPageContent />;
}
