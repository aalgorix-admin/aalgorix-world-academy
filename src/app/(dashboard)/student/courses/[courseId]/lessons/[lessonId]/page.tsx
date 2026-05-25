import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { fetchStudentWorkspace, toSidebarModules } from "@/lib/student/workspace";

import { CurriculumSidebar } from "./curriculum-sidebar";
import { LessonWorkspace } from "./lesson-workspace";

export default async function StudentLessonWorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ courseId: string; lessonId: string }>;
}>) {
  const { courseId, lessonId } = await params;
  const result = await fetchStudentWorkspace(courseId, lessonId);

  if (result.error === "unauthenticated") {
    redirect(`/login?next=/student/courses/${courseId}/lessons/${lessonId}`);
  }

  if (result.error === "not_enrolled") {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Course access required</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          You need an active enrollment for this course before opening the lesson workspace.
          Contact your parent or school administrator to be enrolled.
        </p>
        <Link
          href="/student"
          className="mt-6 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to student home
        </Link>
      </main>
    );
  }

  if (result.error === "not_found" || !result.data) {
    notFound();
  }

  const workspace = result.data;
  const activeLesson = workspace.activeLesson;
  const resolvedLessonId = activeLesson.id;

  if (resolvedLessonId !== lessonId) {
    redirect(`/student/courses/${courseId}/lessons/${resolvedLessonId}`);
  }

  return (
    <div className="flex min-h-[calc(100dvh-0px)] flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M11.78 4.22a.75.75 0 0 1 0 1.06L8.06 9h7.19a.75.75 0 0 1 0 1.5H8.06l3.72 3.72a.75.75 0 0 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back to student home
        </Link>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1 lg:sticky lg:top-0 lg:max-h-[calc(100dvh-2.5rem)] lg:self-start">
          <CurriculumSidebar
            courseId={workspace.courseId}
            activeLessonId={resolvedLessonId}
            courseTitle={workspace.courseTitle}
            completionPercent={workspace.completionPercent}
            modules={toSidebarModules(workspace.modules)}
          />
        </div>

        <div className="flex min-h-0 flex-col bg-slate-50 dark:bg-slate-950 lg:col-span-3">
          <LessonWorkspace
            courseId={workspace.courseId}
            lessonId={resolvedLessonId}
            enrollmentId={workspace.enrollmentId}
            assignmentId={workspace.assignmentId}
            lessonTitle={activeLesson.title}
            videoSrc={activeLesson.videoSrc}
            worksheetUrl={activeLesson.worksheetUrl}
            worksheetFileName={activeLesson.worksheetFileName}
            initialCompleted={activeLesson.completed}
            lessonLocked={activeLesson.status === "locked"}
          />
        </div>
      </div>
    </div>
  );
}
