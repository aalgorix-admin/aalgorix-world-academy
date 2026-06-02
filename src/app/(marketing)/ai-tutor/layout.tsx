import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Tutor — Personalised Learning for Grades 3–12",
  description:
    "Explore Aalgorix's AI Tutor: personalised learning paths, instant feedback, progress visibility for parents, and a simple mastery loop (assess → teach → practice → track).",
};

export default function AiTutorLayout({ children }: { children: ReactNode }) {
  return children;
}

