import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  return {
    title: "Cancellation Policy | Hurghada Vacation Homes",
    description:
      "Review the cancellation terms, booking modification rules, and house rule compliance conditions for Hurghada Vacation Homes rentals.",
    alternates: {
      canonical: `/${locale}/cancellation-policy`,
    },
    openGraph: {
      title: `Cancellation Policy | ${siteConfig.name}`,
      description:
        "Review the cancellation terms, booking modification rules, and house rule compliance conditions for Hurghada Vacation Homes rentals.",
      url: `/${locale}/cancellation-policy`,
    },
  };
}

export default async function CancellationPolicyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  return (
    <main className="bg-white font-[var(--font-poppins)] text-[#183c2f]">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5f7f6] px-5 py-10 sm:px-8 lg:px-20 lg:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.8fr)] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#667c74] lg:text-[15px]">
              <Link href={`/${locale}`} className="font-medium transition hover:text-[#2e6f57]">
                Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#183c2f]">Cancellation Policy</span>
            </nav>

            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#cfb072]">
              Booking Terms & Policies
            </p>
            <h1 className="mt-3 max-w-[720px] text-[34px] font-semibold leading-[1.12] text-[#183c2f] sm:text-[44px] lg:text-[54px]">
              Cancellation Policy
            </h1>
            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#5d6965] lg:text-[18px] lg:leading-8">
              We understand that holiday plans can change. Our cancellation terms are designed to balance flexibility for
              our guests with the scheduling commitments needed to prepare our self-catering holiday homes in Hurghada.
            </p>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#dfe8e4] shadow-[0_22px_50px_rgba(31,77,61,0.12)] sm:min-h-[320px] lg:min-h-[380px]">
            <Image
              src="/rent/hero-house.png"
              alt="Hurghada Vacation Homes rental property"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ─── Content Section ─────────────────────────────────────── */}
      <section className="px-5 py-12 sm:px-8 lg:px-20 lg:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/calendar.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">1. Standard Cancellation Windows</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>14+ Days Prior:</strong> Cancellations made at least 14 days before the scheduled check-in date (2:00 PM) are eligible for a full refund of the deposit paid.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>7 to 13 Days Prior:</strong> Cancellations made between 7 and 13 days prior are eligible for a 50% refund of the deposit.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Less than 7 Days / No-Show:</strong> Cancellations made within 7 days of arrival or failure to check in without notice are non-refundable.</span>
                </li>
              </ul>
            </article>

            {/* Card 2 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/shield.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">2. House Rules Violations</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Guests agree to respect our official House Rules upon booking. Immediate reservation cancellation without
                refund applies if a guest commits serious breaches during their stay, including:
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Hosting unauthorized visitors, parties, or social gatherings.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Bringing pets into the apartment without prior permission.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Smoking inside non-designated indoor areas.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Causing deliberate disturbance during night quiet hours.</span>
                </li>
              </ul>
            </article>

            {/* Card 3 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/about/icons/check-circle.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">3. Early Check-out & Departures</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Official check-out is before 12:00 PM noon on your departure date. If you decide to vacate the apartment
                earlier than your booked departure date, unused nights are non-refundable, as the apartment was reserved
                and held exclusively for your booking calendar.
              </p>
            </article>

            {/* Card 4 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/info.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">4. Booking Date Modifications</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Requests to adjust your arrival or departure dates can be accommodated free of charge when submitted at least
                7 days prior to check-in, subject to apartment availability and seasonal rate differences. Please reach out to
                our hosting team as early as possible to adjust dates.
              </p>
            </article>
          </div>

          {/* ─── Highlights Notice ────────────────────────────────────── */}
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)]">
            <section className="rounded-xl border border-[#dfe8e4] bg-[#f8faf9] p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold text-[#183c2f]">Host-Initiated Cancellations</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                In the rare event of an unforeseen maintenance issue or unforeseen circumstance rendering the property
                unfit for stay, our team will immediately offer you an upgraded alternative accommodation or issue a 100% full
                refund of all sums paid.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-[#2e6f57] font-medium">
                <Link href={`/${locale}/refund-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Read Refund Policy
                </Link>
                <Link href={`/${locale}/house-rules`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Review House Rules
                </Link>
                <Link href={`/${locale}/privacy-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Privacy Policy
                </Link>
              </div>
            </section>

            <aside className="rounded-xl border border-[#d8bf82] bg-[#fffaf0] p-6 sm:p-8">
              <h2 className="text-[18px] font-semibold text-[#183c2f]">Need to Cancel or Reschedule?</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Contact our local host care team with your booking number to process your cancellation or modification request.
              </p>
              <a
                href="tel:+201273613935"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#2e6f57] px-6 text-[14px] font-semibold text-white transition hover:bg-[#255f49]"
              >
                +20 127 361 3935
              </a>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
