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
    title: "Refund Policy | Hurghada Vacation Homes",
    description:
      "Understand our refund criteria, damage inspection terms, and deposit return timelines for Hurghada Vacation Homes.",
    alternates: {
      canonical: `/${locale}/refund-policy`,
    },
    openGraph: {
      title: `Refund Policy | ${siteConfig.name}`,
      description:
        "Understand our refund criteria, damage inspection terms, and deposit return timelines for Hurghada Vacation Homes.",
      url: `/${locale}/refund-policy`,
    },
  };
}

export default async function RefundPolicyPage({ params }: Props) {
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
              <span className="font-semibold text-[#183c2f]">Refund Policy</span>
            </nav>

            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#cfb072]">
              Guest Financial Information
            </p>
            <h1 className="mt-3 max-w-[720px] text-[34px] font-semibold leading-[1.12] text-[#183c2f] sm:text-[44px] lg:text-[54px]">
              Refund Policy
            </h1>
            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#5d6965] lg:text-[18px] lg:leading-8">
              We strive to deliver transparent and honest hosting in Hurghada. This policy outlines when refunds are issued,
              how apartment inspections are conducted upon check-out, and the return timelines for processed payments.
            </p>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#dfe8e4] shadow-[0_22px_50px_rgba(31,77,61,0.12)] sm:min-h-[320px] lg:min-h-[380px]">
            <Image
              src="/rent/hero-house.png"
              alt="Hurghada Vacation Homes hospitality property"
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
                <Image src="/about/icons/check-circle.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">1. Eligible Refund Scenarios</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Timely Cancellations:</strong> Full or partial refunds issued in accordance with our Cancellation Policy timelines (14+ days for full refund, 7–13 days for 50%).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Uninhabitable Conditions:</strong> If a property experiences major plumbing, electrical, or structural failures that cannot be repaired promptly, guests are refunded in full.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Overpayments or Duplicate Charges:</strong> Reconciled immediately upon identification with the payment gateway.</span>
                </li>
              </ul>
            </article>

            {/* Card 2 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/shield.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">2. Check-out Property Inspection</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                During check-out (before 12:00 PM noon), our local team inspects the apartment to ensure compliance with
                House Rules. The following damages will result in deductions from the security deposit:
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Permanent stains on bed linens (e.g. from flower decorations or spilled oils).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Broken appliances, air conditioners, furniture, or fixtures.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Lost apartment keys or resort security gate passes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span>Deep cleaning costs required due to smoking indoors or trash neglect.</span>
                </li>
              </ul>
            </article>

            {/* Card 3 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/info.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">3. Non-Refundable Items</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Consumed Nights:</strong> Completed accommodation days and past dates are non-refundable.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Completed Paid Services:</strong> Rendered laundry services, executed airport transfers, and completed cleaning requests are non-refundable once delivered.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2e6f57] font-bold">•</span>
                  <span><strong>Rule Violations:</strong> Bookings terminated on-site due to unauthorized parties, illegal visitors, or pet violations do not qualify for any refund.</span>
                </li>
              </ul>
            </article>

            {/* Card 4 */}
            <article className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)]">
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/calendar.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">4. Processing Timeline & Methods</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Approved refunds are processed through the original payment method used during booking (PayPal account or bank
                card). Once initiated by our administrative team, funds typically appear in your account within 5 to 10
                business days, depending on your bank or payment provider&apos;s settlement schedule.
              </p>
            </article>
          </div>

          {/* ─── Highlights Notice ────────────────────────────────────── */}
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)]">
            <section className="rounded-xl border border-[#dfe8e4] bg-[#f8faf9] p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold text-[#183c2f]">Clear Communication Guarantee</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Should an accidental breakage or issue occur during your holiday, please notify our team immediately so we can
                resolve it together transparently and avoid surprises during check-out inspection.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-[#2e6f57] font-medium">
                <Link href={`/${locale}/cancellation-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Cancellation Policy
                </Link>
                <Link href={`/${locale}/house-rules`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> House Rules
                </Link>
                <Link href={`/${locale}/privacy-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> Privacy Policy
                </Link>
              </div>
            </section>

            <aside className="rounded-xl border border-[#d8bf82] bg-[#fffaf0] p-6 sm:p-8">
              <h2 className="text-[18px] font-semibold text-[#183c2f]">Questions About a Refund?</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">
                Contact our customer support team with your booking reference ID for immediate assistance.
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
