import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import CancellationPolicyContent from "@/components/CancellationPolicyContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return {
    title: `${messages.cancellationPolicy.metadataTitle} | ${siteConfig.name}`,
    description: messages.cancellationPolicy.metadataDescription,
    alternates: {
      canonical: `/${locale}/cancellation-policy`,
    },
    openGraph: {
      title: `${messages.cancellationPolicy.metadataTitle} | ${siteConfig.name}`,
      description: messages.cancellationPolicy.metadataDescription,
      url: `/${locale}/cancellation-policy`,
    },
  };
}

export default async function CancellationPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return <CancellationPolicyContent locale={locale} messages={messages} />;
}
