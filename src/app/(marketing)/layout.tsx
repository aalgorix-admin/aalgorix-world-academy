import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aalgorix World Academy — Accredited Online Schooling",
  description:
    "One academy, six accredited curricula pathways. Internationally recognized schooling with specialist teachers for homeschooling, athletes, and global families.",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-white text-slate-900">{children}</div>
  );
}
