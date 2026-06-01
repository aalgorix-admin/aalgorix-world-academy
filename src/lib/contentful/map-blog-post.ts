import type { Document } from "@contentful/rich-text-types";
import type { Entry, EntrySkeletonType } from "contentful";

import type { BlogPost } from "@/lib/contentful/types";

type ContentfulAssetLink = {
  fields?: {
    title?: string;
    description?: string;
    file?: { url?: string };
  };
};

/** Matches Contentful model `aalgorixAcademyBlog` (+ optional legacy fields). */
type BlogPostFields = {
  title?: string;
  slug?: string;
  coverImage?: ContentfulAssetLink;
  bodyContent?: Document;
  excerpt?: string;
  body?: Document;
  featuredImage?: ContentfulAssetLink;
  authorName?: string;
  authorRole?: string;
  category?: string;
  publishedDate?: string;
  publishDate?: string;
  date?: string;
  seoDescription?: string;
};

type BlogEntry = Entry<EntrySkeletonType<BlogPostFields>, undefined, string>;

function estimateReadTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function collectPlainText(doc: Document | undefined): string {
  if (!doc?.content) {
    return "";
  }

  const parts: string[] = [];

  const walk = (nodes: Document["content"]) => {
    for (const node of nodes) {
      if ("value" in node && typeof node.value === "string") {
        parts.push(node.value);
      }
      if ("content" in node && Array.isArray(node.content)) {
        walk(node.content as Document["content"]);
      }
    }
  };

  walk(doc.content);
  return parts.join(" ");
}

function resolveImageUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }
  return url.startsWith("//") ? `https:${url}` : url;
}

export function mapBlogEntry(entry: BlogEntry): BlogPost | null {
  const fields = entry.fields as BlogPostFields;
  const title = fields.title?.trim();
  const slug = fields.slug?.trim();

  if (!title || !slug) {
    return null;
  }

  const richBody = fields.bodyContent ?? fields.body ?? null;

  const excerpt =
    fields.excerpt?.trim() ||
    collectPlainText(richBody ?? undefined).slice(0, 160).trim() ||
    "";

  const plainForReadTime = [title, excerpt, collectPlainText(richBody ?? undefined)].join(
    " ",
  );

  const imageFields =
    fields.coverImage?.fields ?? fields.featuredImage?.fields;
  const publishedAt =
    fields.publishedDate || fields.publishDate || fields.date || entry.sys.createdAt;

  return {
    id: entry.sys.id,
    title,
    slug,
    excerpt,
    body: richBody,
    featuredImageUrl: resolveImageUrl(imageFields?.file?.url),
    featuredImageAlt:
      imageFields?.description?.trim() ||
      imageFields?.title?.trim() ||
      title,
    authorName: fields.authorName?.trim() || "Aalgorix World Academy",
    authorRole: fields.authorRole?.trim() || null,
    category: fields.category?.trim() || null,
    publishedAt,
    readTimeMinutes: estimateReadTimeMinutes(plainForReadTime),
    seoDescription: fields.seoDescription?.trim() || null,
  };
}
