"use client";

import { useActionState, useState, useTransition, type FormEvent } from "react";

import { formatExpiryLabel } from "@/lib/parent-link/codes";

import {
  generateParentLinkCodeAction,
  unlinkParentGuardian,
  updateStudentPassport,
  type ParentLinkActionState,
} from "./actions";
import {
  formatAccountAnniversary,
  profileInitials,
  type LinkedParentGuardian,
  type StudentProfileData,
} from "./types";

type ProfileFormProps = {
  profile: StudentProfileData;
  linkedParents: LinkedParentGuardian[];
};

type ProfileTab = "basics" | "address" | "academic" | "family";

const tabs: { id: ProfileTab; label: string; hint: string }[] = [
  { id: "basics", label: "Profile basics", hint: "Identity & biography" },
  { id: "address", label: "Residential address", hint: "Contact & location" },
  { id: "academic", label: "Academic status", hint: "Cohort & history" },
  { id: "family", label: "Family connection", hint: "Parent guardian link" },
];

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const labelClassName = "text-xs font-bold uppercase tracking-widest text-slate-600";

const readOnlyCardClassName =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3";

const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex items-center justify-center rounded-xl border-2 border-slate-800 px-4 py-2.5 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const parentLinkInitialState: ParentLinkActionState | null = null;

export function ProfileForm({ profile, linkedParents }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("basics");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [unlinkMessage, setUnlinkMessage] = useState<string | null>(null);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [unlinkPending, startUnlinkTransition] = useTransition();

  const [parentLinkState, parentLinkFormAction, parentLinkPending] = useActionState(
    generateParentLinkCodeAction,
    parentLinkInitialState,
  );

  const meta = profile.metadata;
  const address = meta.address ?? {
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  };

  const initials = profileInitials(profile.full_name, profile.email);

  function handlePassportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateStudentPassport(formData);
      if (result.ok) {
        setSaveMessage(result.message ?? "Saved.");
      } else {
        setSaveError(result.error ?? "Unable to save passport.");
      }
    });
  }

  function handleUnlink(parentId: string) {
    setUnlinkMessage(null);
    setUnlinkError(null);
    startUnlinkTransition(async () => {
      const result = await unlinkParentGuardian(parentId);
      if (result.ok) {
        setUnlinkMessage(result.message ?? "Parent unlinked.");
      } else {
        setUnlinkError(result.error ?? "Unable to unlink parent.");
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <nav
          className="border-b border-slate-200 bg-slate-50/80 p-4 lg:w-64 lg:border-b-0 lg:border-r lg:p-5"
          aria-label="Passport sections"
        >
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full rounded-xl px-4 py-3 text-left transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-700 hover:bg-white/70"
                    }`}
                  >
                    <span className="block text-sm font-bold">{tab.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{tab.hint}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 p-5 sm:p-8">
          <form onSubmit={handlePassportSubmit}>
            <section
              aria-labelledby="tab-basics-heading"
              className={`space-y-6 ${activeTab === "basics" ? "" : "hidden"}`}
            >
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-slate-800 bg-gradient-to-br from-indigo-100 to-violet-100 text-3xl font-extrabold tracking-tight text-slate-900"
                    aria-hidden
                  >
                    {initials}
                  </div>
                  <div>
                    <h2
                      id="tab-basics-heading"
                      className="text-xl font-extrabold tracking-tight text-slate-900"
                    >
                      Profile basics
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Identity markers displayed across your academy passport.
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="full_name" className={labelClassName}>
                    Full name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={profile.full_name ?? ""}
                    autoComplete="name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="date_of_birth" className={labelClassName}>
                    Date of birth
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={profile.date_of_birth ?? ""}
                    className={inputClassName}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gender" className={labelClassName}>
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      defaultValue={meta.gender ?? ""}
                      className={inputClassName}
                    >
                      <option value="">Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nationality" className={labelClassName}>
                      Nationality
                    </label>
                    <input
                      id="nationality"
                      name="nationality"
                      type="text"
                      defaultValue={meta.nationality ?? ""}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className={labelClassName}>
                    Biography
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    defaultValue={meta.bio ?? ""}
                    placeholder="Share academic interests, achievements, or learning goals…"
                    className={`${inputClassName} resize-y`}
                  />
                </div>
            </section>

            <section
              aria-labelledby="tab-address-heading"
              className={`space-y-6 ${activeTab === "address" ? "" : "hidden"}`}
            >
                <div>
                  <h2
                    id="tab-address-heading"
                    className="text-xl font-extrabold tracking-tight text-slate-900"
                  >
                    Residential address
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Contact phone and structured address stored in your passport metadata.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClassName}>
                    Contact phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone ?? ""}
                    autoComplete="tel"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="address_street" className={labelClassName}>
                    Street address
                  </label>
                  <input
                    id="address_street"
                    name="address_street"
                    type="text"
                    defaultValue={address.street ?? ""}
                    autoComplete="street-address"
                    className={inputClassName}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="address_city" className={labelClassName}>
                      City
                    </label>
                    <input
                      id="address_city"
                      name="address_city"
                      type="text"
                      defaultValue={address.city ?? ""}
                      autoComplete="address-level2"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="address_state" className={labelClassName}>
                      State / province
                    </label>
                    <input
                      id="address_state"
                      name="address_state"
                      type="text"
                      defaultValue={address.state ?? ""}
                      autoComplete="address-level1"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="address_postal_code" className={labelClassName}>
                      Postal code
                    </label>
                    <input
                      id="address_postal_code"
                      name="address_postal_code"
                      type="text"
                      defaultValue={address.postal_code ?? ""}
                      autoComplete="postal-code"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="address_country" className={labelClassName}>
                      Country
                    </label>
                    <input
                      id="address_country"
                      name="address_country"
                      type="text"
                      defaultValue={address.country ?? ""}
                      autoComplete="country-name"
                      className={inputClassName}
                    />
                  </div>
                </div>
            </section>

            <section
              aria-labelledby="tab-academic-heading"
              className={`space-y-6 ${activeTab === "academic" ? "" : "hidden"}`}
            >
                <div>
                  <h2
                    id="tab-academic-heading"
                    className="text-xl font-extrabold tracking-tight text-slate-900"
                  >
                    Academic status
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Official account records and prior schooling history.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={readOnlyCardClassName}>
                    <p className={labelClassName}>Registration email</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {profile.email}
                    </p>
                  </div>
                  <div className={readOnlyCardClassName}>
                    <p className={labelClassName}>Account joining anniversary</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatAccountAnniversary(profile.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="batch_enrolled" className={labelClassName}>
                    Batch enrolled cohort
                  </label>
                  <input
                    id="batch_enrolled"
                    name="batch_enrolled"
                    type="text"
                    defaultValue={meta.batch_enrolled ?? ""}
                    placeholder="e.g. Cohort 2026-A"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="previous_school" className={labelClassName}>
                    Previous school
                  </label>
                  <input
                    id="previous_school"
                    name="previous_school"
                    type="text"
                    defaultValue={meta.previous_school ?? ""}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="highest_grade" className={labelClassName}>
                    Highest grade completed
                  </label>
                  <input
                    id="highest_grade"
                    name="highest_grade"
                    type="text"
                    defaultValue={meta.highest_grade ?? ""}
                    placeholder="e.g. Grade 9"
                    className={inputClassName}
                  />
                </div>
            </section>

            {activeTab !== "family" ? (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className={primaryButtonClassName}
                >
                  {isPending ? "Saving passport…" : "Save passport changes"}
                </button>
                {saveMessage ? (
                  <p className="text-sm font-medium text-emerald-700" role="status">
                    {saveMessage}
                  </p>
                ) : null}
                {saveError ? (
                  <p className="text-sm text-rose-600" role="alert">
                    {saveError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </form>

          {activeTab === "family" ? (
            <section aria-labelledby="tab-family-heading" className="space-y-6">
              <div>
                <h2
                  id="tab-family-heading"
                  className="text-xl font-extrabold tracking-tight text-slate-900"
                >
                  Family connection node
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Link a parent guardian for dashboard oversight, or generate a
                  temporary 24-hour connection code.
                </p>
              </div>

              {linkedParents.length > 0 ? (
                <ul className="space-y-4">
                  {linkedParents.map((parent) => {
                    const parentName = parent.full_name?.trim() || parent.email;
                    return (
                      <li
                        key={parent.id}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
                      >
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                          Verified guardian
                        </p>
                        <p className="mt-2 text-sm font-semibold text-emerald-950">
                          Linked Parent Guardian: {parentName} ({parent.email})
                        </p>
                        <button
                          type="button"
                          disabled={unlinkPending}
                          onClick={() => handleUnlink(parent.id)}
                          className={`${secondaryButtonClassName} mt-4 border-rose-800 text-rose-900 hover:bg-rose-50`}
                        >
                          {unlinkPending ? "Removing link…" : "Unlink parent guardian"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    No parent guardian linked
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Generate a secure code below for your parent to enter in their
                    settings portal.
                  </p>
                </div>
              )}

              {unlinkMessage ? (
                <p className="text-sm font-medium text-emerald-700" role="status">
                  {unlinkMessage}
                </p>
              ) : null}
              {unlinkError ? (
                <p className="text-sm text-rose-600" role="alert">
                  {unlinkError}
                </p>
              ) : null}

              <div className="rounded-xl border border-slate-200 bg-[#fafafa] p-5">
                <h3 className="text-sm font-bold text-slate-900">
                  24-hour parent link code
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Generates a one-time code your parent enters in parent settings.
                  Previous unused codes are invalidated.
                </p>

                <form action={parentLinkFormAction} className="mt-4">
                  <button
                    type="submit"
                    disabled={parentLinkPending}
                    className={primaryButtonClassName}
                  >
                    {parentLinkPending ? "Generating…" : "Generate parent link code"}
                  </button>
                </form>

                {parentLinkState && !parentLinkState.ok && parentLinkState.error ? (
                  <p className="mt-4 text-sm text-rose-600" role="alert">
                    {parentLinkState.error}
                  </p>
                ) : null}

                {parentLinkState?.ok && parentLinkState.code ? (
                  <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                      Active code — copy now
                    </p>
                    <p
                      className="mt-3 font-mono text-4xl font-extrabold tracking-[0.35em] text-indigo-900"
                      aria-label={`Link code ${parentLinkState.code}`}
                    >
                      {parentLinkState.code}
                    </p>
                    {parentLinkState.expiresAt ? (
                      <p className="mt-2 text-sm text-indigo-800">
                        Expires {formatExpiryLabel(parentLinkState.expiresAt)}
                      </p>
                    ) : null}
                    {parentLinkState.message ? (
                      <p className="mt-2 text-sm text-indigo-700">
                        {parentLinkState.message}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
