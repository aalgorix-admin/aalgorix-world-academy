import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogRichText } from "@/components/blog/rich-text";
import { fetchAllBlogSlugs, fetchBlogPostBySlug } from "@/lib/contentful/blog";
import { MarketingNav } from "../../marketing-nav";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { post } = await fetchBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article not found | Aalgorix World Academy" };
  }

  return {
    title: `${post.title} | Aalgorix World Academy Blog`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
    },
  };
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500";

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, configured, error } = await fetchBlogPostBySlug(slug);

  if (!configured) {
    return (
      <>
        <MarketingNav />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-slate-600">Blog is not configured. Add Contentful credentials to your environment.</p>
          <Link href="/blog" className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-violet-600">
            ← Back to blog
          </Link>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MarketingNav />
        <main className="mx-auto max-w-2xl px-4 py-20">
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
          <Link href="/blog" className="mt-6 inline-block text-sm font-semibold text-indigo-600">
            ← Back to blog
          </Link>
        </main>
      </>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-white">
        <article>
          <header className="border-b border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 lg:px-8">
              <Link
                href="/blog"
                className="inline-flex text-sm font-medium text-indigo-600 transition-colors hover:text-violet-600"
              >
                ← All articles
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {post.category ? (
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    {post.category}
                  </span>
                ) : null}
                <span className="text-sm text-slate-500">{post.readTimeMinutes} min read</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{post.authorName}</p>
                  {post.authorRole ? (
                    <p className="text-sm text-slate-500">{post.authorRole}</p>
                  ) : null}
                </div>
                <time
                  className="ml-auto text-sm text-slate-500"
                  dateTime={post.publishedAt}
                >
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            </div>
          </header>

          {post.featuredImageUrl ? (
            <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
              <div className="relative aspect-[2/1] overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
                <Image
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>
          ) : null}

          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {post.body ? <BlogRichText document={post.body} /> : null}

            <footer className="mt-14 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-8 text-center">
              <h2 className="text-xl font-bold text-slate-900">Continue the conversation</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Our admissions team can help you translate these ideas into a personalised plan for
                your child.
              </p>
              <Link href="/contact" className={`${btnPrimary} mt-6`}>
                Book a consultation
              </Link>
            </footer>
          </div>
        </article>
      </main>
    </>
  );
}
