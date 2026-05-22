"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import {
  authInputClassName,
  authPrimaryButtonClassName,
} from "@/components/auth/auth-field-classes";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      },
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email linked to your academy account"
      footer={
        <>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      {submitted ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100"
        >
          <p className="font-medium">Check your inbox</p>
          <p className="mt-1 text-emerald-200/90">
            If an account exists, a secure reset link has been sent to your
            inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClassName}
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={authPrimaryButtonClassName}
          >
            {loading ? "Sending link…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
