import { NextResponse } from "next/server";

// Revalidate every hour so we don't hammer the Google Places API
export const revalidate = 3600;

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { error: "Google Places API is not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
        },
        // Cache the upstream fetch for 1 hour
        next: { revalidate: 3600 },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Google Places API error." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Google reviews." },
      { status: 500 }
    );
  }
}

