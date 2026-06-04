import Link from "next/link";

import { CollaborationsCarousel } from "./collaborations-carousel";
import { FAQ_ENTRIES } from "./faq/faq-content";
import { MarketingNav } from "./marketing-nav";
import { BrochureModalCta } from "./brochure-modal-cta";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const btnLink =
  "inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:text-violet-700 active:scale-[0.98]";

const STEPS = [
  {
    num: "01",
    title: "Book a Free Consultation",
    body: "Connect with education advisors to audit tracking requirements, residency rules, and university targets.",
  },
  {
    num: "02",
    title: "Choose Curriculum & Subjects",
    body: "Pick pathways aligned with target global universities, sport commitments, and pacing preferences.",
  },
  {
    num: "03",
    title: "Get Set Up",
    body: "Review custom timetables, order textbooks, and trigger a 7-day trial before your first live class.",
  },
  {
    num: "04",
    title: "Start Interactive Learning",
    body: "Attend weekly live classes, complete structured coursework, and track progress in your family dashboard.",
  },
] as const;

const LEARNING_SYSTEM = [
  {
    num: "01",
    title: "Assess",
    body: "Baseline check to understand level, gaps, and strengths.",
  },
  {
    num: "02",
    title: "Personalise",
    body: "AI-first curriculum + supplementary course plan for mastery.",
  },
  {
    num: "03",
    title: "Coach",
    body: "Faculty guidance + life coach for consistency and motivation.",
  },
  {
    num: "04",
    title: "Track",
    body: "Progress updates for parents—clear, simple, actionable.",
  },
] as const;

const FUTURE_READY_PILLARS = [
  {
    title: "AI Tutor",
    body: "Adaptive learning that matches pace, level, and goals.",
    accent: "from-indigo-50 to-violet-50 ring-indigo-100",
  },
  {
    title: "Industry-trained faculty",
    body: "Clear explanations, high standards, and expert mentoring.",
    accent: "from-violet-50 to-fuchsia-50 ring-violet-100",
  },
  {
    title: "Life Coach + life skills",
    body: "Discipline, confidence, communication, and leadership.",
    accent: "from-rose-50 to-orange-50 ring-rose-100",
  },
  {
    title: "Talent Support",
    body: "Identify strengths early and nurture them consistently for a bright future.",
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
  },
  {
    title: "Special learning needs",
    body: "Flexible pacing and extra support for learners who need more care.",
    accent: "from-sky-50 to-indigo-50 ring-sky-100",
  },
] as const;

const HOME_GRADE_BANDS = [
  {
    grades: "Grade 3–5",
    title: "Foundations",
    body: "Confidence in basics + curiosity-led learning.",
  },
  {
    grades: "Grade 6–8",
    title: "Explore",
    body: "Concept depth, projects, and structured habits.",
  },
  {
    grades: "Grade 9–10",
    title: "Build Concepts",
    body: "Mastery + supplementary courses to close gaps.",
  },
  {
    grades: "Grade 11–12",
    title: "Future Ready",
    body: "Real-world skills, portfolio, and outcomes.",
  },
] as const;

const CURRICULUM_HIGHLIGHTS = [
  {
    title: "Supplementary Course",
    body: "Targeted modules that strengthen weak areas and accelerate strengths.",
  },
  {
    title: "Focus on real-world skills",
    body: "Projects, communication, leadership, and practical application.",
  },
  {
    title: "Learn from safety of your home",
    body: "Structured schedule + support—without daily commuting.",
  },
] as const;

const FEATURES = [
  {
    title: "Live Specialist Classes",
    body: "45-minute sessions with certified educators, auto-recorded for revision and catch-up.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path strokeLinecap="round" d="M17 9l4-2v10l-4-2" />
      </svg>
    ),
  },
  {
    title: "Teacher-Marked Assessments",
    body: "Homework marked and returned with written feedback within an 8-working-day SLA.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M7 4h10l3 4v12H4V4h3" />
        <path strokeLinecap="round" d="M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    title: "Student Tracker Dashboard",
    body: "Real-time progress monitoring accessible by both students and parents simultaneously.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 19V5M4 19h16" />
        <path strokeLinecap="round" d="M8 15l3-4 3 3 4-6" />
      </svg>
    ),
  },
  {
    title: "Direct Teacher Messaging",
    body: "Secure business-hour channels via text, audio, or video for structured academic support.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 6h16v10H8l-4 4V6z" />
        <path strokeLinecap="round" d="M8 10h8M8 13h5" />
      </svg>
    ),
  },
  {
    title: "Parent Dashboard",
    body: "Real-time progress monitoring accessible by parents for seamless oversight and support.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 6h16v10H8l-4 4V6z" />
        <path strokeLinecap="round" d="M8 10h8M8 13h5" />
      </svg>
    ),
  },
  {
    title: "Teacher Dashboard",
    body: "Real-time progress monitoring accessible by teachers for seamless oversight and support.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 6h16v10H8l-4 4V6z" />
        <path strokeLinecap="round" d="M8 10h8M8 13h5" />
      </svg>
    ),
  },
] as const;

const PROOF_STATS = [
  {
    value: "2x",
    label: "Learning Outcomes",
    detail: "Harward University recently released a report suggesting 2x learning growth by AI Tutor.",
  },
  {
    value: "98%",
    label: "Student Satisfaction",
    detail: "98% of students report a positive learning experience with our AI Tutor.",
  },
  {
    value: "100%",
    label: "Global Student-Athlete Support",
    detail: "We support global student-athletes with our fully certified curriculum pathways.",
  },
  {
    value: "24/7",
    label: "Global Learner Support",
    detail: "On-demand academic mentorship across international time zones.",
  },
] as const;

export default function MarketingPage() {
  return (
    <>
      {/* 1. Top announcement bar (Full width background color stays intact) */}
      <div className="w-full bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800 text-white">
        {/* Inner Content Boundary: Keeps items boxed to the exact same width limits as a standard Navbar */}
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-2 sm:flex-row sm:items-center sm:px-6 sm:py-0 lg:px-8 sm:h-10">
          {/* Left Text */}
          <p className="m-0 min-w-0 flex-1 text-left text-[11px] font-medium leading-snug tracking-wide sm:text-sm sm:leading-none">
            ⚡ Enrolling for the 2026 Academic Term: Secure Your Global Road to Success Today |{" "}
            <Link
              href="/contact"
              className="inline underline decoration-white/40 underline-offset-2 transition-all duration-200 hover:decoration-white active:scale-[0.98]"
            >
              Book a free consultation →
            </Link>
          </p>

          {/* Actions (below text on mobile, right-aligned on sm+) */}
          <div className="flex w-full flex-wrap items-center gap-1.5 text-[10px] sm:w-auto sm:justify-end sm:text-[11px]">
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/10 transition-all font-medium"
            >
              Enroll Now
            </Link>
            <Link
              href="/faq"
              className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/10 transition-all font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/10 transition-all font-medium"
            >
              Blog
            </Link>
            <a
              href="https://wa.me/+919167495565"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded font-semibold transition-all"
            >
              WhatsApp
            </a>
            <Link
              href="/donate"
              className="bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded font-semibold transition-all"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Sticky navigation */}
      <MarketingNav />

      <main>
        {/* 3. Conversion hero */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-6 pt-12 sm:gap-12 sm:px-6 sm:pb-12 sm:pt-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-16">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-800">
              Prepare your child for an Algorithmic Tomorrow
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Holistic Elite Education.{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  Driven by AI Cognitive Tutor.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              We protect your child’s well-being while identifying their core strengths, cultivating vital communication skills, and farming their distinct talents for an automated tomorrow.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/signup" className={btnPrimary}>
                  Enroll Your Child
                </Link>
                <Link href="/ai-tutor" className={btnGhost}>
                  Try AI Tutor
                </Link>
                <BrochureModalCta className={btnGhost} />
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Grab your Free Trial Session Today.
              </p>
            </div>

            {/* Hero video — full-bleed on mobile, tight vertical spacing */}
            <div className="relative -mx-4 w-[calc(100%+2rem)] sm:mx-auto sm:w-full sm:max-w-xl lg:mx-0 lg:max-w-none">
              <div className="rounded-xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50 via-violet-50/90 to-white p-1 shadow-2xl shadow-indigo-500/25 ring-1 ring-violet-100 sm:rounded-2xl sm:p-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-violet-200/80 bg-slate-900 ring-1 ring-indigo-100/60 sm:bg-indigo-50/50 lg:aspect-[16/11] lg:min-h-[28rem]">
                  <video
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover lg:object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                    preload="auto"
                    aria-hidden
                    tabIndex={-1}
                  >
                    <source src="/videos/awa-hero-video.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future-ready homeschooling */}
        <section id="ai-tutor" className="scroll-mt-24 border-b border-slate-100 bg-white py-18 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Future-ready homeschooling
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Strong academics. Real-world skills.{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  Powered by an AI Tutor.
                </span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Designed for <strong className="font-semibold text-slate-800">Grade 3 to Grade 12</strong>.
                Learn from the safety of your home with personalised learning paths, supplementary courses,
                and mentorship that builds life skills.
              </p>
            </div>
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {FUTURE_READY_PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className={`rounded-2xl bg-gradient-to-br p-6 ring-1 ${pillar.accent}`}
                >
                  <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Social proof strip */}
        <section
          className="border-y border-slate-200 bg-slate-900 text-white"
          aria-label="Academy outcomes"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-700 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {PROOF_STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-8 text-center lg:py-10">
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-indigo-200">{stat.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        

        {/* How it works — learning system */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-slate-100 bg-slate-50 py-18 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A simple system that delivers results
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Personalised learning isn&apos;t just &ldquo;more content&rdquo;. It&apos;s the right sequence,
                the right pace, and the right support—so your child builds mastery and confidence.
              </p>
            </div>
            <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {LEARNING_SYSTEM.map((step, index) => (
                <li key={step.num} className="relative">
                  {index < LEARNING_SYSTEM.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute right-0 top-8 hidden h-0.5 w-8 translate-x-full bg-gradient-to-r from-indigo-300 to-violet-300 lg:block"
                    />
                  ) : null}
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                      {step.num}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Grade 3–12 AI-first curriculum */}
        <section id="life-journey" className="scroll-mt-24 bg-white py-18 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Grade 3 to Grade 12
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                AI-first curriculum with international board affiliation
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Built to prepare children for an{" "}
                <strong className="font-semibold text-slate-800">algorithmic world</strong>—with a strong
                academic base and a consistent focus on real-world skills and life skills.
              </p>
            </div>
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOME_GRADE_BANDS.map((band) => (
                <li
                  key={band.grades}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{band.grades}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{band.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{band.body}</p>
                </li>
              ))}
            </ul>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {CURRICULUM_HIGHLIGHTS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 p-6 ring-1 ring-indigo-100"
                >
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/courses" className={btnPrimary}>
                Explore Programs
              </Link>
              <Link href="/contact" className={btnGhost}>
                Talk to Admissions
              </Link>
            </div>
          </div>
        </section>

        {/* Enrollment journey */}
        <section
          id="get-started"
          className="scroll-mt-24 border-t border-slate-100 bg-slate-50 py-18 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How Online School Works
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A clear four-step pipeline from first consultation to live, interactive learning.
              </p>
            </div>
            <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <li key={step.num} className="relative">
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute right-0 top-8 hidden h-0.5 w-8 translate-x-full bg-gradient-to-r from-indigo-300 to-violet-300 lg:block"
                    />
                  ) : null}
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                      {step.num}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Academy benefits */}
        <section
          id="academy-benefits"
          className="scroll-mt-24 bg-white py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Academy Benefits
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Day-to-day platform mechanics designed for accountability, feedback, and family
                visibility.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ preview */}
        <section id="parent-faq-vault" className="scroll-mt-24 border-t border-slate-100 bg-slate-50 py-18 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">FAQ</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Quick answers about AI Tutor, personalised learning, life skills, and admissions.
              </p>
            </div>
            <div className="mt-10 space-y-3">
              {FAQ_ENTRIES.map((entry) => (
                <details
                  key={entry.id}
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/courses" className={btnGhost}>
                Explore Programs
              </Link>
              <Link href="/contact" className={btnPrimary}>
                Talk to Admissions
              </Link>
              <Link href="/faq" className={btnLink}>
                View all FAQ →
              </Link>
            </div>
          </div>
        </section>

        <CollaborationsCarousel />

        {/* CTA band */}
        <section className="bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to build a future-ready learning path?
            </h2>
            <p className="mt-4 text-indigo-100">
              Talk to admissions to find the right program for Grade 3 to 12. We&apos;ll recommend a
              personalised plan, supplementary courses, and the right mix of academics + real-world skills.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-800 transition-all duration-200 hover:bg-indigo-50 active:scale-[0.98]"
              >
                Enroll / Chat Now
              </Link>
              <a
                href="https://aimasterji.professorsai.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
              >
                Try AI Assistant
              </a>
            </div>
            <p className="mt-4 text-xs text-indigo-100">
              Free consultation <span className="mx-2 opacity-60">·</span> No obligation{" "}
              <span className="mx-2 opacity-60">·</span> Response within 24 hours
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
