import { NextRequest, NextResponse } from "next/server";
import type { GooglePlacesResponse, GoogleReview } from "@/lib/types/googleReview";

// Cache for 1.5 hours (5400 seconds)
export const revalidate = 5400;

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !targetLang) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return text;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: [string]) => item[0] || "").join("");
    }
    return text;
  } catch {
    return text;
  }
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { error: "Google Places API is not configured." },
      { status: 500 }
    );
  }

  // Get requested language from query param (?lang=en, ar, de, etc.), default to en
  const url = new URL(request.url);
  const targetLang = url.searchParams.get("lang") || "en";

  try {
    const languageCodes = ["en", "ar", "de", "fr", "ru"];

    const requests = languageCodes.map((lang) =>
      fetch(
        `https://places.googleapis.com/v1/places/${placeId}?languageCode=${lang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
          },
          next: { revalidate: 5400 },
        }
      ).then((res) => (res.ok ? res.json() : null))
    );

    const results = await Promise.all(requests);
    const validResults = results.filter(Boolean);

    if (validResults.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch place details from Google." },
        { status: 502 }
      );
    }

    const primary = validResults[0] as GooglePlacesResponse;

    // Deduplicate all reviews by reviewer identity
    const reviewMap = new Map<string, GoogleReview>();

    for (const res of validResults) {
      if (Array.isArray(res.reviews)) {
        for (const review of res.reviews as GoogleReview[]) {
          const key =
            review.authorAttribution?.uri ||
            review.authorAttribution?.displayName ||
            review.name;
          if (key && !reviewMap.has(key)) {
            reviewMap.set(key, review);
          }
        }
      }
    }

    const allReviews = Array.from(reviewMap.values());

    // 1. Filter: high-rated reviews (4★ and 5★) with actual text
    const highRatedReviews = allReviews.filter((r) => {
      const text = r.text?.text?.trim() || "";
      return r.rating >= 4 && text.length > 0;
    });

    // 2. Sort: 5★ first, then by comment length
    highRatedReviews.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      const lenA = a.text?.text?.trim()?.length || 0;
      const lenB = b.text?.text?.trim()?.length || 0;
      return lenB - lenA;
    });

    // 3. Take exactly 6 reviews
    const top6Reviews = highRatedReviews.slice(0, 6);

    // 4. Translate reviews to the active website language (e.g. English, Arabic, etc.)
    const translatedReviews = await Promise.all(
      top6Reviews.map(async (rev) => {
        const original = rev.text?.text || "";
        const originalLang = rev.text?.languageCode || "auto";

        // Only translate if not already in the target language
        if (originalLang === targetLang) {
          return rev;
        }

        const translated = await translateText(original, targetLang);
        return {
          ...rev,
          originalText: rev.originalText || rev.text,
          text: {
            text: translated,
            languageCode: targetLang,
          },
        };
      })
    );

    return NextResponse.json({
      id: primary.id,
      displayName: primary.displayName,
      rating: primary.rating,
      userRatingCount: primary.userRatingCount,
      googleMapsUri: primary.googleMapsUri,
      reviews: translatedReviews,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Google reviews." },
      { status: 500 }
    );
  }
}
