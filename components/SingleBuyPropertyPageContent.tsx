"use client";

import Image from "next/image";
import Link from "next/link";
import PropertyImageGallery from "./PropertyImageGallery";
import ScrollAnimation from "./ScrollAnimation";
import ContactForm from "./ContactForm";
import DynamicAmenityIcon from "./DynamicAmenityIcon";
import { usePublicPropertyBuyingById } from "@/lib/hooks/usePropertyBuying";
import { usePropertyBuyingCategories } from "@/lib/hooks/usePropertyBuyingCategory";
import { API_BASE_URL } from "@/lib/api/config";
import type { PropertyBuying, PropertyBuyingSection } from "@/lib/types/propertyBuying";
import type { PropertyBuyingCategory } from "@/lib/types/propertyBuyingCategory";
import { formatCurrency } from "@/lib/utils/currency";
import { useI18n } from "./I18nProvider";
import { useHeaderStore } from "@/lib/headerStore";
import { useEffect } from "react";


type QuickFact = {
  label: string;
  icon: string;
};

type DetailRow = [string, string];

export default function SingleBuyPropertyPageContent({ id }: { id: string }) {
  const { locale, t } = useI18n();
  const { data: property, isLoading } = usePublicPropertyBuyingById(id, locale);
  const { data: categories = [] } = usePropertyBuyingCategories(locale);
  const setPageEntity = useHeaderStore((state) => state.setPageEntity);

  useEffect(() => {
    setPageEntity(id, "buy");
    return () => setPageEntity(null, null);
  }, [id, setPageEntity]);

  if (isLoading) return <div className="p-20 text-center">{t("buy.loadingProperty")}</div>;
  if (!property) return <div className="p-20 text-center">{t("buy.notFound")}</div>;

  const galleryImages = (property.images || []).sort((a,b)=>a.displayOrder - b.displayOrder).map((img) => ({ src: `${API_BASE_URL}/${img.imageUrl}`, alt: property.title }));
  if (galleryImages.length === 0) galleryImages.push({ src: "/rent/property-card.png", alt: property.title });
  
  const quickFacts = [
    { label: `${property.area || 0} m²`, icon: "/homepage/properties/icons/size.svg" },
    { label: `${property.bedrooms || 0} ${Number(property.bedrooms || 0) === 1 ? t("buy.bedroom") : t("buy.bedrooms")}`, icon: "/homepage/properties/icons/bed.svg" },
    { label: `${property.bathrooms || 0} ${Number(property.bathrooms || 0) === 1 ? t("buy.bathroom") : t("buy.bathrooms")}`, icon: "/homepage/properties/icons/bath.svg" },
  ];

  const priceDetails: DetailRow[] = [
    [t("buy.price"), formatCurrency(property.price, property.currency)],
    [t("buy.status"), property.status === 1 ? t("buy.statuses.available") : property.status === 2 ? t("buy.statuses.reserved") : t("buy.statuses.sold")],
  ];

  const locationDetails: DetailRow[] = [
    [t("buy.city"), property.address?.city || t("buy.unknown")],
    [t("buy.area"), property.address?.area || t("buy.unknown")],
    [t("buy.street"), property.address?.street || t("buy.unknown")],
  ];

  return (
    <main className="overflow-hidden bg-white font-[var(--font-poppins)] text-[#183c2f]">
      <section className="px-5 pb-12 pt-6 lg:px-20 lg:pb-4 lg:pt-14">
        <div className="mx-auto w-full max-w-[1282px]">
          <ScrollAnimation delay={0}>
            <PropertyHeader property={property} />
          </ScrollAnimation>

          <div className="mt-5 min-w-0 lg:mt-[22px]">
            <ScrollAnimation delay={0} className="min-w-0">
              <PropertyImageGallery
                images={galleryImages}
                className="mx-auto max-w-[1080px]"
                mainImageClassName="aspect-[16/10] sm:aspect-[16/8.8] lg:aspect-[16/8.2]"
              />
              <QuickFacts facts={quickFacts} />
            </ScrollAnimation>
          </div>

          <ScrollAnimation delay={0.1}>
            <DescriptionSection text={property.description} />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <DetailsCards prices={priceDetails} location={locationDetails} />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <AmenitiesSection 
              categoryValues={property.categoryValues || []} 
              categories={categories}
            />
          </ScrollAnimation>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-10 text-center">
            <h2 className="text-[28px] font-semibold text-[#183c2f] sm:text-[32px]">{t("buy.contactTitle")}</h2>
            <p className="mt-4 text-[#667c74]">{t("buy.contactBody")}</p>
          </div>
          <ContactForm defaultSubject={t("buy.contactSubject", { title: property.title, propertyNumber: property.propertyNumber })} />
        </div>
      </section>
    </main>
  );
}

function PropertyHeader({ property }: { property: PropertyBuying }) {
  const { t, href } = useI18n();

  return (
    <header>
      <nav className="flex items-center gap-1 text-[14px] leading-6 text-[#b3b3b3] lg:text-[20px] lg:leading-[30px]">
        <span className="relative grid size-5 place-items-center lg:size-6">
          <Image src="/single-property/icon-home.svg" alt="" fill sizes="24px" className="object-contain" />
        </span>
        <Link href={href("/")}>{t("common.home")}</Link>
        <span>&gt;</span>
        <Link href={href("/buy")}>{t("buy.heroTitle")}</Link>
        <span>&gt;</span>
        <span className="text-[#292d32]">{t("buy.detailsBreadcrumb")}</span>
      </nav>

      <div className="mt-4 lg:mt-6">
        <h1 className="text-[16px] font-semibold leading-6 text-[#183c2f] lg:text-[28px] lg:font-medium lg:leading-[38px]">
          {property.title}
        </h1>
        <p className="mt-2 flex items-center gap-1 text-[12px] leading-6 text-[#b3b3b3] lg:text-[16px]">
          <Image src="/homepage/properties/icons/location.svg" alt="" width={24} height={24} className="size-6" />
          <span className="truncate">{[property.address?.street, property.address?.area, property.address?.city, property.address?.country].filter(Boolean).join(", ")}</span>
        </p>
      </div>
    </header>
  );
}

function QuickFacts({ facts }: { facts: QuickFact[] }) {
  return (
    <div className="mx-auto mt-4 flex max-w-[1080px] flex-wrap items-center gap-x-7 gap-y-3 rounded-xl border border-[#dfe8e4] bg-[#fbfdfc] px-4 py-3 text-[13px] leading-5 text-[#40544c] lg:text-[14px]">
      {facts.map((fact) => (
        <span key={fact.label} className="inline-flex items-center gap-2.5 font-medium">
          <Image src={fact.icon} alt="" width={22} height={22} className="size-[22px] shrink-0 object-contain" />
          {fact.label}
        </span>
      ))}
    </div>
  );
}

function DescriptionSection({ text }: { text: string }) {
  const { t } = useI18n();

  return (
    <section className="mt-8 lg:mt-10">
      <SectionTitle>{t("buy.description")}</SectionTitle>
      <p className="mt-[15px] max-w-[954px] text-[14px] leading-[1.9] text-[#656566] lg:text-[16px] lg:leading-[23px]">
        {text || t("buy.noDescription")}
      </p>
    </section>
  );
}

function DetailsCards({ prices, location }: { prices: DetailRow[]; location: DetailRow[] }) {
  const { t } = useI18n();

  return (
    <section className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.05fr)]">
      <InfoCard title={t("buy.priceDetails")} icon="/billing/icons/cash.svg" rows={prices} />
      <InfoCard title={t("buy.location")} icon="/billing/icons/location.svg" rows={location} />
    </section>
  );
}

function InfoCard({ title, icon, rows }: { title: string; icon: string; rows: DetailRow[] }) {
  return (
    <article className="rounded-lg border border-[#dfe8e4] bg-white p-[25px] shadow-[0_4px_10px_rgba(175,132,255,0.03)]">
      <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase leading-4 tracking-[0.05em] text-[#183c2f]">
        <Image src={icon} alt="" width={22} height={20} className="h-auto max-h-5 w-5 object-contain" />
        {title}
      </h2>
      <dl className="mt-4 grid gap-3 text-[14px] leading-[22px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-6">
            <dt className="text-[#183c2f]">{label}</dt>
            <dd className="whitespace-nowrap font-medium text-[#101d28]">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function AmenitiesSection({
  categoryValues,
  categories,
}: {
  categoryValues: NonNullable<PropertyBuying["categoryValues"]>;
  categories: PropertyBuyingCategory[];
}) {
  const { t } = useI18n();
  const sectionsMap = new Map<string, PropertyBuyingSection>();
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  for (const cv of categoryValues) {
    const item = cv.propertyBuyingCategoryItem;
    if (!item) continue;

    const catId = item.propertyBuyingCategoryId;
    if (!sectionsMap.has(catId)) {
      const category = categoryById.get(catId);
      sectionsMap.set(catId, {
        categoryId: catId,
        categoryName: category?.name || t("buy.features"),
        categoryIcon: category?.defaultIcon || category?.icon || null,
        displayOrder: category?.displayOrder || 0,
        items: [],
      });
    }

    sectionsMap.get(catId)!.items.push({
      itemId: item.id,
      name: item.name,
      icon: item.icon,
      displayOrder: item.displayOrder || 0,
    });
  }

  const sections = Array.from(sectionsMap.values())
    .map((section) => ({
      ...section,
      items: [...section.items].sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (sections.length === 0) return null;

  return (
    <section className="mt-7 rounded-2xl border border-[#dfe8e4] bg-white p-5 shadow-[0_2px_12px_rgba(24,60,47,0.03)] sm:p-6">
      <div className="flex items-center gap-2">
        <Image src="/icons/amenities/amenities-title.svg" alt="" width={22} height={22} className="object-contain" />
        <SectionTitle>{t("buy.amenitiesFeatures")}</SectionTitle>
      </div>
      <div className="mt-5 grid gap-6">
        {sections?.map((section) => (
          <div key={section.categoryId}>
            <h3 className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#f5f7f6] px-3 text-[14px] font-semibold text-[#183c2f]">
              <DynamicAmenityIcon
                icon={section.categoryIcon}
                width={18}
                height={18}
                className="size-[18px] object-contain"
              />
              {section.categoryName}
            </h3>
            <ul className="mt-3 grid gap-x-4 gap-y-2.5 text-[14px] leading-5 text-[#556960] sm:grid-cols-2 md:grid-cols-3">
              {section.items?.map((item) => (
                <li key={item.itemId} className="flex items-center gap-2.5">
                  <DynamicAmenityIcon
                    icon={item.icon}
                    width={18}
                    height={18}
                    className="size-[18px] shrink-0 object-contain"
                  />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}


function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-semibold leading-7 text-[#101d28]">{children}</h2>;
}
