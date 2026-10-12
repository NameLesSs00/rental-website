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
    title: "Privacy Policy | Hurghada Vacation Homes",
    description:
      "Learn how Hurghada Vacation Homes collects, protects, and handles your personal information for apartment reservations, resort security, and guest services.",
    alternates: {
      canonical: `/${locale}/privacy-policy`,
    },
    openGraph: {
      title: `Privacy Policy | ${siteConfig.name}`,
      description:
        "Learn how Hurghada Vacation Homes collects, protects, and handles your personal information for apartment reservations, resort security, and guest services.",
      url: `/${locale}/privacy-policy`,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
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
              <span className="font-semibold text-[#183c2f]">Privacy Policy</span>
            </nav>

            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#cfb072]">
              Guest Information & Legal
            </p>
            <h1 className="mt-3 max-w-[720px] text-[34px] font-semibold leading-[1.12] text-[#183c2f] sm:text-[44px] lg:text-[54px]">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#5d6965] lg:text-[18px] lg:leading-8">
              At Hurghada Vacation Homes, we respect your privacy and are committed to safeguarding your personal data.
              This policy explains how we collect, use, and protect guest information in connection with our self-catering
              rental apartments, house rules compliance, and hospitality services.
            </p>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#dfe8e4] shadow-[0_22px_50px_rgba(31,77,61,0.12)] sm:min-h-[320px] lg:min-h-[380px]">
            <Image
              src="/rent/hero-house.png"
              alt="Hurghada Vacation Homes guest apartment"
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
                <Image src="/billing/icons/info.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">1. Information We Collect</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Booking Details:</strong> Full name, email address, phone number, and number of guests for reservation confirmations.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Identity Verification:</strong> Passport or national ID copies required upon arrival to comply with Egyptian Tourism Authority rules and resort gate access.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Payment Records:</strong> Transaction IDs and payment confirmation timestamps. We do not store raw credit card numbers.</span>
                </li>
              </ul>
            </article>

            {/* Card 2 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/shield.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">2. How We Use Your Data</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Reservation Management:</strong> Scheduling check-in (from 2:00 PM), check-out (before 12:00 PM), and key handovers.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Guest Communication:</strong> Providing arrival instructions, apartment access codes, and assistance during your stay.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Additional Services:</strong> Arranging optional airport transfers, on-demand laundry, or extra apartment cleaning upon request.</span>
                </li>
              </ul>
            </article>

            {/* Card 3 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/about/icons/check-circle.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">3. House Rules & Security</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                In accordance with our property house rules, only registered guests are permitted inside the apartments.
                Guest identification records ensure compliance with resort safety protocols, prevent unauthorized visitors
                or parties, and guarantee a peaceful community environment for all neighbors.
              </p>
            </article>

            {/* Card 4 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/calendar.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">4. Data Retention & Sharing</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                We retain booking information only for as long as necessary to complete your stay and satisfy local legal
                or tax obligations. We never sell or rent your personal information to third parties. Data is shared exclusively
                with secure payment processors (e.g. PayPal) and official resort compound security.
              </p>
            </article>
          </div>

          {/* ─── Highlights Notice ────────────────────────────────────── */}
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)]">
            <section className="rounded-xl border border-[#dfe8e4] bg-[#f8faf9] p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold text-[#183c2f]">Your Rights & Choices</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                You have the right to review, update, or request the deletion of your personal records following your departure,
                provided all outstanding balances and property inspections are settled. To request data updates or ask any questions
                regarding our privacy practices, please contact our local hosting team directly.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-[#2e6f57] font-medium">
                <Link href={`/${locale}/house-rules`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> View House Rules
                </Link>
                <Link href={`/${locale}/cancellation-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Cancellation Policy
                </Link>
                <Link href={`/${locale}/refund-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Refund Policy
                </Link>
              </div>
            </section>

            <aside className="rounded-xl border border-[#d8bf82] bg-[#fffaf0] p-6 sm:p-8">
              <h2 className="text-[18px] font-semibold text-[#183c2f]">Privacy Support</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Have questions or need assistance with your personal information or resort check-in requirements?
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
