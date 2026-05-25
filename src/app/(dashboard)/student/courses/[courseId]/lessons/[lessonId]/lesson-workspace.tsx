"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  submitHomework,
  toggleLessonProgress,
  type StudentLessonActionState,
} from "./actions";

export type LessonWorkspaceProps = {
  courseId: string;
  lessonId: string;
  enrollmentId: string;
  assignmentId: string | null;
  lessonTitle: string;
  videoSrc: string | null;
  worksheetUrl: string | null;
  worksheetFileName: string | null;
  initialCompleted: boolean;
  lessonLocked: boolean;
};

const initialActionState: StudentLessonActionState | null = null;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LessonWorkspace({
  courseId,
  lessonId,
  enrollmentId,
  assignmentId,
  lessonTitle,
  videoSrc,
  worksheetUrl,
  worksheetFileName,
  initialCompleted,
  lessonLocked,
}: LessonWorkspaceProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [progressState, progressAction, progressPending] = useActionState(
    toggleLessonProgress,
    initialActionState,
  );
  const [submitState, submitAction, submitPending] = useActionState(
    submitHomework,
    initialActionState,
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  useEffect(() => {
    if (!progressState?.ok) return;
    if (progressState.message?.toLowerCase().includes("cleared")) {
      setCompleted(false);
    } else {
      setCompleted(true);
    }
    router.refresh();
  }, [progressState, router]);

  useEffect(() => {
    if (submitState?.ok) {
      setSelectedFiles([]);
      router.refresh();
    }
  }, [submitState, router]);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    setSelectedFiles((prev) => {
      const names = new Set(prev.map((file) => file.name));
      const merged = [...prev];
      for (const file of incoming) {
        if (!names.has(file.name)) merged.push(file);
      }
      return merged;
    });
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleHomeworkSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("files");
    for (const file of selectedFiles) {
      formData.append("files", file);
    }
    submitAction(formData);
  }

  const feedback = progressState?.error ?? submitState?.error;
  const success =
    progressState?.ok && !progressState.error
      ? progressState.message
      : submitState?.ok && !submitState.error
        ? submitState.message
        : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Lesson
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {lessonTitle}
            </h1>
          </div>

          <form action={progressAction}>
            <input type="hidden" name="course_id" value={courseId} />
            <input type="hidden" name="lesson_id" value={lessonId} />
            <input type="hidden" name="enrollment_id" value={enrollmentId} />
            <input type="hidden" name="completed" value={completed ? "false" : "true"} />
            <button
              type="submit"
              disabled={progressPending || lessonLocked}
              className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                completed
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500"
              }`}
            >
              {progressPending ? (
                "Saving…"
              ) : completed ? (
                <>
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.5a1 1 0 0 1-1.435.02L3.29 9.835a1 1 0 1 1 1.42-1.408l3.323 3.385 6.54-6.772a1 1 0 0 1 1.432-.01Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lesson Completed
                </>
              ) : (
                "Mark Lesson Completed"
              )}
            </button>
          </form>
        </div>

        {feedback ? (
          <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">
            {feedback}
          </p>
        ) : null}
        {success && !feedback ? (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
            {success}
          </p>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <section aria-labelledby="lesson-video-heading">
            <h2 id="lesson-video-heading" className="sr-only">
              Lesson video
            </h2>
            {videoSrc ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:shadow-none">
                <div className="aspect-video w-full">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    src={videoSrc}
                  >
                    <track kind="captions" />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900">
                No lesson video uploaded yet.
              </p>
            )}
          </section>

          {worksheetUrl && worksheetFileName ? (
            <section aria-labelledby="worksheet-heading">
              <h2
                id="worksheet-heading"
                className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Resources
              </h2>
              <a
                href={worksheetUrl}
                download={worksheetFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-800"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6Zm7 1.5L18.5 9H13V3.5ZM8 12h8v2H8v-2Zm0 4h5v2H8v-2Z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Download Worksheet PDF
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-slate-500 dark:text-slate-400">
                    {worksheetFileName}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  PDF
                </span>
              </a>
            </section>
          ) : null}

          <section aria-labelledby="homework-heading">
            <h2
              id="homework-heading"
              className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Assignment
            </h2>

            {!assignmentId ? (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                Homework submission opens once your teacher publishes an assignment for
                this lesson.
              </p>
            ) : (
              <form onSubmit={handleHomeworkSubmit}>
                <input type="hidden" name="course_id" value={courseId} />
                <input type="hidden" name="lesson_id" value={lessonId} />
                <input type="hidden" name="enrollment_id" value={enrollmentId} />
                <input type="hidden" name="assignment_id" value={assignmentId} />

                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-3 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors duration-200 ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/40"
                      : "border-slate-300 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="sr-only"
                    accept=".pdf,.doc,.docx,image/jpeg,image/png"
                    onChange={(event) => {
                      if (event.target.files) addFiles(event.target.files);
                      event.target.value = "";
                    }}
                  />
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0l-4 4m4-4 4 4M4 20h16"
                      />
                    </svg>
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Drag &amp; Drop homework files here
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    or click to browse — PDF, DOCX, images up to 25 MB each
                  </p>
                </div>

                {selectedFiles.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {selectedFiles.map((file) => (
                      <li
                        key={file.name}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="min-w-0 truncate font-medium text-slate-800 dark:text-slate-200">
                          {file.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-slate-500">
                          {formatFileSize(file.size)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Files upload to secure storage when you submit.
                  </p>
                  <button
                    type="submit"
                    disabled={selectedFiles.length === 0 || submitPending}
                    className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    {submitPending ? "Uploading…" : "Submit to Teacher"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
