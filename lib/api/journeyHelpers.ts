import { API_BASE_URL } from "@/lib/api/config";
import type { JourneyItem, JourneyApiResponse } from "@/lib/types/journey";
import { slugify } from "@/lib/utils/slugify";

type JourneyListResponse = JourneyApiResponse<{
  items: JourneyItem[];
}>;

export async function getJourneyIdBySlug(slug: string, locale: string = "en") {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const localesToTry = locale === "en" ? ["en"] : [locale, "en"];

    for (const lookupLocale of localesToTry) {
      const res = await fetch(`${API_BASE_URL}/api/journeys?pageNumber=1&pageSize=100&isActive=true`, {
        next: { revalidate: 60 },
        headers: { "Accept-Language": lookupLocale, "X-Locale": lookupLocale },
      });

      if (res.ok) {
        const json = (await res.json()) as JourneyListResponse;
        const journeys = json.data?.items ?? [];
        const match = journeys.find((journey) => journey.id === decodedSlug || slugify(journey.name) === decodedSlug);
        if (match) return match.id;
      }
    }
    return slug;
  } catch {
    return slug;
  }
}

export async function getJourneyBySlug(slug: string, locale: string = "en") {
  const id = await getJourneyIdBySlug(slug, locale);

  try {
    const res = await fetch(`${API_BASE_URL}/api/journeys/${id}`, {
      next: { revalidate: 60 },
      headers: { "Accept-Language": locale, "X-Locale": locale },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as JourneyApiResponse<JourneyItem>;
    return json.data;
  } catch {
    return null;
  }
}
