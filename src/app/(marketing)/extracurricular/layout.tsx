import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Extracurricular — Life Coach & Talent Support | Aalgorix World Academy",
  description:
    "Beyond academics: life coach support for discipline and executive function, plus talent support for music, sport, gaming, and portfolio growth from home.",
};

export default function ExtracurricularLayout({ children }: { children: ReactNode }) {
  return children;
}
