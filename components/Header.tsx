"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useHeaderStore } from "../lib/headerStore";
import { localeFlags, localeLabels, locales, localizePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { API_BASE_URL } from "@/lib/api/config";
import { slugify } from "@/lib/utils/slugify";
import { useI18n } from "./I18nProvider";
import CurrencySwitcher from "./CurrencySwitcher";

type NavItem = {
  href?: string;
  label: string;
  subItems?: { href: string; label: string }[];
};

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const headerMotion: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
};
const headerInnerMotion: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};
const headerItemMotion: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: smoothEase },
  },
};
const dropdownMotion: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: smoothEase,
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.16, ease: smoothEase },
  },
};
const dropdownItemMotion: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: smoothEase },
  },
};
const mobileMenuMotion: Variants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: smoothEase,
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.3, ease: smoothEase },
  },
};

function subscribeToLocationChanges() {
  return () => {};
}

function getLocationSearchSnapshot() {
  return typeof window === "undefined" ? "" : window.location.search.replace(/^\?/, "");
}

export default function Header() {
  const { menuOpen, toggleMenu, closeMenu, pageEntityId, pageEntityType } = useHeaderStore();
  const pathname = usePathname();
  const publicPathname = stripLocale(pathname);
  const queryString = useSyncExternalStore(subscribeToLocationChanges, getLocationSearchSnapshot, () => "");
  const { t, href, locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const initialState = shouldReduceMotion ? false : "hidden";
  const navItems: NavItem[] = [
    { href: "/", label: t("nav.items.home") },
    { href: "/rent", label: t("nav.items.rent") },
    // ========================================
    // TEMPORARILY HIDDEN: Buy Properties Link
    // ========================================
    // To re-enable: Uncomment the line below AND remove the middleware blocking rules in proxy.ts
    // { href: "/buy", label: t("nav.items.buy") },
    // ========================================
    // TEMPORARILY HIDDEN: Transfer Link
    // ========================================
    // To re-enable: Uncomment the line below AND remove the middleware blocking rules in proxy.ts
    // { href: "/transfer", label: t("nav.items.transfer") },
    // ========================================
    { href: "/about", label: t("nav.items.about") },
    { href: "/contact", label: t("nav.items.contact") },
  ];

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        variants={headerMotion}
        initial={initialState}
        animate="visible"
        className="sticky top-0 z-[60] w-full bg-white font-[var(--font-poppins)] shadow-[0_2px_2px_rgba(0,0,0,0.15)] lg:shadow-none"
      >
      <motion.div
        variants={headerInnerMotion}
        className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between px-5 sm:h-[84px] sm:px-8 lg:h-[96px] xl:h-[104px] lg:px-6 xl:px-0"
      >
        <motion.div
          variants={headerItemMotion}
          className="shrink-0"
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        >
          <Link href={href("/")} className="flex shrink-0 items-center" aria-label={t("nav.homeAria")}>
            <Image
              src="/logo-green.png"
              alt="Logo"
              width={180}
              height={180}
              priority
              unoptimized
              className="h-[54px] w-auto object-contain sm:h-[62px] lg:h-[72px] xl:h-[80px]"
            />
          </Link>
        </motion.div>

        <motion.nav
          variants={headerInnerMotion}
          className="hidden flex-1 items-center justify-center gap-1 xl:gap-2.5 text-[14px] lg:text-[15px] xl:text-[17px] 2xl:text-[18px] font-medium text-[#12382e] lg:flex"
        >
          {navItems.map((item) => {
            if (item.subItems) {
              const isActive = item.subItems.some(sub => publicPathname === sub.href || publicPathname.startsWith(`${sub.href}/`));
              const isOpen = openDropdown === item.label;

              return (
                <motion.div
                  key={item.label}
                  variants={headerItemMotion}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="relative flex h-[92px] xl:h-[104px] cursor-pointer items-center"
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    className={`relative flex h-full items-center whitespace-nowrap px-2 xl:px-3 transition-colors hover:text-[#2f7b61] ${
                      isActive ? "text-[#2f7b61]" : ""
                    }`}
                  >
                    {item.label}
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="ml-1.5 size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                    {isActive && (
                      <motion.span
                        layoutId="public-header-active-underline"
                        className="absolute bottom-[20px] xl:bottom-[29px] left-1/2 h-[3px] w-3/4 max-w-[70px] xl:max-w-[88px] -translate-x-1/2 rounded-full bg-[#1F4D3D]"
                        transition={{ duration: 0.28, ease: smoothEase }}
                      />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={dropdownMotion}
                        initial={initialState}
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 top-[80px] xl:top-[90px] flex w-48 origin-top flex-col overflow-hidden rounded-xl border border-[#1F4D3D]/10 bg-white shadow-[0_12px_24px_rgba(31,77,61,0.08)]"
                      >
                        {item.subItems.map((sub) => (
                          <motion.div key={sub.href} variants={dropdownItemMotion}>
                            <Link
                              href={href(sub.href)}
                              className="block px-5 py-3 text-[15px] text-[#12382e] transition hover:bg-[#f4faf7] hover:text-[#2f7b61]"
                            >
                              {sub.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }

            const isActive = publicPathname === item.href || (item.href !== "/" && publicPathname.startsWith(`${item.href}/`));

            return (
              <motion.div
                key={item.label}
                variants={headerItemMotion}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              >
                <Link
                  href={href(item.href!)}
                  className={`relative flex h-[92px] xl:h-[104px] items-center whitespace-nowrap px-2 xl:px-3 transition-colors hover:text-[#2f7b61] ${
                    isActive ? "text-[#2f7b61]" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="public-header-active-underline"
                      className="absolute bottom-[20px] xl:bottom-[29px] left-1/2 h-[3px] w-3/4 max-w-[70px] xl:max-w-[88px] -translate-x-1/2 rounded-full bg-[#1F4D3D]"
                      transition={{ duration: 0.28, ease: smoothEase }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        <motion.div variants={headerItemMotion} className="hidden shrink-0 items-center gap-2 xl:gap-2.5 justify-end lg:flex">
          <CurrencySwitcher />
          <LanguageSwitcher locale={locale} publicPathname={publicPathname} queryString={queryString} />
        </motion.div>

        <motion.button
          variants={headerItemMotion}
          type="button"
          aria-label={t("common.toggleNavigation")}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          whileTap={{ scale: 0.92 }}
          className="flex h-8 w-8 items-center justify-end text-[#1F4D3D] transition hover:text-[#2f7b61] lg:hidden"
        >
          <span className="relative block h-[14px] w-[14px]" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-[14px] rounded-full bg-current transition ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] h-0.5 w-[14px] rounded-full bg-current transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-[14px] rounded-full bg-current transition ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </motion.button>
      </motion.div>
    </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuMotion}
            initial={initialState}
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
          >
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#1F4D3D]/10 px-5 sm:h-[84px] sm:px-8">
              <Link href={href("/")} className="flex shrink-0 items-center" onClick={closeMenu}>
                <Image
                  src="/logo-green.png"
                  alt="Logo"
                  width={180}
                  height={180}
                  priority
                  unoptimized
                  className="h-[54px] w-auto object-contain sm:h-[62px]"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="flex h-8 w-8 items-center justify-end text-[#1F4D3D] transition hover:text-[#2f7b61]"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mx-auto grid w-full max-w-[1280px] flex-1 content-start gap-1 overflow-y-auto px-6 py-5 sm:px-10">
              {navItems.map((item) => {
                if (item.subItems) {
                  return (
                    <motion.div key={item.label} variants={dropdownItemMotion} className="flex flex-col">
                      <div className="px-2 py-3 text-base font-semibold text-[#1F4D3D]">
                        {item.label}
                      </div>
                      <div className="ml-4 flex flex-col border-l-2 border-[#1F4D3D]/10 pl-2">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={href(sub.href)}
                            onClick={closeMenu}
                            className="rounded-md px-2 py-2 text-[15px] font-medium text-[#1F4D3D] transition hover:bg-[#f4faf7]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={item.label} variants={dropdownItemMotion} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={href(item.href!)}
                      onClick={closeMenu}
                      className="block rounded-md px-2 py-3 text-base font-semibold text-[#1F4D3D] transition hover:bg-[#f4faf7]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={dropdownItemMotion} className="mt-4 space-y-3 border-t border-[#1F4D3D]/10 pt-4">
                <div>
                  <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a9a94]">
                    {t("common.language")}
                  </p>
                  <MobileLanguageSwitcher
                    locale={locale}
                    publicPathname={publicPathname}
                    queryString={queryString}
                    onCloseMenu={closeMenu}
                  />
                </div>
                <div>
                  <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a9a94]">
                    {t("common.currency")}
                  </p>
                  <CurrencySwitcher variant="mobile" onCloseMenu={closeMenu} />
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function buildLocalizedPath(pathname: string, targetLocale: Locale, queryString?: string) {
  const suffix = queryString ? `?${queryString}` : "";
  return localizePath(`${pathname}${suffix}`, targetLocale);
}

function buildLocalizedEntityPath({
  targetLocale,
  entityType,
  entityId,
  translatedSlug,
  fallbackPathname,
  queryString,
}: {
  targetLocale: Locale;
  entityType: "rent" | "buy" | "transfer" | "blogs";
  entityId: string;
  translatedSlug: string;
  fallbackPathname: string;
  queryString?: string;
}) {
  const params = new URLSearchParams(queryString || "");
  if (entityType === "rent" || entityType === "buy") {
    params.set("id", entityId);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const path = translatedSlug ? `/${entityType}/${translatedSlug}${suffix}` : `${fallbackPathname}${suffix}`;
  return localizePath(path, targetLocale);
}

function LanguageSwitcher({
  locale,
  publicPathname,
  queryString,
}: {
  locale: Locale;
  publicPathname: string;
  queryString: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const selectedLabel = localeLabels[locale];
  const { pageEntityId, pageEntityType } = useHeaderStore();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={switcherRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 xl:h-11 min-w-[134px] xl:min-w-[156px] items-center justify-between gap-2 xl:gap-3 rounded-full border border-[#dfe8e4] bg-white px-2.5 xl:px-3 text-[13px] xl:text-[14px] font-semibold text-[#1F4D3D] shadow-[0_6px_16px_rgba(31,77,61,0.05)] transition hover:border-[#2e6f57]/35 hover:bg-[#f8faf9]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Image
            src={localeFlags[locale].src}
            alt={localeFlags[locale].alt}
            width={22}
            height={16}
            className="h-4 w-[22px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(31,77,61,0.12)]"
          />
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#667c74] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            className="absolute right-0 top-[calc(100%+10px)] z-[80] w-56 origin-top-right overflow-hidden rounded-xl border border-[#dfe8e4] bg-white p-1.5 shadow-[0_18px_42px_rgba(31,77,61,0.16)]"
          >
            {locales.map((item) => {
              const isSelected = item === locale;

              return (
                <motion.div key={item} variants={dropdownItemMotion}>
                  <Link
                    href={
                      pageEntityId && pageEntityType
                        ? buildLocalizedEntityPath({
                            targetLocale: item,
                            entityType: pageEntityType,
                            entityId: pageEntityId,
                            translatedSlug: "",
                            fallbackPathname: publicPathname,
                            queryString,
                          })
                        : buildLocalizedPath(publicPathname, item, queryString)
                    }
                    role="menuitem"
                    onClick={async (e) => {
                      if (pageEntityId && pageEntityType) {
                        e.preventDefault();
                        setIsOpen(false);
                        const currentQueryString = getLocationSearchSnapshot();
                        
                        try {
                          let endpoint = "";
                          if (pageEntityType === "rent") endpoint = `/api/properties/${pageEntityId}`;
                          else if (pageEntityType === "buy") endpoint = `/api/public/property-buyings/${pageEntityId}`;
                          else if (pageEntityType === "transfer") endpoint = `/api/journeys/${pageEntityId}`;
                          else if (pageEntityType === "blogs") endpoint = `/api/blogs/${pageEntityId}`;

                          const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                            headers: { "Accept-Language": item, "X-Locale": item },
                          });

                          if (res.ok) {
                            const json = await res.json();
                            const data = json.data;
                            let translatedSlug = "";
                            if (pageEntityType === "rent") translatedSlug = slugify(data.name || "");
                            else if (pageEntityType === "buy") translatedSlug = slugify(data.title || "");
                            else if (pageEntityType === "transfer") translatedSlug = slugify(data.name || "");
                            else if (pageEntityType === "blogs") translatedSlug = slugify(data.title || "");

                            if (translatedSlug) {
                              window.location.href = buildLocalizedEntityPath({
                                targetLocale: item,
                                entityType: pageEntityType,
                                entityId: pageEntityId,
                                translatedSlug,
                                fallbackPathname: publicPathname,
                                queryString: currentQueryString,
                              });
                              return;
                            }
                          }
                        } catch (err) {
                          console.error("Failed to localize url slug:", err);
                        }
                        
                        // Fallback if fetch fails
                        window.location.href = buildLocalizedEntityPath({
                          targetLocale: item,
                          entityType: pageEntityType,
                          entityId: pageEntityId,
                          translatedSlug: "",
                          fallbackPathname: publicPathname,
                          queryString: currentQueryString,
                        });
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-semibold transition ${
                      isSelected
                        ? "bg-[#f0f7f4] text-[#1F4D3D]"
                        : "text-[#5d6965] hover:bg-[#f8faf9] hover:text-[#1F4D3D]"
                    }`}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <Image
                      src={localeFlags[item].src}
                      alt={localeFlags[item].alt}
                      width={24}
                      height={18}
                      className="h-[18px] w-6 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(31,77,61,0.12)]"
                    />
                    <span className="min-w-0 flex-1 truncate">{localeLabels[item]}</span>
                    {isSelected && <Check className="size-4 text-[#2e6f57]" aria-hidden="true" />}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLanguageSwitcher({
  locale,
  publicPathname,
  queryString,
  onCloseMenu,
}: {
  locale: Locale;
  publicPathname: string;
  queryString: string;
  onCloseMenu: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = localeLabels[locale];
  const { pageEntityId, pageEntityType } = useHeaderStore();

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] font-semibold text-[#1F4D3D] shadow-[0_2px_8px_rgba(31,77,61,0.04)] transition hover:border-[#2e6f57]/35"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <Image
            src={localeFlags[locale].src}
            alt={localeFlags[locale].alt}
            width={22}
            height={16}
            className="h-4 w-[22px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(31,77,61,0.12)]"
          />
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown
          className={`size-4 text-[#667c74] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: smoothEase }}
            className="mt-1.5 overflow-hidden rounded-xl border border-[#dfe8e4] bg-white p-1 shadow-[0_8px_20px_rgba(31,77,61,0.08)]"
          >
            {locales.map((item) => {
              const isSelected = item === locale;

              return (
                <Link
                  key={item}
                  href={
                    pageEntityId && pageEntityType
                      ? buildLocalizedEntityPath({
                          targetLocale: item,
                          entityType: pageEntityType,
                          entityId: pageEntityId,
                          translatedSlug: "",
                          fallbackPathname: publicPathname,
                          queryString,
                        })
                      : buildLocalizedPath(publicPathname, item, queryString)
                  }
                  onClick={(event) => {
                    setIsOpen(false);
                    if (!pageEntityId || !pageEntityType) {
                      onCloseMenu();
                      return;
                    }
                    event.preventDefault();
                    onCloseMenu();
                    window.location.href = buildLocalizedEntityPath({
                      targetLocale: item,
                      entityType: pageEntityType,
                      entityId: pageEntityId,
                      translatedSlug: "",
                      fallbackPathname: publicPathname,
                      queryString: getLocationSearchSnapshot(),
                    });
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[14px] font-semibold transition ${
                    isSelected
                      ? "bg-[#f0f7f4] text-[#1F4D3D]"
                      : "text-[#5d6965] hover:bg-[#f5f7f6] hover:text-[#1F4D3D]"
                  }`}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={localeFlags[item].src}
                      alt={localeFlags[item].alt}
                      width={22}
                      height={16}
                      className="h-4 w-[22px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(31,77,61,0.12)]"
                    />
                    <span>{localeLabels[item]}</span>
                  </div>
                  {isSelected && <Check className="size-4 text-[#2e6f57]" aria-hidden="true" />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
