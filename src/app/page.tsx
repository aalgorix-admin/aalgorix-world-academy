import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
        Aalgorix World Academy
      </h1>
      <p className="max-w-lg text-lg text-slate-600 dark:text-slate-400">
        Premium online education — sign in or create an account to get started.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
