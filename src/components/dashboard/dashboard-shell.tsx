import type { ReactNode } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function DashboardShell({
  eyebrow,
  title,
  subtitle,
  children,
}: DashboardShellProps) {
  return (
    <main className="min-h-full bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base text-slate-600">{subtitle}</p>
          ) : null}
        </header>

        {children}

        <div className="mt-12 border-t border-slate-200 pt-8">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
