"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { usePublicBuyProperties } from "@/lib/hooks/usePropertyBuying";
import { slugify } from "@/lib/utils/slugify";
import { API_BASE_URL } from "@/lib/api/config";
import { formatCurrency } from "@/lib/utils/currency";
import { useI18n } from "./I18nProvider";
import type { PropertyBuyingListItem } from "@/lib/types/propertyBuying";

export default function BuyPropertiesPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2e6f57] border-t-transparent" />
        </div>
      }
    >
      <BuyPropertiesPageInner />
    </Suspense>
  );
}

function BuyPropertiesPageInner() {
  const { href } = useI18n();
  const { data, isLoading, isError } = usePublicBuyProperties({ pageSize: 100 });

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-[#fdecea]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b00020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-[20px] font-semibold text-[#183c2f]">Unable to load properties</h2>
        <p className="max-w-[360px] text-[14px] text-[#656566]">
          We couldn't fetch the listings right now. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-full bg-[#2e6f57] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#255f49] active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = data?.items ?? [];

  // Featured first
  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)),
    [items]
  );

  return (
    <main className="bg-[#fafafa] font-[var(--font-poppins)] text-[#183c2f]">
      <BuyPropertiesHero />
      {/* Listing */}
      <div className="mx-auto max-w-[1536px] px-4 pb-20 pt-8 sm:px-6 lg:px-10">
        <div className="mb-6">
          <h2 className="text-[22px] font-semibold text-[#183c2f] lg:text-[32px]">
            Available Properties
          </h2>
          {!isLoading && (
            <p className="mt-1 text-[13px] text-[#656566]">
              {sorted.length} {sorted.length === 1 ? "property" : "properties"} found
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2e6f57] border-t-transparent" />
            <p className="text-[14px] text-[#656566]">Loading properties...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[18px] font-semibold text-[#183c2f]">No properties found</p>
            <p className="mt-2 text-[14px] text-[#656566]">
              Check back soon for new listings.
            </p>
          </div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {sorted.map((property) => (
              <BuyPropertyCard
                key={property.id}
                property={property}
                url={href(`/buy/${slugify(property.title)}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

function BuyPropertyCard({
  property,
  url,
}: {
  property: PropertyBuyingListItem;
  url: string;
}) {
  const image = property.coverImageUrl
    ? `${API_BASE_URL}/${property.coverImageUrl}`
    : "/rent/property-card.png";

  const location = [property.address?.area, property.address?.city]
    .filter(Boolean)
    .join(", ");

  const statusLabel =
    property.status === 1
      ? "Available"
      : property.status === 2
      ? "Reserved"
      : "Sold";

  const statusColor =
    property.status === 1
      ? "bg-[#e6f4ee] text-[#2e6f57]"
      : property.status === 2
      ? "bg-[#fff7e6] text-[#b07a00]"
      : "bg-[#fdecea] text-[#b00020]";

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_2px_12px_rgba(31,77,61,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(31,77,61,0.13)]"
    >
      {/* Image */}
      <Link href={url} className="block aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
        <Image
          src={image}
          alt={property.title}
          width={480}
          height={360}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Badges */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {property.isFeatured && (
          <span className="rounded-full bg-[#d9a441] px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
            Featured
          </span>
        )}
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 lg:p-5">
        <Link href={url}>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.4] text-[#183c2f] transition group-hover:text-[#2e6f57] lg:text-[16px]">
            {property.title}
          </h3>
        </Link>

        {location && (
          <p className="mt-1.5 flex items-center gap-1 text-[12px] text-[#656566]">
            <Image
              src="/homepage/properties/icons/location.svg"
              alt=""
              width={14}
              height={14}
              className="shrink-0"
            />
            <span className="truncate">{location}</span>
          </p>
        )}

        {/* Specs */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#656566]">
          <span className="flex items-center gap-1">
            <Image src="/homepage/properties/icons/bed.svg" alt="" width={14} height={14} />
            {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </span>
          <span className="flex items-center gap-1">
            <Image src="/homepage/properties/icons/bath.svg" alt="" width={14} height={14} />
            {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </span>
          <span className="flex items-center gap-1">
            <Image src="/homepage/properties/icons/size.svg" alt="" width={14} height={14} />
            {property.area} m²
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-[18px] font-bold text-[#183c2f] lg:text-[20px]">
            {formatCurrency(property.price, property.currency)}
          </p>
          <Link
            href={url}
            className="rounded-full bg-[#2e6f57] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#255f49] active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function BuyPropertiesHero() {
  return (
    <section className="relative flex h-[200px] w-full items-center overflow-hidden bg-[#2e6f57] lg:h-[280px]">
      <Image
        src="/rent/hero-texture.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover opacity-20 mix-blend-plus-lighter"
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-none absolute bottom-0 right-[6%] z-0 h-[85%] w-[45%] opacity-45 sm:right-[8%] sm:h-[95%] sm:w-[40%] lg:right-[5%] lg:h-[110%] lg:w-[35%] lg:opacity-100 xl:right-[9%] xl:w-[32%]"
      >
        <Image
          src="/rent/hero-house.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 32vw, (min-width: 1024px) 35vw, 45vw"
          className="object-contain object-bottom"
        />
      </motion.div>
      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-5 lg:px-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[280px] sm:max-w-xl lg:max-w-xl"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[24px] font-bold leading-[1.2] text-white sm:text-3xl lg:text-[44px]"
          >
            Properties for Sale
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 text-[12px] leading-[1.6] text-white/90 sm:text-sm lg:mt-4 lg:text-[16px]"
          >
            Find your perfect home in Hurghada
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
