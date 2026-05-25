import Link from "next/link";
import type { ReactNode } from "react";

type ActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

export function ActionCard({ href, title, description, icon }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md active:scale-[0.98]"
    >
      {icon ? (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <span className="mt-4 text-sm font-semibold text-indigo-600">Open →</span>
    </Link>
  );
}
