import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog & Insights | Aalgorix World Academy",
  description:
    "Expert perspectives on AI-powered learning, homeschooling, life skills, and future-ready education for families.",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
