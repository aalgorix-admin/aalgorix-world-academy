type ContentfulErrorBody = {
  message?: string;
  details?: {
    errors?: Array<{ name?: string; value?: string }>;
  };
};

/** Turn Contentful SDK errors into short, actionable messages. */
export function formatContentfulError(error: unknown, contentTypeId: string): string {
  if (!error || typeof error !== "object") {
    return "Failed to load blog posts from Contentful.";
  }

  const err = error as ContentfulErrorBody & { message?: string };
  const details = err.details?.errors ?? [];
  const unknownType = details.find((e) => e.name === "unknownContentType");

  if (unknownType) {
    return (
      `Content type "${contentTypeId}" was not found in your Contentful space. ` +
      `In Contentful → Content model, create a type with API ID "${contentTypeId}" ` +
      `(or set CONTENTFUL_BLOG_CONTENT_TYPE to your existing type's API ID).`
    );
  }

  const orderError = details.find((e) =>
    String(e.name ?? "").toLowerCase().includes("order"),
  );
  if (orderError || err.message?.includes("ordering specification")) {
    return (
      "Could not sort blog posts. Ensure your content type has a Date field with API ID " +
      "`publishedDate`, or the app will fall back to creation date."
    );
  }

  if (typeof err.message === "string" && err.message.startsWith("{")) {
    try {
      const parsed = JSON.parse(err.message) as ContentfulErrorBody;
      return formatContentfulError(parsed, contentTypeId);
    } catch {
      // use raw message below
    }
  }

  return err.message ?? "Failed to load blog posts from Contentful.";
}
