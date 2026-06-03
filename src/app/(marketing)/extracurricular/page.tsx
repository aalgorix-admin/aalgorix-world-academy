import Link from "next/link";

import { BrochureModalCta } from "../brochure-modal-cta";
import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

/** Matches Extracurricular dropdown items in marketing-nav.tsx */
const EXTRACURRICULAR_DROPDOWN_SECTIONS = [
  {
    id: "life-coach-support",
    eyebrow: "Habits & mindset",
    title: "Life Coach Support",
    description:
      "Instilling critical discipline and executive function habits—so students build consistency, confidence, and communication skills that support every subject.",
    tags: ["Discipline", "Life Skills", "Confidence Mapping"],
    bullets: [
      "Structured routines for focus and follow-through",
      "Communication and decision-making practice",
      "Accountability without pressure or shame",
      "Habits that last beyond a single term",
    ],
    accent: "from-rose-50 to-orange-50 ring-rose-100",
  },
  {
    id: "talent-support",
    eyebrow: "Strengths & portfolios",
    title: "Talent Support",
    description:
      "Nurturing raw natural strengths and cultivating competitive portfolios—music, sport, gaming, entrepreneurship, and creative work with evidence students can show.",
    tags: ["Music", "Cricket", "Gaming", "Portfolio Curation"],
    bullets: [
      "Early strength discovery through practice patterns",
      "Depth over dabbling with reps and feedback",
      "Portfolio-ready projects and artefacts",
      "Partner pathways for specialist coaching",
    ],
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
  },
] as const;

const BEYOND_ACADEMICS = [
  {
    title: "Whole-child growth",
    body: "Extracurricular at Aalgorix is not filler—it complements academics with habits, confidence, and real-world readiness.",
  },
  {
    title: "From home, with structure",
    body: "Live coaching, clear milestones, and talent pathways designed for homeschool rhythms—not ad-hoc activities.",
  },
  {
    title: "Humans + AI",
    body: "Life coaches and faculty set the frame; the AI Tutor supports practice between sessions so progress stays visible.",
  },
] as const;

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6l2.5 2.5 4.5-5" />
      </svg>
    </span>
  );
}

export default function ExtracurricularPage() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-slate-50">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-indigo-600 transition-colors duration-200 hover:text-violet-600"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Extracurricular
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Beyond the classroom—{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  habits, talent, and confidence
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Aalgorix pairs rigorous academics with intentional life coaching and talent support—so learners
                build discipline, discover strengths, and grow portfolios that reflect who they are becoming.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className={btnPrimary}>
                  Talk to admissions
                </Link>
                <Link href="/academics" className={btnGhost}>
                  View academics
                </Link>
                <BrochureModalCta className={btnGhost} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Jump to a topic
            </p>
            <nav
              className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2"
              aria-label="Extracurricular topics"
            >
              {EXTRACURRICULAR_DROPDOWN_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 active:scale-[0.98]"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {EXTRACURRICULAR_DROPDOWN_SECTIONS.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`py-14 sm:py-16 scroll-mt-24 ${
              index % 2 === 0 ? "border-b border-slate-200 bg-white" : "border-b border-slate-200 bg-slate-50"
            }`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {section.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{section.description}</p>
                {section.tags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {section.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div
                className={`mx-auto mt-10 max-w-3xl rounded-2xl bg-gradient-to-br p-6 ring-1 sm:p-8 ${section.accent}`}
              >
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-slate-700 sm:text-base">
                      <CheckIcon />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Why it matters
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Extracurricular that supports the whole journey
              </h2>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {BEYOND_ACADEMICS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link href="/ai-tutor" className="font-semibold text-indigo-700 hover:text-violet-700">
                AI Tutor
              </Link>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <Link href="/academics#talent-farming" className="font-semibold text-indigo-700 hover:text-violet-700">
                Talent farming
              </Link>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <Link href="/why-us" className="font-semibold text-indigo-700 hover:text-violet-700">
                Why Aalgorix
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ready to add life coach or talent support?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Tell us about your child&apos;s interests, schedule, and goals—we&apos;ll recommend a sensible weekly
              plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className={btnPrimary}>
                Book a call
              </Link>
              <Link href="/courses" className={btnGhost}>
                View programs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
