import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";

type BlogRichTextProps = {
  document: Document;
};

const proseClassName =
  "blog-prose max-w-none text-slate-700 [&_a]:font-semibold [&_a]:text-indigo-700 [&_a]:underline [&_a]:decoration-indigo-200 [&_a]:underline-offset-2 hover:[&_a]:text-violet-700 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-300 [&_blockquote]:bg-indigo-50/60 [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:text-slate-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:text-base [&_li]:leading-relaxed [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-5 [&_p]:text-base [&_p]:leading-relaxed [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6";

export function BlogRichText({ document }: BlogRichTextProps) {
  return (
    <div className={proseClassName}>
      {documentToReactComponents(document, {
        renderMark: {
          [MARKS.BOLD]: (text) => <strong className="font-semibold text-slate-900">{text}</strong>,
          [MARKS.ITALIC]: (text) => <em>{text}</em>,
          [MARKS.UNDERLINE]: (text) => <span className="underline">{text}</span>,
          [MARKS.CODE]: (text) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-indigo-900">
              {text}
            </code>
          ),
        },
        renderNode: {
          [BLOCKS.HEADING_1]: (_, children) => (
            <h2 className="mt-12 text-3xl font-extrabold tracking-tight text-slate-900">{children}</h2>
          ),
          [BLOCKS.HEADING_2]: (_, children) => (
            <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">{children}</h2>
          ),
          [BLOCKS.HEADING_3]: (_, children) => (
            <h3 className="mt-8 text-xl font-semibold text-slate-900">{children}</h3>
          ),
          [BLOCKS.HEADING_4]: (_, children) => (
            <h4 className="mt-6 text-lg font-semibold text-slate-900">{children}</h4>
          ),
          [BLOCKS.PARAGRAPH]: (_, children) => <p>{children}</p>,
          [BLOCKS.UL_LIST]: (_, children) => <ul>{children}</ul>,
          [BLOCKS.OL_LIST]: (_, children) => <ol>{children}</ol>,
          [BLOCKS.LIST_ITEM]: (_, children) => <li>{children}</li>,
          [BLOCKS.QUOTE]: (_, children) => <blockquote>{children}</blockquote>,
          [BLOCKS.HR]: () => <hr className="my-10 border-slate-200" />,
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const url = node.data.target?.fields?.file?.url as string | undefined;
            if (!url) {
              return null;
            }
            const src = url.startsWith("//") ? `https:${url}` : url;
            const alt =
              (node.data.target?.fields?.description as string | undefined) ||
              (node.data.target?.fields?.title as string | undefined) ||
              "Blog illustration";

            return (
              <figure className="my-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <div className="relative aspect-[16/9] w-full">
                  <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
                </div>
              </figure>
            );
          },
          [INLINES.HYPERLINK]: (node, children) => {
            const uri = node.data.uri as string;
            const external = uri.startsWith("http");
            if (external) {
              return (
                <a href={uri} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <Link href={uri}>{children}</Link>;
          },
          [INLINES.ENTRY_HYPERLINK]: (node, children) => {
            const slug = node.data.target?.fields?.slug as string | undefined;
            if (!slug) {
              return <span>{children}</span>;
            }
            return <Link href={`/blog/${slug}`}>{children}</Link>;
          },
        },
      })}
    </div>
  );
}
