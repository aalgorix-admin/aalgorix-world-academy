import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Academics — Grade 3 to 12 Pathway | Aalgorix World Academy",
  description:
    "Explore Aalgorix academics: Cambridge International Affiliation (CAIE) accreditation, learning bands Grade 3–12, talent farming, languages, life skills, and competitive enrichment for homeschoolers.",
};

export default function AcademicsLayout({ children }: { children: ReactNode }) {
  return children;
}
