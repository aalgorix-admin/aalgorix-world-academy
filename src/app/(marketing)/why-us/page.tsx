import Link from "next/link";

import { BrochureModalCta } from "../brochure-modal-cta";
import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const HOMESCHOOL_BENEFITS = [
  {
    title: "Personalisation that sticks",
    body: "Less one-size-fits-all pacing: revisit what was shaky, move faster where there is mastery, and build confidence instead of constant comparison.",
  },
  {
    title: "Wellbeing and safety",
    body: "A predictable base at home can reduce commute stress, illness cycles, and social pressure—while still keeping live teaching, accountability, and clear goals.",
  },
  {
    title: "Parents stay in the loop",
    body: "You are not meant to replace every subject expert. The right program gives you visibility—plans, progress, and people you can talk to—so you lead the journey without burning out.",
  },
] as const;

const HIGHLIGHTS = [
  {
    label: "Accreditation",
    value: "Cambridge International Affiliation (CAIE)",
    body: "International Education affiliation—globally recognised standards.",
  },
  {
    label: "Span",
    value: "Grade 3 → 12",
    body: "One continuous journey: academics, skills, and talent development.",
  },
  {
    label: "System",
    value: "AI + people",
    body: "Tutor, faculty, and life coach working as one structured program.",
  },
] as const;

const EXPECTATIONS = [
  {
    title: "Outcomes over overload",
    body: "Fewer scattered apps; more coherent sequencing, feedback, and follow-through.",
  },
  {
    title: "Whole-child, whole journey",
    body: "Academics plus habits and communication—skills that show up in exams and in life.",
  },
] as const;

const DAY_ONE = [
  {
    title: "Clear learning plan",
    body: "A structured path with the right sequence and pace—so you always know what comes next and why it matters.",
  },
  {
    title: "Visible progress",
    body: "Straightforward tracking and updates: strengths, gaps, and next steps without guesswork or spreadsheet overload.",
  },
  {
    title: "Balanced screen time",
    body: "Focused live and guided sessions paired with offline practice and projects—learning stays active, not passive scrolling.",
  },
  {
    title: "Support for diverse learners",
    body: "Flexible pacing, predictable routines, and closer guidance when needed. Share context at admission so we plan support early.",
  },
] as const;

const DIFFERENTIATORS = [
  {
    title: "AI Tutor + personalised learning",
    body: "Adaptive explanations and practice match your child's level and pace. Instant feedback closes gaps before they compound.",
    bullets: ["Right level, every session", "Practice that adapts", "Confidence through mastery"],
    accent: "from-indigo-50 to-violet-50 ring-indigo-100",
  },
  {
    title: "International pathway alignment",
    body: "We affiliate with International Education (Cambridge International Affiliation (CAIE))—a serious academic backbone alongside modern, skill-forward learning.",
    bullets: ["Globally recognised standards", "Strong fundamentals", "Clear progression across grades"],
    accent: "from-violet-50 to-fuchsia-50 ring-violet-100",
  },
  {
    title: "Industry-trained faculty",
    body: "Teachers who explain clearly, hold high standards, and teach students how to think—not only what to memorise for the next test.",
    bullets: ["Small-batch attention", "Exam readiness where it counts", "Questions welcomed"],
    accent: "from-amber-50 to-orange-50 ring-amber-100",
  },
  {
    title: "Life coach + life skills",
    body: "Discipline, communication, leadership, and mindset are taught on purpose—habits that support academics long after a lesson ends.",
    bullets: ["Consistency and focus", "Confidence in communication", "Decision-making under pressure"],
    accent: "from-rose-50 to-orange-50 ring-rose-100",
  },
  {
    title: "Talent Support",
    body: "We help learners discover strengths early and build evidence through projects and portfolios—especially relevant in an algorithmic, project-driven world.",
    bullets: ["Strength discovery", "Portfolio-ready work", "Future-ready curiosity"],
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
  },
  {
    title: "Learn from the safety of home",
    body: "Structured homeschooling without the daily commute: a calmer routine, fewer disruptions, and a setup parents can align with work and family life.",
    bullets: ["Predictable schedule", "Safe, familiar environment", "Parent-friendly operations"],
    accent: "from-sky-50 to-indigo-50 ring-sky-100",
  },
] as const;

const WHO_THRIVES = [
  {
    title: "Parents who want clarity",
    body: "You want a plan you can trust, updates you can understand, and a partner who handles instructional load without you becoming a full-time tutor.",
  },
  {
    title: "Learners who need the right pace",
    body: "Whether accelerating or needing more time, your child benefits from adaptive practice, patient explanations, and routines that build consistency.",
  },
  {
    title: "Families planning ahead",
    body: "From middle school through senior years, you value a single coherent journey—academics, skills, and readiness for what comes next.",
  },
] as const;

const PARENT_FAQ = [
  {
    question: "Is this only self-paced videos?",
    answer:
      "No. Aalgorix combines live faculty support, structured milestones, and an AI Tutor for practice and remediation. Your child is guided—not left alone with a playlist.",
  },
  {
    question: "How much time should parents expect to spend each week?",
    answer:
      "It varies by age and goals, but the system is built to reduce daily micro-management. Admissions can outline a realistic rhythm for your family during a call.",
  },
  {
    question: "Can you support special learning needs?",
    answer:
      "We offer flexible pacing, structured routines, and closer guidance in many cases. The best next step is to share your context during admission so we can recommend the right setup.",
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

export default function WhyUsPage() {
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
                Why Aalgorix
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Homeschooling with outcomes you can see—{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  not homework chaos
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Aalgorix World Academy blends an AI Tutor, industry-trained teachers, and intentional
                life-skills coaching on an internationally aligned pathway (Cambridge International Affiliation (CAIE))—so learners from
                Grade 3 to Grade 12 grow with clarity, confidence, and real-world readiness from home.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/our-story" className={btnGhost}>
                  See our learning model
                </Link>
                <Link href="/contact" className={btnGhost}>
                  Talk to a homeschool parent advisor
                </Link>
                <Link href="/courses" className={btnPrimary}>
                  View programs
                </Link>
              </div>
            </div>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-center shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Why homeschooling
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Home as the classroom: depth, safety, and a rhythm that fits real life
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Homeschooling is not &ldquo;less school&rdquo;—it is a different way to run learning.
                When done with structure and the right support, it can mean fewer distractions, pace
                matched to the child, and more time for depth (reading, projects, sleep, and
                family)—without giving up academic rigour.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {HOMESCHOOL_BENEFITS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-slate-600">
              Aalgorix exists for families who want those benefits with international-grade academics,
              live faculty, an AI Tutor for practice, and coaching for life skills—so homeschooling
              feels organised, not improvised.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                What you can expect
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                A partner—not a pile of logins
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Most &ldquo;online school&rdquo; stacks leave parents coordinating tools and guessing
                whether progress is real. We design for mastery, consistency, and transparency—so
                learning stays effective and sustainable.
              </p>
            </div>
            <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {EXPECTATIONS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 p-6 ring-1 ring-indigo-100"
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                On day one
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Clarity from the start
              </h2>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DAY_ONE.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                >
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                What makes us different
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Built for mastery—not burnout
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Every pillar exists for a reason: together they keep students challenged, supported,
                and moving forward without sacrificing wellbeing at home.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DIFFERENTIATORS.map((item) => (
                <li
                  key={item.title}
                  className={`rounded-2xl bg-gradient-to-br p-6 ring-1 ${item.accent} transition-shadow duration-200 hover:shadow-md`}
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  <ul className="mt-4 space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-slate-700">
                        <CheckIcon />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Who thrives here
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                If this sounds like you, you&apos;re in the right place
              </h2>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {WHO_THRIVES.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Straight answers
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Questions parents ask first
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {PARENT_FAQ.map((entry) => (
                <details
                  key={entry.question}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm open:border-indigo-200 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>{entry.question}</span>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-transform duration-200 group-open:rotate-45 group-open:bg-indigo-100 group-open:text-indigo-700"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-slate-100 px-5 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-slate-600">{entry.answer}</p>
                  </div>
                </details>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-slate-600">
              More answers on our{" "}
              <Link href="/faq" className="font-semibold text-indigo-700 hover:text-violet-700">
                FAQ page
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Want a plan shaped around your child?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Tell us about level, goals, and learning style—we&apos;ll recommend a sensible path and
              what a typical week looks like.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/courses" className={btnPrimary}>
                Explore programs
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-slate-400 hover:bg-slate-800 active:scale-[0.98]"
              >
                Book a call
              </Link>
              <BrochureModalCta className="text-sm font-semibold text-indigo-300 transition-colors hover:text-white" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
