"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPathLocale, defaultLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import I18nProvider, { useI18n } from "@/components/I18nProvider";
import AppChrome from "@/components/AppChrome";

function NotFoundContent() {
  const { t, href } = useI18n();

  return (
    <main className="grid min-h-[70vh] place-items-center bg-white px-5 py-16 font-[var(--font-poppins)]">
      <section className="max-w-[620px] text-center">
        <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#d9a441]">404</p>
        <h1 className="mt-4 text-[36px] font-semibold leading-tight text-[#183c2f] lg:text-[52px]">
          {t("notFound.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-7 text-[#667c74]">
          {t("notFound.body")}
        </p>
        <Link
          href={href("/")}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#2e6f57] px-8 text-[16px] font-semibold text-white transition hover:bg-[#255f49]"
        >
          {t("common.backToHome")}
        </Link>
      </section>
    </main>
  );
}

export default function NotFound() {
  const pathname = usePathname();
  const locale = getPathLocale(pathname || "") || defaultLocale;
  const messages = getMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <AppChrome>
        <NotFoundContent />
      </AppChrome>
    </I18nProvider>
  );
}
