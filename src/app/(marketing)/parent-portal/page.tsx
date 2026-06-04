import Link from "next/link";

import { BrochureModalCta } from "../brochure-modal-cta";
import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const PARENT_BENEFITS = [
  {
    title: "Clarity without micromanaging",
    body: "See what your child is learning, how they are progressing, and what needs attention—without sitting through every lesson.",
  },
  {
    title: "One place for academics",
    body: "Course progress, submitted work, grades, and teacher feedback live in a single parent dashboard instead of scattered apps and emails.",
  },
  {
    title: "Built for homeschool rhythms",
    body: "Structured plans and updates that respect your schedule—whether you travel, work from home, or support multiple learners.",
  },
] as const;

const DASHBOARD_FEATURES = [
  {
    title: "Linked learners",
    body: "Connect one or more children using a secure link code. Switch between learners from the dashboard header.",
    bullets: ["Family linking in parent settings", "Relationship labels per child", "Secure parent–student connections"],
  },
  {
    title: "Scholastic summary",
    body: "At-a-glance metrics for the active learner: overall completion, assignments submitted, average grade, and pending revisions.",
    bullets: ["Completion percentage across courses", "Submitted vs graded work", "Revision alerts when teachers return work"],
  },
  {
    title: "Course progress",
    body: "Per-course progress bars show lessons completed versus total—so you know where momentum is strong and where gaps remain.",
    bullets: ["Active enrollments listed clearly", "Curriculum tags per course", "Progress percent updated as lessons complete"],
  },
  {
    title: "Grading timeline",
    body: "A chronological feed of submissions: submitted, graded, and returned—with course, lesson, assignment, and teacher feedback visible.",
    bullets: ["Teacher-written feedback", "Grades when marked", "Submitted files and timestamps"],
  },
  {
    title: "Official academic transcript",
    body: "Open a print-ready report card for each linked learner—course list, progress, and graded assessment history in one document.",
    bullets: ["Print-friendly layout", "Transcript-style course overview", "Graded assessment record"],
  },
] as const;

/** Matches Parent Portal dropdown in marketing-nav.tsx */
const PORTAL_SECTIONS = [
  {
    id: "parent-faq-vault",
    eyebrow: "Answers",
    title: "Parent FAQ Vault",
    description:
      "Quick answers about AI Tutor, pacing, screen time, homeschooling fit, progress reports, and how to reach admissions—so you are never guessing what comes next.",
    bullets: [
      "Grades 3–12 and age groups explained",
      "How AI-powered learning works with faculty support",
      "Special learning needs and flexible pacing",
      "Enrollment and admissions steps",
    ],
    link: { href: "/faq", label: "Browse full FAQ" },
  },
  {
    id: "global-family-community",
    eyebrow: "Community",
    title: "Global Family Community",
    description:
      "You are not alone in the journey. Families use Aalgorix from many countries—sharing routines, milestones, and encouragement while learners study from home.",
    bullets: [
      "Connect with admissions for cohort and community updates",
      "WhatsApp and contact channels for quick questions",
      "Structured support—not a disconnected solo experience",
    ],
    link: { href: "/contact", label: "Talk to a counsellor" },
  },
  {
    id: "accountability-handbook",
    eyebrow: "Partnership",
    title: "Accountability Handbook",
    description:
      "A calm partnership model: the academy handles instructional load and marking; parents get visibility and routines that keep learning consistent without turning you into a full-time tutor.",
    bullets: [
      "Weekly rhythm you can plan around",
      "Clear expectations for students and parents",
      "Progress you can act on—not spreadsheet chaos",
    ],
    link: { href: "/why-us", label: "See what to expect" },
  },
  {
    id: "sessions",
    eyebrow: "Getting started",
    title: "Sessions: When started?",
    description:
      "Admissions maps grade level, goals, and weekly capacity—then recommends pathways, subjects, and a realistic start date. Live sessions follow your child’s timetable once enrolled.",
    bullets: [
      "Free consultation to audit goals and residency needs",
      "Custom timetables and trial period before live classes",
      "Live specialist classes with recordings for revision",
    ],
    link: { href: "/contact", label: "Book a consultation" },
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

export default function ParentPortalPage() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1 bg-white">
        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-indigo-600 transition-colors duration-200 hover:text-violet-600"
            >
              ← Back to home
            </Link>
            <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Parent Portal
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Visibility and calm accountability—{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  from one dashboard
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                The Aalgorix parent portal gives you transparent scholastic oversight: link your
                learners, track course progress, read teacher feedback, and open official transcripts—without
                replacing the role of expert faculty and coaches.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className={btnPrimary}>
                  Talk to admissions
                </Link>
                <Link href="/login?next=/parent" className={btnGhost}>
                  Already enrolled? Parent login
                </Link>
                <BrochureModalCta className={btnGhost} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                What parents get
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Designed so you lead the journey with confidence—not with constant guesswork.
              </p>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {PARENT_BENEFITS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Parent dashboard
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Everything in your dashboard
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                After you sign in at{" "}
                <Link href="/login?next=/parent" className="font-semibold text-indigo-700 hover:text-violet-700">
                  /parent
                </Link>
                , these are the tools available today for linked learners.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 lg:grid-cols-2">
              {DASHBOARD_FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-slate-700">
                        <CheckIcon />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-center">
              <p className="text-sm leading-relaxed text-slate-700">
                <strong className="font-semibold text-slate-900">New parent?</strong> Ask your child to
                generate a link code in their account, then enter it in{" "}
                <Link
                  href="/login?next=/parent/settings"
                  className="font-semibold text-indigo-700 hover:text-violet-700"
                >
                  parent settings
                </Link>{" "}
                to connect your first learner.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Explore topics
            </p>
            <nav
              className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Parent portal topics"
            >
              {PORTAL_SECTIONS.map((section) => (
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

        {PORTAL_SECTIONS.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 border-b border-slate-100 py-14 sm:py-16 ${
              index % 2 === 1 ? "bg-slate-50/50" : "bg-white"
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
              </div>
              <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-slate-700 sm:text-base">
                      <CheckIcon />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <Link
                    href={section.link.href}
                    className="text-sm font-semibold text-indigo-700 hover:text-violet-700"
                  >
                    {section.link.label} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Ready to open your parent dashboard?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Sign in to view linked learners, or contact admissions if you need help getting started.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login?next=/parent" className={btnPrimary}>
                Parent login
              </Link>
              <Link href="/contact" className={btnGhost}>
                Contact admissions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
