import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogSinglePageContent from "@/components/BlogSinglePageContent";
import { getBlogBySlug, getBlogStaticParams, getRelatedBlogs } from "@/lib/api/blogHelpers";
import { getBlogSlug } from "@/lib/utils/blogSlug";
import { siteConfig } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n/config";

type BlogSinglePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogSinglePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const blog = await getBlogBySlug(slug, locale);

  if (!blog) {
    return {
      title: getNotFoundTitle(locale),
      robots: { index: false, follow: false },
    };
  }

  const description = blog.summary || blog.content?.slice(0, 160) || getFallbackDescription(locale);

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: `/${locale}/blogs/${slug}`,
    },
    openGraph: {
      title: `${blog.title} | ${siteConfig.name}`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export default async function BlogSinglePage({ params }: BlogSinglePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const blog = await getBlogBySlug(slug, locale);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.id, 3, locale);

  return <BlogSinglePageContent blog={blog} relatedBlogs={relatedBlogs} />;
}

function getFallbackDescription(locale: Locale) {
  switch (locale) {
    case "ar":
      return "اقرأ نصائح السفر والإقامة في الغردقة.";
    case "fr":
      return "Lisez des conseils de voyage et de location à Hurghada.";
    case "de":
      return "Lesen Sie Reisetipps und Einblicke zu Ferienunterkünften in Hurghada.";
    case "ru":
      return "Читайте советы о путешествиях и жилье в Хургаде.";
    default:
      return "Read Hurghada travel, vacation rental, and property insights.";
  }
}

function getNotFoundTitle(locale: Locale) {
  switch (locale) {
    case "ar":
      return "المقال غير موجود";
    case "fr":
      return "Article introuvable";
    case "de":
      return "Blog nicht gefunden";
    case "ru":
      return "Статья не найдена";
    default:
      return "Blog Not Found";
  }
}
