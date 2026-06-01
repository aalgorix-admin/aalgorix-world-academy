/** Contentful content type API ID (e.g. aalgorixAcademyBlog). */
export const BLOG_POST_CONTENT_TYPE =
  process.env.CONTENTFUL_BLOG_CONTENT_TYPE?.trim() || "aalgorixAcademyBlog";

export function isContentfulConfigured(): boolean {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID?.trim() &&
      process.env.CONTENTFUL_ACCESS_TOKEN?.trim(),
  );
}

export function getContentfulRevalidateSeconds(): number {
  const raw = process.env.CONTENTFUL_REVALIDATE_SECONDS?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 60;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}
