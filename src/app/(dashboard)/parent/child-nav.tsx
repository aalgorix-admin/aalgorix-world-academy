import Link from "next/link";

import type { LinkedChild } from "./types";

type ChildNavProps = {
  linkedChildren: LinkedChild[];
  activeChildId: string;
};

export function ChildNav({ linkedChildren, activeChildId }: ChildNavProps) {
  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-slate-200 pb-1"
      aria-label="Linked students"
    >
      {linkedChildren.map((child) => {
        const isActive = child.id === activeChildId;
        const label = child.full_name?.trim() || child.email;
        return (
          <Link
            key={child.id}
            href={`/parent?child=${child.id}`}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-t-lg px-4 py-3 text-sm font-bold tracking-tight transition-colors duration-200 active:scale-[0.98] ${
              isActive
                ? "border border-b-0 border-slate-200 bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
