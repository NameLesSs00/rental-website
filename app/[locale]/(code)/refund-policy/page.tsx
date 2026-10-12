import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import RefundPolicyContent from "@/components/RefundPolicyContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return {
    title: `${messages.refundPolicy.metadataTitle} | ${siteConfig.name}`,
    description: messages.refundPolicy.metadataDescription,
    alternates: {
      canonical: `/${locale}/refund-policy`,
    },
    openGraph: {
      title: `${messages.refundPolicy.metadataTitle} | ${siteConfig.name}`,
      description: messages.refundPolicy.metadataDescription,
      url: `/${locale}/refund-policy`,
    },
  };
}

export default async function RefundPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return <RefundPolicyContent locale={locale} messages={messages} />;
}
