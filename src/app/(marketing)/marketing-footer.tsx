import Link from "next/link";

const footerLinkClass =
  "transition-all duration-200 hover:text-white active:scale-[0.98]";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-lg font-extrabold tracking-tight text-white">
              AALGORIX WORLD ACADEMY
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Premium accredited online schooling for global families, homeschoolers, and
              student-athletes pursuing international university admissions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Curricula</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/#curricula-pathways" className={footerLinkClass}>
                  British International
                </Link>
              </li>
              <li>
                <Link href="/#curricula-pathways" className={footerLinkClass}>
                  CAPS / SACAI
                </Link>
              </li>
              <li>
                <Link href="/#curricula-pathways" className={footerLinkClass}>
                  IEB Pathway
                </Link>
              </li>
              <li>
                <Link href="/#curricula-pathways" className={footerLinkClass}>
                  American NCAA Stream
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/#how-it-works" className={footerLinkClass}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#academy-benefits" className={footerLinkClass}>
                  Academy Benefits
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className={footerLinkClass}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/login" className={footerLinkClass}>
                  Student &amp; Parent Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/why-us" className={footerLinkClass}>
                  Why Us
                </Link>
              </li>
              <li>
                <Link href="/ai-tutor" className={footerLinkClass}>
                  AI Tutor
                </Link>
              </li>
              <li>
                <Link href="/our-story" className={footerLinkClass}>
                  Our Story &amp; Philosophy
                </Link>
              </li>
              <li>
                <Link href="/blog" className={footerLinkClass}>
                  Blog &amp; Insights
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLinkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLinkClass}>
                  Contact &amp; Admissions
                </Link>
              </li>
              <li>
                <Link href="/courses" className={footerLinkClass}>
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="font-semibold text-indigo-300 transition-all duration-200 hover:text-white active:scale-[0.98]"
                >
                  Create Account →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {year} Aalgorix World Academy. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Inspired by CambriLearn workflows · Privacy · Terms
          </p>
        </div>
      </div>
    </footer>
  );
}
