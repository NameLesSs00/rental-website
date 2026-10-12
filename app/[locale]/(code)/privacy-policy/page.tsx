import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return {
    title: `${messages.privacyPolicy.metadataTitle} | ${siteConfig.name}`,
    description: messages.privacyPolicy.metadataDescription,
    alternates: {
      canonical: `/${locale}/privacy-policy`,
    },
    openGraph: {
      title: `${messages.privacyPolicy.metadataTitle} | ${siteConfig.name}`,
      description: messages.privacyPolicy.metadataDescription,
      url: `/${locale}/privacy-policy`,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);

  return <PrivacyPolicyContent locale={locale} messages={messages} />;
}
