import { getContentfulClient } from "@/lib/contentful/client";
import {
  BLOG_POST_CONTENT_TYPE,
  isContentfulConfigured,
} from "@/lib/contentful/config";
import { formatContentfulError } from "@/lib/contentful/errors";
import { mapBlogEntry } from "@/lib/contentful/map-blog-post";
import {
  contentTypeNotFoundMessage,
  resolveBlogContentTypeId,
} from "@/lib/contentful/resolve-content-type";
import type {
  BlogListResult,
  BlogPost,
  BlogPostResult,
} from "@/lib/contentful/types";

async function queryBlogEntries(
  client: NonNullable<ReturnType<typeof getContentfulClient>>,
  query: { slug?: string; limit?: number },
) {
  const { contentTypeId, availableIds } = await resolveBlogContentTypeId(client);

  if (!availableIds.includes(contentTypeId)) {
    throw new Error(contentTypeNotFoundMessage(contentTypeId, availableIds));
  }

  try {
    return await client.getEntries({
      content_type: contentTypeId,
      ...(query.slug ? { "fields.slug": query.slug } : {}),
      ...(query.limit ? { limit: query.limit } : {}),
      order: ["-sys.createdAt"],
      include: 2,
    });
  } catch (error) {
    try {
      return await client.getEntries({
        content_type: contentTypeId,
        ...(query.slug ? { "fields.slug": query.slug } : {}),
        ...(query.limit ? { limit: query.limit } : {}),
        include: 2,
      });
    } catch (retryError) {
      throw retryError ?? error;
    }
  }
}

export async function fetchBlogPosts(): Promise<BlogListResult> {
  if (!isContentfulConfigured()) {
    return { posts: [], configured: false, error: null };
  }

  const client = getContentfulClient();
  if (!client) {
    return { posts: [], configured: false, error: null };
  }

  try {
    const response = await queryBlogEntries(client, {});

    const posts = response.items
      .map((entry) => mapBlogEntry(entry))
      .filter((post): post is BlogPost => post !== null)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

    return { posts, configured: true, error: null };
  } catch (error) {
    const message = formatContentfulError(error, BLOG_POST_CONTENT_TYPE);
    return { posts: [], configured: true, error: message };
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostResult> {
  if (!isContentfulConfigured()) {
    return { post: null, configured: false, error: null };
  }

  const client = getContentfulClient();
  if (!client) {
    return { post: null, configured: false, error: null };
  }

  try {
    const response = await queryBlogEntries(client, { slug, limit: 1 });

    const entry = response.items[0];
    if (!entry) {
      return { post: null, configured: true, error: null };
    }

    const post = mapBlogEntry(entry);
    return { post, configured: true, error: null };
  } catch (error) {
    const message = formatContentfulError(error, BLOG_POST_CONTENT_TYPE);
    return { post: null, configured: true, error: message };
  }
}

export async function fetchAllBlogSlugs(): Promise<string[]> {
  const { posts } = await fetchBlogPosts();
  return posts.map((post) => post.slug);
}
