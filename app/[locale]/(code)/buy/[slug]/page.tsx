import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SingleBuyPropertyPageContent from "@/components/SingleBuyPropertyPageContent";
import { API_BASE_URL } from "@/lib/api/config";
import { getPropertyIdBySlug } from "@/lib/api/propertyHelpers";
import { siteConfig } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

import { slugify } from "@/lib/utils/slugify";

type PropertyImage = {
  isCover?: boolean;
  imageUrl?: string;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const messages = getMessages(locale);
  const id = await getPropertyIdBySlug(slug, "buy", locale);
  
  if (!id) {
    return {
      title: messages.buy.metaNotFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  try {
    // We use fetch here directly for server-side metadata generation to avoid axios instance issues on server
    const res = await fetch(`${API_BASE_URL}/api/public/property-buyings/${id}`, {
      next: { revalidate: 60 },
      headers: { "Accept-Language": locale, "X-Locale": locale },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    const property = json.data;
    
    const coverImage = (property?.images as PropertyImage[] | undefined)?.find((img) => img.isCover)?.imageUrl;

    return {
      title: property?.title || messages.buy.metaDefaultTitle,
      description:
        property?.description?.substring(0, 160) ||
        messages.buy.metaDefaultDescription,
      alternates: {
        canonical: `/${locale}/buy/${slug}`,
      },
      openGraph: {
        title: `${property?.title || messages.buy.metaDefaultTitle} | ${siteConfig.name}`,
        description:
          property?.description?.substring(0, 160) ||
          messages.buy.metaDefaultDescription,
        images: coverImage ? [{ url: `${API_BASE_URL}/${coverImage}` }] : []
      }
    };
  } catch {
    return { title: messages.buy.metaDetailsTitle };
  }
}

export default async function SingleBuyPropertyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const id = await getPropertyIdBySlug(slug, "buy", locale);

  if (!id) {
    notFound();
  }

  return <SingleBuyPropertyPageContent id={id as string} />;
}

