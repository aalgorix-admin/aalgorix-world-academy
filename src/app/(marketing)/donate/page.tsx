import Link from "next/link";

import { MarketingNav } from "../marketing-nav";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const btnGhost =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-indigo-300 hover:bg-slate-50 active:scale-[0.98]";

const DONATION_IMPACT = [
  {
    title: "Access & continuity",
    body: "Help families who need stability and support to keep learning consistent and on track.",
  },
  {
    title: "Guidance that lasts",
    body: "Support mentoring, routines, and learning habits that strengthen confidence and long-term outcomes.",
  },
  {
    title: "Wellbeing-first learning",
    body: "Contribute to learning environments that protect wellbeing, dignity, and a healthy rhythm for childhood.",
  },
] as const;

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-4.4-9.2-9.2C1.2 8.4 3.3 5.5 6.6 5.2c1.7-.2 3.2.6 4.2 1.8 1-1.2 2.6-2 4.2-1.8 3.3.3 5.4 3.2 3.8 6.6C19 16.6 12 21 12 21z"
      />
    </svg>
  );
}

export default function DonatePage() {
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
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Support learners with structure, clarity, and confidence
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                We support learners and families who need a stable path forward. If you’d like to help—through
                donations, sponsorships, learning resources, or partnerships—reach out and we’ll guide you to the
                right option.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className={btnPrimary}>
                  Contact us to help
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Impact</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  The good work your support makes possible
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  We focus on meaningful help for real families—keeping learning steady, building confidence, and
                  supporting long-term growth with structure and care.
                </p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {DONATION_IMPACT.map((item) => (
                    <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Want to help?</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Tell us how you’d like to support—donation, sponsorship, resources, volunteering, or a
                      partnership—and we’ll connect you with the right team.
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                    <HeartIcon />
                  </span>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Contact & coordination</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Use the contact form and mention “Donation / Help”. If you prefer, message us on WhatsApp from the
                    contact page.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link href="/contact" className={btnPrimary}>
                      Contact us
                    </Link>
                  </div>
                </div>

                <p className="mt-5 text-xs leading-relaxed text-slate-500">
                  We’ll respond with the next steps and coordinate the best way to support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

