import { useQuery } from "@tanstack/react-query";
import type { GooglePlacesResponse } from "../types/googleReview";

export function useGoogleReviews() {
  return useQuery<GooglePlacesResponse>({
    queryKey: ["google-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/google-reviews");
      if (!res.ok) throw new Error("Failed to fetch Google reviews");
      return res.json() as Promise<GooglePlacesResponse>;
    },
    // Reviews won't change per visitor session — cache for 1 hour client-side too
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

