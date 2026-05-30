import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ — Aalgorix World Academy",
  description:
    "Quick answers about AI Tutor, personalised learning, life skills, and admissions at Aalgorix World Academy.",
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
