import Link from "next/link";

import { MarketingNav } from "../marketing-nav";
import { FAQ_ENTRIES } from "./faq-content";

const WHATSAPP_HREF = "https://wa.me/919167495565";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const inlineLinkClass =
  "font-semibold text-indigo-700 underline decoration-indigo-200 underline-offset-2 transition-colors hover:text-violet-700";

function FaqAnswer({ id, answer }: { id: string; answer: string }) {
  if (id === "hybrid-program") {
    return (
      <p className="text-sm leading-relaxed text-slate-600">
        The Hybrid School Program blends structured home learning with live faculty support, small
        batches, and regular assessments. See the{" "}
        <Link href="/courses" className={inlineLinkClass}>
          Programs page
        </Link>{" "}
        for details.
      </p>
    );
  }

  if (id === "enroll-admissions") {
    return (
      <p className="text-sm leading-relaxed text-slate-600">
        Reach our admissions team from the{" "}
        <Link href="/contact" className={inlineLinkClass}>
          Contact page
        </Link>{" "}
        or via{" "}
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          WhatsApp
        </a>
        . We will recommend a plan based on grade, goals, and support needs.
      </p>
    );
  }

  return <p className="text-sm leading-relaxed text-slate-600">{answer ?? ""}</p>;
}

export default function FaqPage() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-indigo-600 transition-colors duration-200 hover:text-violet-600"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-4 max-w-3xl text-center sm:mt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                FAQ
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:mt-4 sm:text-4xl">
                Frequently asked questions
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 sm:mt-5">
                Quick answers about AI Tutor, personalised learning, life skills, and admissions.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="space-y-3">
            {FAQ_ENTRIES.map((entry) => (
              <details
                key={entry.id ?? ""}
                className="group rounded-xl border border-slate-200 bg-white shadow-sm open:border-indigo-200 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{entry.question ?? ""}</span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-transform duration-200 group-open:rotate-45 group-open:bg-indigo-100 group-open:text-indigo-700"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-slate-100 px-5 pb-4 pt-3">
                  <FaqAnswer id={entry.id ?? ""} answer={entry.answer ?? ""} />
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm sm:flex-row">
            <Link href="/courses" className={btnGhost}>
              Explore programs
            </Link>
            <Link href="/contact" className={btnPrimary}>
              Contact admissions
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
