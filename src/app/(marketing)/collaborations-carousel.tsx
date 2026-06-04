const PARTNERS = [
  { name: "Canva", iconSlug: "canva", accent: "00C4CC", glow: "rgba(0,196,204,0.35)" },
  { name: "Claude", iconSlug: "anthropic", accent: "D97757", glow: "rgba(217,119,87,0.35)" },
  { name: "ChatGPT", iconSlug: "openai", accent: "10A37F", glow: "rgba(16,163,127,0.35)" },
  { name: "Gemini", iconSlug: "googlegemini", accent: "8E75B2", glow: "rgba(142,117,178,0.35)" },
  { name: "Copilot", iconSlug: "githubcopilot", accent: "0066FF", glow: "rgba(0,102,255,0.35)" },
  { name: "NotebookLM", iconSlug: "google", accent: "4285F4", glow: "rgba(66,133,244,0.35)" },
] as const;

/** Duplicated for seamless horizontal loop */
const MARQUEE_LOOP = [...PARTNERS, ...PARTNERS];

function PartnerCard({ partner }: { partner: (typeof PARTNERS)[number] }) {
  const iconSrc = `https://cdn.simpleicons.org/${partner.iconSlug}/${partner.accent}`;

  return (
    <div
      className="collaboration-marquee-card flex shrink-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-5 py-3.5 ring-1 ring-slate-200/80 backdrop-blur-sm"
      style={{
        boxShadow: `0 16px 32px -12px ${partner.glow}, 0 4px 12px rgba(15,23,42,0.08)`,
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12"
        style={{ backgroundColor: `#${partner.accent}14` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          width={28}
          height={28}
          className="h-6 w-6 object-contain sm:h-7 sm:w-7"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-800 sm:text-base">
        {partner.name}
      </span>
    </div>
  );
}

type CollaborationsCarouselProps = {
  className?: string;
};

export function CollaborationsCarousel({ className = "" }: CollaborationsCarouselProps) {
  return (
    <section
      className={`border-y border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-14 sm:py-18 ${className}`}
      aria-labelledby="collaborations-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          id="collaborations-heading"
          className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600"
        >
          Our Collaborations
        </p>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">
          Tools and platforms we integrate with to power learning at home
        </p>

        <div className="collaboration-marquee-scene relative mx-auto mt-10 w-full max-w-6xl">
          <div className="collaboration-marquee-row">
            <div className="collaboration-marquee-track collaboration-marquee-track-left flex w-max gap-5">
              {MARQUEE_LOOP.map((partner, index) => (
                <PartnerCard key={`${partner.name}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>

        <ul className="collaboration-fallback mt-8 flex flex-wrap items-center justify-center gap-3">
          {PARTNERS.map((partner) => (
            <li
              key={`fallback-${partner.name}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {partner.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
