import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Parent Portal — Dashboard & Family Oversight | Aalgorix World Academy",
  description:
    "See what parents get with Aalgorix: linked learners, course progress, grades, teacher feedback, report cards, and calm accountability from one dashboard.",
};

export default function ParentPortalLayout({ children }: { children: ReactNode }) {
  return children;
}
