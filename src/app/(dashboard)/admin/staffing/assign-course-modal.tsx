"use client";

import { useActionState, useEffect, useState } from "react";

import {
  linkTeacherToCourse,
  removeTeacherFromCourse,
  type StaffingActionState,
} from "./actions";
import {
  dangerButtonClassName,
  fieldInputClassName,
  fieldLabelClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "./form-classes";
import type { PublishedCourseOption, StaffProfile, TeacherCourseAssignment } from "./types";

type AssignCourseModalProps = {
  open: boolean;
  onClose: () => void;
  teacher: StaffProfile | null;
  assignments: TeacherCourseAssignment[];
  publishedCourses: PublishedCourseOption[];
  onSuccess?: (message: string) => void;
};

const initialState: StaffingActionState | null = null;

function formatAssignedDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AssignCourseModal({
  open,
  onClose,
  teacher,
  assignments,
  publishedCourses,
  onSuccess,
}: AssignCourseModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [linkState, linkAction, linkPending] = useActionState(
    linkTeacherToCourse,
    initialState,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeTeacherFromCourse,
    initialState,
  );

  const teacherAssignments = teacher
    ? assignments.filter((row) => row.teacher_id === teacher.id)
    : [];

  const assignedCourseIds = new Set(teacherAssignments.map((row) => row.course_id));

  const availableCourses = publishedCourses.filter(
    (course) => !assignedCourseIds.has(course.id),
  );

  useEffect(() => {
    if (!open) {
      setSelectedCourseId("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const success = linkState?.ok ? linkState : removeState?.ok ? removeState : null;
    if (success?.message) {
      onSuccess?.(success.message);
      setSelectedCourseId("");
    }
  }, [linkState, removeState, onSuccess]);

  if (!open || !teacher) return null;

  const feedback =
    (linkState && !linkState.ok ? linkState.error : null) ??
    (removeState && !removeState.ok ? removeState.error : null);

  const isTeacherRole = teacher.role === "teacher";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-course-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Course allocation
          </p>
          <h2
            id="assign-course-title"
            className="mt-1 text-lg font-semibold tracking-tight text-slate-900"
          >
            {teacher.full_name?.trim() || teacher.email}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
          {!isTeacherRole ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              This account is registered as <strong>{teacher.role}</strong>. Only
              teacher-role profiles can receive course allocations.
            </p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {feedback ? (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {feedback}
            </p>
          ) : null}

          <section aria-labelledby="active-assignments-heading">
            <h3
              id="active-assignments-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Active course assignments
            </h3>
            {teacherAssignments.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                No courses assigned yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {teacherAssignments.map((assignment) => (
                  <li
                    key={assignment.course_id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {assignment.course.title}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        /{assignment.course.slug}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Assigned {formatAssignedDate(assignment.assigned_at)}
                      </p>
                    </div>
                    <form action={removeAction}>
                      <input type="hidden" name="teacher_id" value={teacher.id} />
                      <input type="hidden" name="course_id" value={assignment.course_id} />
                      <button
                        type="submit"
                        disabled={removePending || !isTeacherRole}
                        className={dangerButtonClassName}
                      >
                        Remove
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8" aria-labelledby="link-course-heading">
            <h3 id="link-course-heading" className="text-sm font-semibold text-slate-900">
              Attach published course
            </h3>
            <form action={linkAction} className="mt-3 space-y-3">
              <input type="hidden" name="teacher_id" value={teacher.id} />
              <div>
                <label htmlFor="course-select" className={fieldLabelClassName}>
                  Published course
                </label>
                <select
                  id="course-select"
                  name="course_id"
                  required
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                  disabled={!isTeacherRole || availableCourses.length === 0}
                  className={fieldInputClassName}
                >
                  <option value="">
                    {availableCourses.length === 0
                      ? "All published courses are already assigned"
                      : "Select a course…"}
                  </option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.slug})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={
                  linkPending || !isTeacherRole || !selectedCourseId || availableCourses.length === 0
                }
                className={primaryButtonClassName}
              >
                {linkPending ? "Linking…" : "Link course to teacher"}
              </button>
            </form>
          </section>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" className={secondaryButtonClassName} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
