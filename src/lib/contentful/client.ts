import { createClient, type ContentfulClientApi } from "contentful";

import { isContentfulConfigured } from "@/lib/contentful/config";

let client: ContentfulClientApi<undefined> | null = null;

export function getContentfulClient(): ContentfulClientApi<undefined> | null {
  if (!isContentfulConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!.trim(),
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!.trim(),
      environment: process.env.CONTENTFUL_ENVIRONMENT?.trim() || "master",
    });
  }

  return client;
}
