"use client";

import Link from "next/link";
import { useState } from "react";

import type { CurriculumModule, LessonStatus } from "@/lib/student/curriculum-types";

export type { CurriculumModule, CurriculumLesson, LessonStatus } from "@/lib/student/curriculum-types";

export type CurriculumSidebarProps = {
  courseId: string;
  activeLessonId: string;
  courseTitle: string;
  completionPercent: number;
  modules: CurriculumModule[];
};

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.5a1 1 0 0 1-1.435.02L3.29 9.835a1 1 0 1 1 1.42-1.408l3.323 3.385 6.54-6.772a1 1 0 0 1 1.432-.01Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (status === "unlocked") {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
        aria-hidden
      >
        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
          <path d="M6.5 4.5v11l8-5.5-8-5.5Z" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 2a4 4 0 0 0-4 4v2H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4Zm-2 4V6a2 2 0 1 1 4 0v2H8Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 1.06.02l3.25-3.5a.75.75 0 0 1 0-1.02l-3.25-3.5a.75.75 0 0 1-1.08 1.04L9.58 10l-2.45 2.73a.75.75 0 0 1-.02 1.04Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CurriculumSidebar({
  courseId,
  activeLessonId,
  courseTitle,
  completionPercent,
  modules,
}: CurriculumSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        modules.map((module) => [
          module.id,
          module.lessons.some((lesson) => lesson.id === activeLessonId),
        ]),
      ),
  );

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:border-b-0 lg:border-r">
      <div className="shrink-0 border-b border-slate-100 px-4 py-5 dark:border-slate-800 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Course
        </p>
        <h2 className="mt-1 text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
          {courseTitle}
        </h2>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span className="tabular-nums text-slate-700 dark:text-slate-300">
              {completionPercent}%
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-[width] duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4"
        aria-label="Course curriculum"
      >
        <ul className="space-y-1">
          {modules.map((module) => {
            const expanded = expandedModules[module.id] ?? false;

            return (
              <li key={module.id}>
                <button
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  aria-expanded={expanded}
                >
                  <Chevron expanded={expanded} />
                  <span className="min-w-0 flex-1 truncate">{module.title}</span>
                  <span className="shrink-0 text-xs font-medium text-slate-400 tabular-nums">
                    {module.lessons.length}
                  </span>
                </button>

                {expanded ? (
                  <ul className="mb-2 ml-2 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-700">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isLocked = lesson.status === "locked";
                      const href = `/student/courses/${courseId}/lessons/${lesson.id}`;

                      if (isLocked) {
                        return (
                          <li key={lesson.id}>
                            <span
                              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-400 dark:text-slate-500"
                              aria-disabled="true"
                            >
                              <StatusIcon status={lesson.status} />
                              <span className="min-w-0 flex-1 truncate">
                                {lesson.title}
                              </span>
                            </span>
                          </li>
                        );
                      }

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-indigo-50 font-medium text-indigo-900 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-100 dark:ring-indigo-800"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                            }`}
                          >
                            <StatusIcon status={lesson.status} />
                            <span className="min-w-0 flex-1 truncate">
                              {lesson.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
