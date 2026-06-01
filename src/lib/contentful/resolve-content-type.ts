import type { ContentfulClientApi } from "contentful";

import { BLOG_POST_CONTENT_TYPE } from "@/lib/contentful/config";

const FALLBACK_TYPE_IDS = [
  "aalgorixAcademyBlog",
  "blogPost",
  "blog",
  "post",
  "article",
] as const;

export async function resolveBlogContentTypeId(
  client: ContentfulClientApi<undefined>,
): Promise<{ contentTypeId: string; availableIds: string[] }> {
  const response = await client.getContentTypes();
  const availableIds = response.items.map((type) => type.sys.id);

  const preferred = BLOG_POST_CONTENT_TYPE.trim();
  if (availableIds.includes(preferred)) {
    return { contentTypeId: preferred, availableIds };
  }

  const fallback = FALLBACK_TYPE_IDS.find((id) => availableIds.includes(id));
  if (fallback) {
    return { contentTypeId: fallback, availableIds };
  }

  return { contentTypeId: preferred, availableIds };
}

export function contentTypeNotFoundMessage(
  requestedId: string,
  availableIds: string[],
): string {
  const list =
    availableIds.length > 0
      ? `Available content types in this space: ${availableIds.join(", ")}.`
      : "No content types exist in this space yet.";

  return (
    `Content type "${requestedId}" was not found. ${list} ` +
    `Set CONTENTFUL_BLOG_CONTENT_TYPE to one of the IDs above (default: aalgorixAcademyBlog).`
  );
}
