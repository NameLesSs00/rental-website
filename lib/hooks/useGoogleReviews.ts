import { useQuery } from "@tanstack/react-query";
import type { GooglePlacesResponse } from "../types/googleReview";

export function useGoogleReviews(lang: string = "en") {
  return useQuery<GooglePlacesResponse>({
    queryKey: ["google-reviews", lang],
    queryFn: async () => {
      const res = await fetch(`/api/google-reviews?lang=${encodeURIComponent(lang)}`);
      if (!res.ok) throw new Error("Failed to fetch Google reviews");
      return res.json() as Promise<GooglePlacesResponse>;
    },
    // Cache per session for 1.5 hours
    staleTime: 90 * 60 * 1000,
    retry: 1,
  });
}
