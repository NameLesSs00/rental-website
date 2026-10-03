export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\p{L}\p{N}_-]+/gu, "") // Remove punctuation while preserving localized letters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, "");
}
