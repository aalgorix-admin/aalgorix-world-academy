import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Story & Philosophy — Aalgorix World Academy",
  description:
    "Discover why Aalgorix World Academy was built for global families: holistic elite education, human mentors, and an AI cognitive tutor designed for an algorithmic tomorrow.",
};

export default function OurStoryLayout({ children }: { children: ReactNode }) {
  return children;
}
