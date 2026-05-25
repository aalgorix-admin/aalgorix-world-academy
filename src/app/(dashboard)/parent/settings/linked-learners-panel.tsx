"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { unlinkStudent } from "./actions";

export type LinkedLearner = {
  id: string;
  full_name: string | null;
  email: string;
};

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h8M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m2 0v9.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 15.5V6m3 3.5v4m2-4v4"
      />
    </svg>
  );
}

function LinkedLearnerRow({
  child,
  onUnlinked,
}: {
  child: LinkedLearner;
  onUnlinked: (message: string | null) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    const displayName = child.full_name?.trim() || child.email;
    const confirmed = window.confirm(
      `Remove the link to ${displayName}? They will no longer appear on your parent dashboard until linked again.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      onUnlinked(null);
      const result = await unlinkStudent(child.id);
      if (result.ok) {
        onUnlinked(`${displayName} was unlinked from your account.`);
        router.refresh();
      } else {
        onUnlinked(result.error ?? "Could not remove link.");
      }
    });
  }

  return (
    <li
      className={`flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-opacity duration-150 ${
        isPending ? "pointer-events-none opacity-45" : "opacity-100"
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          {child.full_name?.trim() || "Unnamed learner"}
        </p>
        <p className="truncate text-xs text-slate-500">{child.email}</p>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors duration-150 hover:text-rose-600 disabled:cursor-not-allowed"
        aria-label={`Remove link to ${child.full_name?.trim() || child.email}`}
      >
        <TrashIcon />
        <span className="hidden sm:inline">{isPending ? "Removing…" : "Remove link"}</span>
      </button>
    </li>
  );
}

export function LinkedLearnersPanel({
  linkedChildren,
}: {
  linkedChildren: LinkedLearner[];
}) {
  const [banner, setBanner] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Your linked learners</h2>
      <p className="mt-2 text-sm text-slate-600">
        Manage students connected to this parent account. Removing a link revokes dashboard
        access for that learner until a new code is redeemed.
      </p>

      {banner ? (
        <p
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            banner.toLowerCase().includes("could not") ||
            banner.toLowerCase().includes("invalid")
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {banner}
        </p>
      ) : null}

      {linkedChildren.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
          No linked learners registered to this account profile yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {linkedChildren.map((child) => (
            <LinkedLearnerRow key={child.id} child={child} onUnlinked={setBanner} />
          ))}
        </ul>
      )}
    </section>
  );
}
