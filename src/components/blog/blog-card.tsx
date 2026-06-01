import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/lib/contentful/types";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-indigo-500/5 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/10">
        <Link href={`/blog/${post.slug}`} className="grid lg:grid-cols-2">
          <div className="relative min-h-[240px] bg-gradient-to-br from-indigo-100 via-violet-50 to-slate-100 lg:min-h-[360px]">
            {post.featuredImageUrl ? (
              <Image
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.25),transparent_45%)]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent lg:hidden" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">Featured</span>
              {post.category ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{post.category}</span>
              ) : null}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-3xl">
              {post.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>{post.authorName}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readTimeMinutes} min read</span>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              Read article
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-lg hover:shadow-indigo-500/10">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-50">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.2),transparent_55%)]"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-2">
            {post.category ? (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                {post.category}
              </span>
            ) : null}
            <span className="text-xs text-slate-500">{post.readTimeMinutes} min read</span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{post.authorName}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
