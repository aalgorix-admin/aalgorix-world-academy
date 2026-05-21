import { Suspense } from "react";

import { LoginForm } from "./login-form";

function LoginFallback() {
  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
