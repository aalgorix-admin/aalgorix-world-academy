import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Why Aalgorix — Homeschooling with Outcomes You Can See",
  description:
    "Discover why families choose Aalgorix World Academy: AI Tutor, industry-trained faculty, IA 441 accreditation, life-skills coaching, and structured homeschooling from Grade 3 to 12.",
};

export default function WhyUsLayout({ children }: { children: ReactNode }) {
  return children;
}
