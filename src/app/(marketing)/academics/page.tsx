import Link from "next/link";

import { BrochureModalCta } from "../brochure-modal-cta";
import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

/** Matches Academics dropdown items in marketing-nav.tsx */
const ACADEMICS_DROPDOWN_SECTIONS = [
  {
    id: "life-journey",
    eyebrow: "Our method",
    title: "Life Journey: How do we teach?",
    description:
      "Explore our student-centric pedagogical model and everyday learning workflows—designed so students know what to do each day and parents see progress without micromanaging.",
    tags: ["Our Method", "Learning Flow"],
    bullets: [
      "Live specialist sessions with clear lesson goals",
      "AI Tutor practice between classes to close gaps",
      "Offline projects and reading for balance",
      "Weekly milestones and parent-friendly updates",
    ],
    accent: "from-indigo-50 to-violet-50 ring-indigo-100",
  },
  {
    id: "project-based-learning",
    eyebrow: "Portfolio building",
    title: "Project-Based Learning",
    description:
      "Hands-on, experiential academic tracks built for real-world mastery and portfolio development—not worksheets for their own sake.",
    tags: ["Portfolio Building", "Real-World Tasks"],
    bullets: [
      "Cross-subject projects with faculty feedback",
      "Portfolio artefacts students can show over time",
      "Stretch tasks aligned with talent farming",
      "Revision loops that connect projects to exams",
    ],
    accent: "from-violet-50 to-fuchsia-50 ring-violet-100",
  },
  {
    id: "curriculum-coach",
    eyebrow: "Pathway guidance",
    title: "Curriculum Coach",
    description:
      "Accredited international tracks tailored to your pacing—so board choice, subject set, and weekly load fit your child and your family’s goals.",
    tags: ["NIOS Board", "Cambridge International"],
    bullets: [
      "Board and pathway recommendations at admission",
      "Subject selection aligned with university targets",
      "Pacing plans for travel, sport, or acceleration",
      "Supplementary courses to strengthen weak areas",
    ],
    accent: "from-amber-50 to-orange-50 ring-amber-100",
  },
  {
    id: "inclusive-learning",
    eyebrow: "Homeschooling support",
    title: "Inclusive Learning",
    description:
      "Dedicated homeschooling programs tailored for children with special needs—structured routines, flexible pacing, and closer guidance when required.",
    tags: ["Special Needs", "Homeschooling"],
    bullets: [
      "Predictable daily rhythm with adjustable load",
      "Patient explanations and multi-modal practice",
      "Closer faculty check-ins when needed",
      "Admission planning based on your child’s context",
    ],
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
  },
] as const;

const GRADE_BANDS = [
  {
    grades: "Grade 3–5",
    title: "Foundations",
    summary: "Literacy, numeracy, curiosity, and confident routines at home.",
    bullets: ["English & reading", "Mathematics", "Science basics", "Social awareness", "Creative projects"],
    accent: "from-indigo-50 to-violet-50 ring-indigo-100",
  },
  {
    grades: "Grade 6–8",
    title: "Explore",
    summary: "Concept depth, study habits, and early strength discovery.",
    bullets: ["Core sciences", "Mathematics (pre-algebra onward)", "Languages", "Digital literacy", "Project-based learning"],
    accent: "from-violet-50 to-fuchsia-50 ring-violet-100",
  },
  {
    grades: "Grade 9–10",
    title: "Build",
    summary: "Exam readiness, supplementary courses, and closing learning gaps.",
    bullets: [
      "Board-aligned core subjects",
      "Supplementary mastery tracks",
      "Research & writing",
      "Talent pathways begin to specialise",
    ],
    accent: "from-amber-50 to-orange-50 ring-amber-100",
  },
  {
    grades: "Grade 11–12",
    title: "Future ready",
    summary: "Portfolio, outcomes, and preparation for university or career pathways.",
    bullets: [
      "Senior board subjects",
      "Advanced electives",
      "Portfolio & capstone projects",
      "Career & communication skills",
    ],
    accent: "from-emerald-50 to-teal-50 ring-emerald-100",
  },
] as const;

const BOARDS = [
  {
    grades: "Grades 3–5",
    title: "Primary",
    body: "Strong fundamentals in literacy, numeracy, and inquiry—delivered with short, focused sessions and offline practice so young learners build confidence without overload.",
    bullets: ["Structured daily rhythm", "AI Tutor for guided practice", "Parent-friendly progress updates"],
  },
  {
    grades: "Grades 6–12",
    title: "Secondary",
    body: "Rigorous, internationally aligned academics with clear milestones, exam preparation where relevant, and supplementary courses to strengthen weak areas.",
    bullets: ["Board-aligned sequencing", "Faculty-led concept sessions", "Exam & portfolio readiness"],
  },
] as const;

const TALENT_FARMING = [
  {
    title: "Strength discovery",
    body: "Interests show up in practice patterns—not only test scores.",
  },
  {
    title: "Depth & projects",
    body: "Reps, feedback, and stretch work build real skill.",
  },
  {
    title: "Portfolio evidence",
    body: "Artefacts students can show as they grow.",
  },
  {
    title: "Partner pathways",
    body: "Talent partners extend specialist coaching where needed.",
  },
] as const;

const LANGUAGES = [
  { name: "French", body: "Foundations through conversational confidence; ideal for international mobility." },
  { name: "Spanish", body: "Widely spoken global language with cultural and academic breadth." },
  { name: "German", body: "Strong for STEM pathways and European higher education." },
  { name: "Italian", body: "Arts, culture, and humanities enrichment alongside core academics." },
  { name: "Russian", body: "Structured progression for families seeking this pathway." },
] as const;

const LIFE_SKILLS = [
  {
    title: "Public speaking",
    body: "Structure, voice, and presence—practice in safe, small settings from home.",
  },
  {
    title: "Communication skills",
    body: "Listening, clarity, and collaboration for school, family, and future work.",
  },
  {
    title: "Social skills",
    body: "Empathy, boundaries, and teamwork taught alongside academics.",
  },
] as const;

const COMPETITIVE = [
  {
    title: "Olympiad",
    body: "Math, science, and logical reasoning prep with targeted practice and faculty guidance.",
  },
  {
    title: "Robotics",
    body: "Hands-on problem solving, coding, and team projects aligned with talent farming.",
  },
  {
    title: "Scholarship exams",
    body: "Structured prep plans, mock cycles, and gap-closing before key dates.",
  },
  {
    title: "Interschool quizzes",
    body: "General knowledge and quick-thinking drills with healthy competition.",
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

export default function AcademicsPage() {
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Academics</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                A complete academic pathway—{" "}
                <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  from foundations to future-ready
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Aalgorix World Academy combines an internationally affiliated board pathway (Cambridge International Affiliation (CAIE)),
                personalised learning with an AI Tutor, talent farming, languages, life skills, and
                competitive enrichment—for homeschoolers in Grade 3 through Grade 12.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/courses" className={btnPrimary}>
                  View programs
                </Link>
                <Link href="/contact" className={btnGhost}>
                  Talk to admissions
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
              className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Academics topics"
            >
              {ACADEMICS_DROPDOWN_SECTIONS.map((section) => (
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

        {ACADEMICS_DROPDOWN_SECTIONS.map((section, index) => (
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

        <section id="grade-bands" className="border-b border-slate-200 bg-white py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Grade 3 to Grade 12
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Learning bands that grow with your child
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Each band has clear goals, the right level of challenge, and a balance of live teaching,
                AI-guided practice, and offline work—so progress stays visible year over year.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 lg:grid-cols-2">
              {GRADE_BANDS.map((band) => (
                <li
                  key={band.grades}
                  className={`rounded-2xl bg-gradient-to-br p-6 ring-1 ${band.accent}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{band.grades}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{band.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{band.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {band.bullets.map((bullet) => (
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

        <section id="accreditation" className="py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  International pathway
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Board affiliation with globally recognised standards
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  We affiliate with International Education (Cambridge International Affiliation (CAIE))—a serious academic backbone
                  for families who want homeschooling with international-grade expectations, not an ad-hoc
                  curriculum.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Core subjects follow a coherent sequence; supplementary courses and the AI Tutor close gaps;
                  faculty sessions keep standards high and explanations clear.
                </p>
                <Link href="/why-us" className="mt-6 inline-flex text-sm font-semibold text-indigo-700 hover:text-violet-700">
                  Read about our accreditation →
                </Link>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-4xl" aria-hidden>
                  🎓
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Accreditation
                </p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">Cambridge International Affiliation (CAIE)</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Internationally recognised standards across the learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="boards" className="border-y border-slate-200 bg-white py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Boards</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Primary and secondary pathways
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Two clear stages—each with age-appropriate rigour, pacing, and support from home.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {BOARDS.map((board) => (
                <li
                  key={board.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{board.grades}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{board.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{board.body}</p>
                  <ul className="mt-4 space-y-2">
                    {board.bullets.map((bullet) => (
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

        <section id="talent-farming" className="py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Talent farming</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Academics plus deliberate talent growth
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We use talent farming to mean spotting strengths early, building depth through practice and
                projects, and turning growth into portfolio-ready work—not labelling students once and moving
                on.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                The AI Tutor surfaces where learners accelerate or stall; faculty and talent pathways turn those
                signals into the right next challenge—Olympiad track, robotics, creative portfolio, or advanced
                electives.
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TALENT_FARMING.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link href="/ai-tutor" className="font-semibold text-indigo-700 hover:text-violet-700">
                AI Tutor
              </Link>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <Link href="/why-us" className="font-semibold text-indigo-700 hover:text-violet-700">
                Talent support
              </Link>
            </div>
          </div>
        </section>

        <section id="languages" className="border-y border-slate-200 bg-white py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Languages</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                World languages as part of the journey
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Supplementary language tracks sit alongside core academics—structured for steady progress from
                home.
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LANGUAGES.map((lang) => (
                <li
                  key={lang.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{lang.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{lang.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="life-skills" className="py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Life skills</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Skills that travel beyond the exam hall
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Taught on purpose with a life coach—so confidence, communication, and habits support every
                subject.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {LIFE_SKILLS.map((item) => (
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

        <section id="competitive" className="border-y border-slate-200 bg-white py-14 sm:py-16 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Competitive &amp; enrichment
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Stretch goals for ambitious learners
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Optional tracks for students who want extra challenge—always with structure, not chaos.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {COMPETITIVE.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-900 py-14 text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Not sure which track fits?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Admissions can map grade, board stage, talent interests, and support needs to a sensible weekly
              plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/our-story" className={btnGhost}>
                Learning model
              </Link>
              <Link href="/contact" className={btnPrimary}>
                Book a call
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
