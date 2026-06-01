import Link from "next/link";

import { BrochureModalCta } from "../brochure-modal-cta";
import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const MILESTONES = [
  {
    year: "The challenge",
    title: "Schooling was built for classrooms, not childhood",
    body: "Families told us the same story: rigid timetables, one-size pacing, and little visibility for parents—while children lost confidence, sleep, and curiosity. Global movers, young athletes, and thoughtful homeschoolers needed something better.",
  },
  {
    year: "Our response",
    title: "An academy designed around the whole learner",
    body: "Aalgorix World Academy combines accredited international pathways with live specialist teaching, structured accountability, and an AI cognitive tutor that supports—not replaces—expert educators.",
  },
  {
    year: "Today",
    title: "Preparing learners for an algorithmic tomorrow",
    body: "We protect wellbeing, map strengths early, build communication fluency, and farm distinct talents so every child graduates with academic proof and a portfolio that reflects who they are—not only what they scored.",
  },
] as const;

const PILLARS = [
  {
    title: "Wellbeing before pressure",
    body: "Sustainable pacing, clear expectations, and life-coach habits so students grow without burnout. Excellence should strengthen confidence—not trade it away.",
    accent: "from-rose-50 to-orange-50 ring-rose-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-700" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M12 21s-6-4.5-6-10a6 6 0 1112 0c0 5.5-6 10-6 10z" />
        <path strokeLinecap="round" d="M12 11v-3" />
      </svg>
    ),
  },
  {
    title: "Mastery, not memorisation",
    body: "Live masterclasses, teacher-marked work, and revision loops help learners understand deeply. Assessment exists to guide growth—not to rank childhood.",
    accent: "from-indigo-50 to-violet-50 ring-indigo-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 19h16M6 16l3-4 4 3 5-8" />
      </svg>
    ),
  },
  {
    title: "Human mentors + AI precision",
    body: "Certified educators lead instruction and feedback. Our AI cognitive tutor personalises practice, explains concepts on demand, and keeps study active between live sessions.",
    accent: "from-violet-50 to-fuchsia-50 ring-violet-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-violet-700" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="5" y="8" width="14" height="10" rx="2" />
        <path strokeLinecap="round" d="M9 12h2M13 12h2M9 15h6" />
        <path strokeLinecap="round" d="M12 4v4" />
      </svg>
    ),
  },
  {
    title: "Talent farming & real portfolios",
    body: "Beyond transcripts, we nurture music, sport, gaming, entrepreneurship, and creative work—building evidence of initiative universities and employers recognise.",
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M12 3l2.4 6.2L21 10l-5 4.2L17.5 21 12 17.3 6.5 21 8 14.2 3 10l6.6-.8L12 3z" />
      </svg>
    ),
  },
] as const;

const TEACHING_MODEL = [
  {
    step: "01",
    title: "Diagnose & design",
    body: "Admissions consultants map grade level, residency rules, university targets, and weekly capacity—then recommend an accredited pathway and subject set.",
  },
  {
    step: "02",
    title: "Teach live, reinforce daily",
    body: "Specialist educators deliver interactive classes. Structured assignments, auto-recorded lessons, and the AI tutor keep momentum between sessions.",
  },
  {
    step: "03",
    title: "Measure, mentor, adjust",
    body: "Parents see progress in real time. Teachers return marked work with feedback. Coaches reinforce discipline, communication, and executive function.",
  },
] as const;

const COMMITMENTS = [
  "Internationally recognised curricula with transparent accreditation guidance",
  "Small-batch live instruction with recordings for revision and travel",
  "Teacher-marked assessments with written feedback—not automated guessing",
  "Parent dashboards that make accountability calm, not confrontational",
  "Life skills, talent pathways, and portfolio support alongside academics",
] as const;

export default function OurStoryPage() {
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
                About Aalgorix World Academy
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Our story &{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  educational philosophy
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                We built an online school for families who refuse to choose between academic rigour,
                global mobility, and a childhood that still feels like childhood.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/signup" className={btnPrimary}>
                  Start your child&apos;s journey
                </Link>
                <BrochureModalCta className={btnGhost} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Why we exist
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Education should adapt to the learner—not the other way around. Here is how that belief
                became Aalgorix World Academy.
              </p>
            </div>
            <ol className="mx-auto mt-12 grid max-w-4xl gap-8">
              {MILESTONES.map((item, index) => (
                <li key={item.year} className="relative flex gap-6 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/30">
                      {index + 1}
                    </span>
                    {index < MILESTONES.length - 1 ? (
                      <span className="mt-2 hidden h-full w-px flex-1 bg-gradient-to-b from-indigo-200 to-transparent sm:block" />
                    ) : null}
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      {item.year}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Our philosophy
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Four beliefs that guide every lesson
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                These principles shape curriculum choices, classroom culture, technology design, and
                how we partner with parents.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className={`rounded-2xl bg-gradient-to-br p-6 ring-1 ${pillar.accent} transition-shadow duration-200 hover:shadow-md`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                    {pillar.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  How we teach
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  A learning model families can trust—and students can feel
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Online does not mean alone. We combine live human instruction, structured
                  accountability, and intelligent practice so progress is visible every week.
                </p>
                <ul className="mt-8 space-y-3">
                  {COMMITMENTS.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-700">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                        aria-hidden
                      >
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6l2.5 2.5 4.5-5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <ol className="space-y-4">
                {TEACHING_MODEL.map((step) => (
                  <li
                    key={step.step}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Step {step.step}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Our promise to families
            </p>
            <blockquote className="mt-6 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              &ldquo;We will never ask your child to shrink their ambition to fit a timetable. We build
              the timetable, the mentorship, and the evidence around who they are becoming.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm text-slate-400">
              — The founding vision of Aalgorix World Academy
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Ready to see if we are the right fit?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Book a free consultation, explore accredited pathways, or download our brochure to share
              with your family.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className={btnPrimary}>
                Book a consultation
              </Link>
              <Link href="/courses" className={btnGhost}>
                Explore programs
              </Link>
              <Link href="/faq" className="text-sm font-semibold text-indigo-700 hover:text-violet-700">
                Read FAQ →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
