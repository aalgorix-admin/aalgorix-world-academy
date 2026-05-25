"use client";

import { useActionState, useEffect, useState } from "react";

import { createCourse, type CatalogActionState } from "./actions";
import {
  fieldInputClassName,
  fieldLabelClassName,
  fieldTextareaClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "./form-classes";

type CreateCourseModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

const initialState: CatalogActionState | null = null;

export function CreateCourseModal({
  open,
  onClose,
  onSuccess,
}: CreateCourseModalProps) {
  const [state, formAction, pending] = useActionState(createCourse, initialState);
  const [unlockStrategy, setUnlockStrategy] = useState("sequential");

  useEffect(() => {
    if (state?.ok) {
      onSuccess?.(state.message ?? "Course created.");
      onClose();
    }
  }, [state, onClose, onSuccess]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-course-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[min(90dvh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          <h2
            id="create-course-title"
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Create new course
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Adds a row to <code className="text-xs">courses</code>. Modules and lessons
            can be attached after creation.
          </p>
        </div>

        <form action={formAction} className="space-y-4 px-6 py-5">
          {state && !state.ok && state.error ? (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {state.error}
            </p>
          ) : null}

          <div>
            <label htmlFor="course-title" className={fieldLabelClassName}>
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="course-title"
              name="title"
              required
              className={fieldInputClassName}
              placeholder="Introduction to Python"
            />
          </div>

          <div>
            <label htmlFor="course-slug" className={fieldLabelClassName}>
              Slug
            </label>
            <input
              id="course-slug"
              name="slug"
              className={fieldInputClassName}
              placeholder="intro-python (auto-generated if empty)"
            />
          </div>

          <div>
            <label htmlFor="course-description" className={fieldLabelClassName}>
              Description
            </label>
            <textarea
              id="course-description"
              name="description"
              className={fieldTextareaClassName}
              placeholder="Short overview for catalog listings"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="course-grade" className={fieldLabelClassName}>
                Grade level
              </label>
              <input
                id="course-grade"
                name="grade_level"
                className={fieldInputClassName}
                placeholder="Grade 10"
              />
            </div>
            <div>
              <label htmlFor="course-curriculum" className={fieldLabelClassName}>
                Curriculum tag
              </label>
              <input
                id="course-curriculum"
                name="curriculum_tag"
                className={fieldInputClassName}
                placeholder="CAPS, Cambridge, IGCSE"
              />
            </div>
          </div>

          <div>
            <label htmlFor="course-thumbnail" className={fieldLabelClassName}>
              Thumbnail URL
            </label>
            <input
              id="course-thumbnail"
              name="thumbnail_url"
              type="url"
              className={fieldInputClassName}
              placeholder="https://…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="unlock-strategy" className={fieldLabelClassName}>
                Unlock strategy
              </label>
              <select
                id="unlock-strategy"
                name="unlock_strategy"
                value={unlockStrategy}
                onChange={(event) => setUnlockStrategy(event.target.value)}
                className={fieldInputClassName}
              >
                <option value="sequential">Sequential</option>
                <option value="all_at_once">All at once</option>
                <option value="drip">Drip schedule</option>
                <option value="manual">Manual unlock</option>
              </select>
            </div>
            {unlockStrategy === "drip" ? (
              <div>
                <label htmlFor="drip-days" className={fieldLabelClassName}>
                  Drip interval (days)
                </label>
                <input
                  id="drip-days"
                  name="drip_interval_days"
                  type="number"
                  min={1}
                  className={fieldInputClassName}
                  placeholder="7"
                />
              </div>
            ) : null}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              name="is_published"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
            />
            Publish immediately
          </label>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button type="button" className={secondaryButtonClassName} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={primaryButtonClassName}>
              {pending ? "Creating…" : "Create course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
