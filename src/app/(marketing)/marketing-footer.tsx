import Image from "next/image";
import Link from "next/link";

const WHATSAPP_HREF = "https://wa.me/919167495565";

const footerLinkClass =
  "text-slate-400 transition-all duration-200 hover:text-white active:scale-[0.98]";

const footerHeadingClass = "text-sm font-bold uppercase tracking-wider text-white";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/our-story" },
      { label: "Why Us", href: "/why-us" },
      { label: "Learning model", href: "/our-story" },
      { label: "Talent partners", href: "/extracurricular#talent-support" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Get Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Talk to a Counsellor", href: "/contact" },
      { label: "Talent support", href: "/extracurricular#talent-support" },
      { label: "Customer support", href: "/contact" },
      { label: "Chat on WhatsApp", href: WHATSAPP_HREF, external: true },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "AI Tutor", href: "/ai-tutor" },
      { label: "ai4campus", href: "/contact" },
      { label: "AIMasterji", href: "https://aimasterji.professorsai.org/", external: true },
      { label: "Professors AI", href: "https://professorsai.org/", external: true },
      { label: "Aalgorix", href: "https://aalgorix.com/", external: true },
    ],
  },
  {
    title: "Popular links",
    links: [
      { label: "Programs", href: "/courses" },
      { label: "Grades 3–12", href: "/academics#grade-bands" },
      { label: "Curriculum", href: "/academics#curriculum-coach" },
      { label: "Academics", href: "/academics" },
      { label: "Board & accreditation", href: "/academics#accreditation" },
    ],
  },
] as const;

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

function FooterNavLink({ link }: { link: FooterLinkItem }) {
  const className = footerLinkClass;

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
              <Image
                src="/brand/awa-logo.svg"
                alt="Aalgorix World Academy"
                width={140}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/90">
              AI Powered Home School
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              AI-powered homeschooling for Grade 3–12—personalised learning, expert faculty, and life skills
              from home.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
            >
              Talk to admissions
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className={footerHeadingClass}>{column.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {year} Aalgorix World Academy. All rights reserved.</p>
          <p className="text-center sm:text-right">
            International Education affiliation · Cambridge International Affiliation (CAIE)
          </p>
        </div>
      </div>
    </footer>
  );
}
