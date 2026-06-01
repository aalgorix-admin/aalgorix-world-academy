import type { Document } from "@contentful/rich-text-types";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: Document | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string;
  authorName: string;
  authorRole: string | null;
  category: string | null;
  publishedAt: string;
  readTimeMinutes: number;
  seoDescription: string | null;
};

export type BlogListResult = {
  posts: BlogPost[];
  configured: boolean;
  error: string | null;
};

export type BlogPostResult = {
  post: BlogPost | null;
  configured: boolean;
  error: string | null;
};
