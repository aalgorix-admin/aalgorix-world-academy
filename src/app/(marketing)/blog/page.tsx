import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { fetchBlogPosts } from "@/lib/contentful/blog";
import { MarketingNav } from "../marketing-nav";

/** ISR: new Contentful posts appear within ~60s (override via CONTENTFUL_REVALIDATE_SECONDS). */
export const revalidate = 60;

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

export default async function BlogPage() {
  const { posts, configured, error } = await fetchBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-slate-50">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent),radial-gradient(circle_at_90%_20%,rgba(139,92,246,0.12),transparent_40%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-indigo-600 transition-colors hover:text-violet-600"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Academy insights
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Ideas for an algorithmic world
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                Practical guidance on AI tutoring, personalised learning paths, homeschooling, and
                raising future-ready learners—written by our educators and partners.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {!configured ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
              <h2 className="text-lg font-bold text-amber-900">Connect Contentful to publish posts</h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-800/90">
                Add <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">CONTENTFUL_SPACE_ID</code>{" "}
                and <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">CONTENTFUL_ACCESS_TOKEN</code>{" "}
                to your environment. Use content type <strong>aalgorixAcademyBlog</strong> with fields{" "}
                <code className="font-mono text-xs">title</code>, <code className="font-mono text-xs">slug</code>,{" "}
                <code className="font-mono text-xs">coverImage</code>, and{" "}
                <code className="font-mono text-xs">bodyContent</code>.
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Could not load articles: {error}
            </p>
          ) : null}

          {configured && posts.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-slate-600">No articles published yet. Create your first post in Contentful.</p>
            </div>
          ) : null}

          {featured ? (
            <div className="mb-12 sm:mb-16">
              <BlogCard post={featured} featured />
            </div>
          ) : null}

          {rest.length > 0 ? (
            <>
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Latest articles
                </h2>
                <p className="text-sm text-slate-500">{posts.length} stories</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : null}

          <section className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 px-8 py-12 text-center text-white shadow-xl sm:px-12">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ready to design your child&apos;s learning path?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-indigo-100">
              Talk to admissions about grades 3–12, AI Tutor support, and accredited pathways.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className={btnPrimary}>
                Talk to admissions
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore programs
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
