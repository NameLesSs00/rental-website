"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useGoogleReviews } from "@/lib/hooks/useGoogleReviews";
import { useI18n } from "@/components/I18nProvider";
import type { GoogleReview } from "@/lib/types/googleReview";

// ─── Helpers ────────────────────────────────────────────────────────────────

function StarRow({ rate }: { rate: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rate)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`size-4 shrink-0 ${i < full ? "text-[#cfb072]" : "text-[#e2ddd5]"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="ml-1.5 text-[13px] font-semibold text-[#cfb072]">
        {rate.toFixed(1)}
      </span>
    </div>
  );
}

/** Google "G" coloured logo as inline SVG */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#f0ede8] bg-white p-6 shadow-[0_4px_24px_rgba(31,77,61,0.06)]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-4 animate-pulse rounded-full bg-[#e8e4dc]" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-[#e8e4dc]" />
        <div className="h-3.5 w-5/6 animate-pulse rounded bg-[#e8e4dc]" />
        <div className="h-3.5 w-4/6 animate-pulse rounded bg-[#e8e4dc]" />
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-[#f0ede8] pt-4">
        <div className="size-9 animate-pulse rounded-full bg-[#e8e4dc]" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3 w-32 animate-pulse rounded bg-[#e8e4dc]" />
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-[#1F4D3D]",
  "bg-[#2e6f57]",
  "bg-[#cfb072]",
  "bg-[#8b6f3c]",
  "bg-[#4a7c68]",
];

function GoogleReviewCard({
  review,
  index,
}: {
  review: GoogleReview;
  index: number;
}) {
  const [photoError, setPhotoError] = useState(false);

  const { displayName, photoUri } = review.authorAttribution;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const reviewText = review.text?.text ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: "easeOut" }}
      className="flex flex-col gap-4 rounded-2xl border border-[#f0ede8] bg-white p-5 shadow-[0_4px_24px_rgba(31,77,61,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(31,77,61,0.12)] sm:p-6"
    >
      {/* Stars + Google logo */}
      <div className="flex items-center justify-between">
        <StarRow rate={review.rating} />
        <GoogleLogo className="size-5 shrink-0" />
      </div>

      {/* Quote + Comment */}
      <div className="relative flex-1">
        <svg
          className="absolute -left-1 -top-1 size-6 text-[#cfb072]/20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="line-clamp-4 pl-5 text-[13px] leading-relaxed text-[#5a6b64] sm:text-[14px]">
          {reviewText}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#f0ede8]" />

      {/* Footer: avatar + name + time */}
      <div className="flex items-center gap-3">
        {/* Profile photo with initials fallback */}
        {photoUri && !photoError ? (
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={photoUri}
              alt={displayName}
              fill
              className="object-cover"
              onError={() => setPhotoError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${color}`}
          >
            {initials || "?"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#1F4D3D] sm:text-[14px]">
            {displayName}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            {/* Clock icon */}
            <svg
              className="size-3 shrink-0 text-[#cfb072]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="truncate text-[11px] font-medium text-[#8a9a94] sm:text-[12px]">
              {review.relativePublishTimeDescription}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function GoogleReviewsSection() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useGoogleReviews();

  const reviews = data?.reviews ?? [];
  const overallRating = data?.rating ?? 0;
  const totalCount = data?.userRatingCount ?? 0;
  const mapsUri = data?.googleMapsUri ?? "https://maps.google.com";

  return (
    <section className="bg-[#f7f5f2] px-5 py-14 font-[var(--font-poppins)] sm:px-8 sm:py-20 lg:px-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto flex max-w-[730px] flex-col items-center gap-2 text-center lg:gap-5"
        >
          <p className="text-[14px] font-medium uppercase tracking-[0.36em] text-[#d59e52] lg:text-[18px]">
            {t("home.reviews.eyebrow")}
          </p>
          <h2 className="max-w-[480px] text-[20px] font-medium leading-normal tracking-[-0.02em] text-[#2e6f57] lg:max-w-none lg:text-[36px]">
            {t("home.reviews.title")}
          </h2>
          <div className="h-[7px] w-[170px] rounded-[3px] bg-[#cfb072]" />
          <p className="max-w-[480px] text-[14px] leading-relaxed text-[#5a6b64] lg:text-[16px]">
            {t("home.reviews.body")}
          </p>

          {/* Overall Google rating badge */}
          {!isLoading && !isError && overallRating > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-[#e8e4dc] bg-white px-4 py-2 shadow-sm">
              <GoogleLogo className="size-5 shrink-0" />
              <div className="flex items-center gap-1">
                <svg
                  className="size-4 text-[#cfb072]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-[13px] font-bold text-[#1F4D3D]">
                  {overallRating.toFixed(1)}
                </span>
              </div>
              <span className="text-[12px] text-[#8a9a94]">
                {t("home.reviews.googleBadge", { count: totalCount.toLocaleString() })}
              </span>
            </div>
          )}
        </motion.div>

        {/* Cards */}
        <div className="mt-12 lg:mt-14">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12 text-[14px] text-[#8a9a94]">
              {t("home.reviews.failed")}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#d9d3c9] bg-white py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#f7f5f2]">
                <GoogleLogo className="size-8" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1F4D3D]">
                  {t("home.reviews.emptyTitle")}
                </p>
                <p className="mt-1 text-[13px] text-[#8a9a94]">
                  {t("home.reviews.emptyBody")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <GoogleReviewCard key={review.name} review={review} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Footer bar: summary + "Read all on Google" CTA */}
        {!isLoading && !isError && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6"
          >
            {/* Rating pill */}
            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm">
              <svg
                className="size-4 text-[#cfb072]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-[13px] font-semibold text-[#1F4D3D]">
                {t("home.reviews.averageRating", { rating: overallRating.toFixed(1) })}
              </span>
            </div>

            {/* Count pill */}
            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm">
              <GoogleLogo className="size-4 shrink-0" />
              <span className="text-[13px] font-semibold text-[#1F4D3D]">
                {t("home.reviews.googleBadge", { count: totalCount.toLocaleString() })}
              </span>
            </div>

            {/* "Read all on Google" link */}
            <a
              href={mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#cfb072] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1F4D3D] shadow-sm transition-colors hover:bg-[#cfb072] hover:text-white"
            >
              <GoogleLogo className="size-4 shrink-0" />
              {t("home.reviews.readAll")}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

