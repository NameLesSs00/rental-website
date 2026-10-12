"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useCurrencies } from "@/lib/hooks/useCurrency";
import {
  saveSelectedCurrency,
  useSelectedCurrency,
  DEFAULT_CURRENCY,
} from "@/lib/hooks/useSelectedCurrency";
import { useI18n } from "./I18nProvider";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

type CurrencySwitcherProps = {
  variant?: "desktop" | "mobile";
  onCloseMenu?: () => void;
  className?: string;
};

const DEFAULT_FALLBACK_CURRENCIES = [
  { id: "USD", code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1 },
  { id: "EUR", code: "EUR", name: "Euro", symbol: "€", exchangeRate: 1 },
  { id: "GBP", code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 1 },
  { id: "EGP", code: "EGP", name: "Egyptian Pound", symbol: "E£", exchangeRate: 1 },
];

export default function CurrencySwitcher({
  variant = "desktop",
  onCloseMenu,
  className = "",
}: CurrencySwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [selectedCurrency, setSelectedCurrency] = useSelectedCurrency();
  const { data: currencies = [] } = useCurrencies({ isActive: true });
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableCurrencies =
    currencies.length > 0
      ? currencies
      : DEFAULT_FALLBACK_CURRENCIES;

  const activeCode = mounted
    ? (selectedCurrency || DEFAULT_CURRENCY).toUpperCase()
    : DEFAULT_CURRENCY;

  const currentCurrency =
    availableCurrencies.find(
      (c) => c.code.toUpperCase() === activeCode
    ) || {
      id: activeCode,
      code: activeCode,
      symbol: "$",
      name: activeCode,
    };

  const handleSelect = (code: string) => {
    const normalized = saveSelectedCurrency(code);
    setSelectedCurrency(normalized);
    setIsOpen(false);

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const hasCurrencyParam =
        searchParams.has("Currency") || searchParams.has("currency");
      const currentPath = window.location.pathname;
      const isListingOrDetail =
        currentPath.includes("/rent") || currentPath.includes("/buy");

      if (hasCurrencyParam || isListingOrDetail) {
        searchParams.set("Currency", normalized);
        const newUrl = `${pathname}?${searchParams.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    }
  };

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

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (variant === "mobile") {
    return (
      <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-[#dfe8e4] bg-white px-3.5 text-[14px] font-semibold text-[#1F4D3D] shadow-[0_2px_8px_rgba(31,77,61,0.04)] transition hover:border-[#2e6f57]/35"
          aria-expanded={isMobileOpen}
          aria-label={t("common.currency")}
        >
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <span className="font-bold text-[#2e6f57]" suppressHydrationWarning>
              {currentCurrency.symbol || currentCurrency.code}
            </span>
            <span suppressHydrationWarning>{currentCurrency.code}</span>
            {currentCurrency.name && currentCurrency.name !== currentCurrency.code && (
              <span className="text-xs font-normal text-[#8a9a94]" suppressHydrationWarning>
                ({currentCurrency.name})
              </span>
            )}
          </div>
          <ChevronDown
            className={`size-4 text-[#667c74] transition-transform duration-200 ${
              isMobileOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: smoothEase }}
              className="mt-1.5 overflow-hidden rounded-xl border border-[#dfe8e4] bg-white p-1 shadow-[0_8px_20px_rgba(31,77,61,0.08)]"
            >
              {availableCurrencies.map((item) => {
                const isSelected =
                  item.code.toUpperCase() === (selectedCurrency || DEFAULT_CURRENCY).toUpperCase();

                return (
                  <button
                    key={item.id || item.code}
                    type="button"
                    onClick={() => {
                      handleSelect(item.code);
                      setIsMobileOpen(false);
                      onCloseMenu?.();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[14px] font-semibold transition ${
                      isSelected
                        ? "bg-[#f0f7f4] text-[#1F4D3D]"
                        : "text-[#5d6965] hover:bg-[#f5f7f6] hover:text-[#1F4D3D]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs font-bold text-[#2e6f57]">
                        {item.symbol || item.code}
                      </span>
                      <span>{item.code}</span>
                      {item.name && item.name !== item.code && (
                        <span className="text-xs font-normal text-[#8a9a94]">
                          ({item.name})
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="size-4 text-[#2e6f57]" aria-hidden="true" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={switcherRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 xl:h-11 min-w-[96px] xl:min-w-[108px] items-center justify-between gap-1.5 xl:gap-2.5 rounded-full border border-[#dfe8e4] bg-white px-2.5 xl:px-3.5 text-[13px] xl:text-[14px] font-semibold text-[#1F4D3D] shadow-[0_6px_16px_rgba(31,77,61,0.05)] transition hover:border-[#2e6f57]/35 hover:bg-[#f8faf9]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("common.currency")}
      >
        <span className="flex min-w-0 items-center gap-1.5" suppressHydrationWarning>
          <span className="font-bold text-[#2e6f57]" suppressHydrationWarning>
            {currentCurrency.symbol || currentCurrency.code}
          </span>
          <span className="truncate" suppressHydrationWarning>{currentCurrency.code}</span>
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
            className="absolute right-0 top-[calc(100%+10px)] z-[80] w-52 origin-top-right overflow-hidden rounded-xl border border-[#dfe8e4] bg-white p-1.5 shadow-[0_18px_42px_rgba(31,77,61,0.16)]"
          >
            {availableCurrencies.map((item) => {
              const isSelected =
                item.code.toUpperCase() === (selectedCurrency || DEFAULT_CURRENCY).toUpperCase();

              return (
                <motion.button
                  key={item.id || item.code}
                  type="button"
                  variants={dropdownItemMotion}
                  onClick={() => handleSelect(item.code)}
                  role="menuitem"
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[14px] font-semibold transition ${
                    isSelected
                      ? "bg-[#f0f7f4] text-[#1F4D3D]"
                      : "text-[#5d6965] hover:bg-[#f5f7f6] hover:text-[#1F4D3D]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs font-bold text-[#2e6f57]">
                      {item.symbol || item.code}
                    </span>
                    <span>{item.code}</span>
                    {item.name && item.name !== item.code && (
                      <span className="truncate text-xs font-normal text-[#8a9a94]">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="ml-2 size-4 shrink-0 text-[#2e6f57]" aria-hidden="true" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
