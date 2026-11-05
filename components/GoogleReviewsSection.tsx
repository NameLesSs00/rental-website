"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useGoogleReviews } from "@/lib/hooks/useGoogleReviews";
import { useI18n } from "@/components/I18nProvider";
import type { GoogleReview } from "@/lib/types/googleReview";

// ─── Helpers ────────────────────────────────────────────────────────────────

function StarRow({ rate }: { rate: number }) {
  const rounded = Math.min(5, Math.max(0, Math.round(rate)));
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`size-4 shrink-0 transition-colors ${
              i < rounded ? "text-[#f59e0b] drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]" : "text-[#e5e0d8]"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="rounded-md bg-[#fef7ee] px-1.5 py-0.5 text-[12px] font-bold text-[#b45309]">
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
    <div className="flex flex-col justify-between rounded-2xl border border-[#f0ede8] bg-white p-6 shadow-[0_4px_24px_rgba(31,77,61,0.06)] min-h-[290px]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="size-4 animate-pulse rounded-full bg-[#e8e4dc]" />
            ))}
          </div>
          <div className="size-5 animate-pulse rounded-full bg-[#e8e4dc]" />
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3.5 w-11/12 animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3.5 w-5/6 animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3.5 w-4/6 animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3.5 w-3/6 animate-pulse rounded bg-[#e8e4dc]" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3.5 border-t border-[#f0ede8] pt-4">
        <div className="size-12 animate-pulse rounded-full bg-[#e8e4dc]" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-[#e8e4dc]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#e8e4dc]" />
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-gradient-to-br from-[#1F4D3D] to-[#2e6f57]",
  "bg-gradient-to-br from-[#2e6f57] to-[#4a7c68]",
  "bg-gradient-to-br from-[#cfb072] to-[#b39556]",
  "bg-gradient-to-br from-[#8b6f3c] to-[#6d552c]",
  "bg-gradient-to-br from-[#4a7c68] to-[#1F4D3D]",
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
      className="group flex flex-col justify-between rounded-2xl border border-[#f0ede8] bg-white p-6 shadow-[0_4px_24px_rgba(31,77,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(31,77,61,0.12)] min-h-[290px]"
    >
      <div className="flex-1 flex flex-col">
        {/* Stars + Google logo */}
        <div className="flex items-center justify-between">
          <StarRow rate={review.rating} />
          <span
            className="flex items-center gap-1 rounded-full bg-[#f8f9fa] px-2 py-1 transition-transform group-hover:scale-105"
            title="Google Review"
          >
            <GoogleLogo className="size-4 shrink-0" />
            <span className="text-[11px] font-medium text-[#5f6368]">Google</span>
          </span>
        </div>

        {/* Comment */}
        <div className="relative mt-4 flex-1">
          <p className="line-clamp-6 text-[14px] leading-relaxed text-[#4b5563] italic">
            &ldquo;{reviewText}&rdquo;
          </p>
        </div>
      </div>

      <div>
        {/* Divider */}
        <div className="my-4 border-t border-[#f4f1eb]" />

        {/* Footer: enlarged 48px avatar + name + time */}
        <div className="flex items-center gap-3.5">
          {photoUri && !photoError ? (
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#e8e4dc] shadow-sm transition-transform group-hover:scale-105">
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
              className={`flex size-12 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white ring-2 ring-[#e8e4dc] shadow-sm ${color}`}
            >
              {initials || "?"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-[#1F4D3D]">
              {displayName}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <svg
                className="size-3 shrink-0 text-[#9ca3af]"
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
              <span className="truncate text-[12px] font-medium text-[#6b7280]">
                {review.relativePublishTimeDescription}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function GoogleReviewsSection() {
  const { t, locale } = useI18n();
  const { data, isLoading, isError } = useGoogleReviews(locale);

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
            <div className="mt-2 flex items-center gap-2.5 rounded-full border border-[#e8e4dc] bg-white px-4 py-2 shadow-sm">
              <GoogleLogo className="size-5 shrink-0" />
              <div className="flex items-center gap-1">
                <svg
                  className="size-4 text-[#f59e0b] fill-current"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[13px] font-bold text-[#1F4D3D]">
                  {overallRating.toFixed(1)}
                </span>
              </div>
              <span className="h-3 w-[1px] bg-[#e5e0d8]" />
              <span className="text-[12px] font-medium text-[#6b7280]">
                {t("home.reviews.googleBadge", { count: totalCount.toLocaleString() })}
              </span>
            </div>
          )}
        </motion.div>

        {/* 6 Cards Grid (3 cols x 2 rows on desktop) */}
        <div className="mt-12 lg:mt-14">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <GoogleReviewCard key={review.name || `${review.authorAttribution?.displayName}-${i}`} review={review} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Footer summary bar + CTA */}
        {!isLoading && !isError && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6"
          >
            {/* Rating pill */}
            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm border border-[#f0ede8]">
              <svg
                className="size-4 text-[#f59e0b] fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[13px] font-semibold text-[#1F4D3D]">
                {t("home.reviews.averageRating", { rating: overallRating.toFixed(1) })}
              </span>
            </div>

            {/* Total verified count pill */}
            <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm border border-[#f0ede8]">
              <GoogleLogo className="size-4 shrink-0" />
              <span className="text-[13px] font-semibold text-[#1F4D3D]">
                {t("home.reviews.googleBadge", { count: totalCount.toLocaleString() })}
              </span>
            </div>

            {/* "Read all on Google" CTA */}
            <a
              href={mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#cfb072] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1F4D3D] shadow-sm transition-all hover:bg-[#cfb072] hover:text-white"
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
