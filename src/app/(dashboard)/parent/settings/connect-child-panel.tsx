"use client";

import { useActionState } from "react";

import {
  connectChildWithLinkCode,
  type ConnectChildActionState,
} from "./actions";

const initialState: ConnectChildActionState | null = null;

const fieldInputClassName =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase tracking-[0.25em] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20";

const fieldLabelClassName =
  "block text-xs font-medium uppercase tracking-wide text-slate-500";

const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";

export function ConnectChildPanel() {
  const [state, formAction, pending] = useActionState(
    connectChildWithLinkCode,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Connect a student</h2>
      <p className="mt-2 text-sm text-slate-600">
        Enter the 6-character code your child generated in their student settings.
        A successful match creates a row in{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">student_parent_relations</code>{" "}
        and unlocks their dashboard on your parent home.
      </p>

      <form action={formAction} className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="link_code" className={fieldLabelClassName}>
            Parent link code
          </label>
          <input
            id="link_code"
            name="link_code"
            required
            minLength={6}
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
            placeholder="ABC123"
            className={fieldInputClassName}
          />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClassName}>
          {pending ? "Verifying…" : "Link student"}
        </button>
      </form>

      {state && !state.ok && state.error ? (
        <p className="mt-4 text-sm text-rose-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok && state.message ? (
        <p className="mt-4 text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
