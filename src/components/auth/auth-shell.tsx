import Link from "next/link";
import type { ReactNode } from "react";

import { marketingUrl } from "@/lib/domains";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href={marketingUrl("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200/90 transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-base font-bold text-indigo-100 ring-1 ring-indigo-400/30">
              A
            </span>
            Aalgorix World Academy
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
          </div>

          {children}
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </div>
    </div>
  );
}
