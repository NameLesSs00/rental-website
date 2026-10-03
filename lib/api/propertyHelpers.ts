import { slugify } from "@/lib/utils/slugify";
import { API_BASE_URL } from "@/lib/api/config";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

type SlugSourceItem = {
  id: string;
  name?: string;
  title?: string;
};

async function getSlugItems(type: "rent" | "buy", locale: Locale) {
  const endpoint = type === "rent" ? "/api/properties/filter?pageSize=1000" : "/api/public/property-buyings?pageSize=1000";
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
    headers: { "Accept-Language": locale, "X-Locale": locale },
  });
  if (!res.ok) return [];

  const json = await res.json();
  return (json.data?.items || []) as SlugSourceItem[];
}

export async function getPropertyIdBySlug(slug: string, type: "rent" | "buy" = "rent", locale: Locale = defaultLocale): Promise<string | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const localesToTry = locale === defaultLocale ? [defaultLocale] : [locale, defaultLocale];

    for (const lookupLocale of localesToTry) {
      const items = await getSlugItems(type, lookupLocale);
      const match = items.find((item) => {
        const name = type === "rent" ? item.name : item.title;
        return item.id === decodedSlug || slugify(name ?? "") === decodedSlug;
      });

      if (match) return match.id;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch properties for slug mapping:", error);
    return null;
  }
}
