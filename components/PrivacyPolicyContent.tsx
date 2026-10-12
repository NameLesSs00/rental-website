"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { siteConfig } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: smoothEase,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

const cardGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

type Props = {
  locale: Locale;
  messages: Messages;
};

export default function PrivacyPolicyContent({ locale, messages }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const p = messages.privacyPolicy;

  const initialMotion = shouldReduceMotion ? false : "hidden";

  return (
    <main className="bg-white font-[var(--font-poppins)] text-[#183c2f]">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f5f7f6] px-5 py-10 sm:px-8 lg:px-20 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial={initialMotion}
          animate="visible"
          className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.8fr)] lg:items-center"
        >
          <div>
            <motion.nav
              variants={fadeUpVariants}
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] text-[#667c74] lg:text-[15px]"
            >
              <Link href={`/${locale}`} className="font-medium transition hover:text-[#2e6f57]">
                {messages.common.home}
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#183c2f]">{messages.common.privacyPolicy}</span>
            </motion.nav>

            <motion.p
              variants={fadeUpVariants}
              className="mt-8 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#cfb072]"
            >
              {p.eyebrow}
            </motion.p>
            <motion.h1
              variants={fadeUpVariants}
              className="mt-3 max-w-[720px] text-[34px] font-semibold leading-[1.12] text-[#183c2f] sm:text-[44px] lg:text-[54px]"
            >
              {p.title}
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#5d6965] lg:text-[18px] lg:leading-8"
            >
              {p.intro}
            </motion.p>
          </div>

          <motion.div
            variants={imageVariants}
            className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#dfe8e4] shadow-[0_22px_50px_rgba(31,77,61,0.12)] sm:min-h-[320px] lg:min-h-[380px]"
          >
            <Image
              src="/rent/hero-house.png"
              alt={p.heroAlt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Content Section ─────────────────────────────────────── */}
      <section className="px-5 py-12 sm:px-8 lg:px-20 lg:py-16">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            variants={cardGridVariants}
            initial={initialMotion}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Card 1 */}
            <motion.article
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.22 } }}
              className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)] transition-shadow hover:shadow-[0_16px_32px_rgba(31,77,61,0.08)]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/info.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">{p.card1Title}</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                {p.card1Items.map(([label, desc], index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#2e6f57] font-bold">•</span>
                    <span><strong>{label}</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            {/* Card 2 */}
            <motion.article
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.22 } }}
              className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)] transition-shadow hover:shadow-[0_16px_32px_rgba(31,77,61,0.08)]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/shield.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">{p.card2Title}</h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#5d6965]">
                {p.card2Items.map(([label, desc], index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#2e6f57] font-bold">•</span>
                    <span><strong>{label}</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            {/* Card 3 */}
            <motion.article
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.22 } }}
              className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)] transition-shadow hover:shadow-[0_16px_32px_rgba(31,77,61,0.08)]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/about/icons/check-circle.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">{p.card3Title}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">{p.card3Body}</p>
            </motion.article>

            {/* Card 4 */}
            <motion.article
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.22 } }}
              className="rounded-xl border border-[#dfe8e4] bg-white p-6 shadow-[0_8px_24px_rgba(31,77,61,0.04)] transition-shadow hover:shadow-[0_16px_32px_rgba(31,77,61,0.08)]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#f5f7f6]">
                <Image src="/billing/icons/calendar.svg" alt="" width={22} height={22} className="size-5 object-contain" />
              </div>
              <h2 className="text-[18px] font-semibold text-[#183c2f]">{p.card4Title}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">{p.card4Body}</p>
            </motion.article>
          </motion.div>

          {/* ─── Highlights Notice ────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial={initialMotion}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)]"
          >
            <motion.section
              variants={fadeUpVariants}
              className="rounded-xl border border-[#dfe8e4] bg-[#f8faf9] p-6 sm:p-8"
            >
              <h2 className="text-[20px] font-semibold text-[#183c2f]">{p.rightsTitle}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">{p.rightsBody}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-[#2e6f57] font-medium">
                <Link href={`/${locale}/house-rules`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> {messages.common.houseRules}
                </Link>
                <Link href={`/${locale}/cancellation-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> {messages.common.cancellationPolicy}
                </Link>
                <Link href={`/${locale}/refund-policy`} className="hover:underline flex items-center gap-1.5">
                  <span>→</span> {messages.common.refundPolicy}
                </Link>
              </div>
            </motion.section>

            <motion.aside
              variants={fadeUpVariants}
              className="rounded-xl border border-[#d8bf82] bg-[#fffaf0] p-6 sm:p-8"
            >
              <h2 className="text-[18px] font-semibold text-[#183c2f]">{p.supportTitle}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5d6965]">{p.supportBody}</p>
              <a
                href={`tel:${siteConfig.phone}`}
                dir="ltr"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#2e6f57] px-6 text-[14px] font-semibold text-white transition hover:bg-[#255f49] hover:shadow-md"
              >
                <bdi dir="ltr">{siteConfig.displayPhone}</bdi>
              </a>
            </motion.aside>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
