import { API_BASE_URL } from "@/lib/api/config";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type { BlogApiResponse, BlogItem, PaginatedBlogsResponse } from "@/lib/types/blog";
import { getBlogSlug } from "@/lib/utils/blogSlug";

const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getPublishedBlogs(locale: Locale = defaultLocale) {
  const params = new URLSearchParams({
    IsPublished: "true",
    PageNumber: "1",
    PageSize: "1000",
    SortBy: "displayOrder",
    IsDescending: "false",
  });

  const res = await fetch(`${API_BASE_URL}/api/blogs?${params.toString()}`, {
    next: { revalidate: 300 },
    headers: { "Accept-Language": locale, "X-Locale": locale },
  });

  if (!res.ok) return [];

  const json = (await res.json()) as BlogApiResponse<PaginatedBlogsResponse<BlogItem>>;
  return json.data?.items ?? [];
}

export async function getRelatedBlogs(currentBlogId: string, limit = 3, locale: Locale = defaultLocale) {
  const blogs = await getPublishedBlogs(locale);

  return blogs
    .filter((blog) => blog.id !== currentBlogId)
    .slice(0, limit);
}

export async function getBlogStaticParams() {
  const blogs = await getPublishedBlogs();

  return blogs
    .map((blog) => ({ slug: getBlogSlug(blog) }))
    .filter(({ slug }) => Boolean(slug));
}

export async function getBlogBySlug(slug: string, locale: Locale = defaultLocale) {
  const decodedSlug = decodeURIComponent(slug);
  const idFromSlug = decodedSlug.match(uuidPattern)?.[0];
  const matchId = idFromSlug || (uuidPattern.test(decodedSlug) ? decodedSlug : "");

  if (matchId) {
    return getBlogById(matchId, locale);
  }

  const [canonicalBlogs, localizedBlogs] = await Promise.all([
    getPublishedBlogs(defaultLocale),
    locale === defaultLocale ? Promise.resolve([]) : getPublishedBlogs(locale),
  ]);
  const blogs = [...localizedBlogs, ...canonicalBlogs];
  const match = blogs.find((blog) => blog.id === decodedSlug || getBlogSlug(blog) === decodedSlug);

  if (!match) return null;

  return getBlogById(match.id, locale);
}

async function getBlogById(id: string, locale: Locale) {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}?incrementViewCount=true`, {
    next: { revalidate: 60 },
    headers: { "Accept-Language": locale, "X-Locale": locale },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as BlogApiResponse<BlogItem>;
  return json.data;
}
