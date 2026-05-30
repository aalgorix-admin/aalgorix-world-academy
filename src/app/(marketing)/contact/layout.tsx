import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact & Admissions — Aalgorix World Academy",
  description:
    "Connect with our global admissions concierge to design customized pacing, international curriculum compliance, and milestone pathways for your child.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
