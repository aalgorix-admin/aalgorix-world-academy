import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Donate — Support Aalgorix World Academy",
  description:
    "Support access to structured learning, AI tutoring, and life-skills coaching. Donate to help more learners thrive.",
};

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children;
}

