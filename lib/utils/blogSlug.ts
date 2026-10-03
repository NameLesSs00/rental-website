import type { BlogItem } from "@/lib/types/blog";
import { slugify } from "@/lib/utils/slugify";

export function getBlogSlug(blog: Pick<BlogItem, "id" | "title">) {
  const titleSlug = slugify(blog.title);
  return titleSlug || blog.id;
}
