"use client";

import { useActionState, useRef, useState } from "react";

import { uploadLessonVideoResumable } from "@/lib/storage/admin-media-upload";

import { uploadLessonVideo, type CatalogActionState } from "./actions";
import { secondaryButtonClassName } from "./form-classes";
import { UploadProgressBar } from "./upload-progress-bar";

type UploadLessonVideoProps = {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  currentPath: string | null;
};

const initialState: CatalogActionState | null = null;

export function UploadLessonVideo({
  courseId,
  lessonId,
  lessonTitle,
  currentPath,
}: UploadLessonVideoProps) {
  const [state, formAction, pending] = useActionState(uploadLessonVideo, initialState);
  const [clientPath, setClientPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    setClientError(null);
    try {
      const path = await uploadLessonVideoResumable(file, courseId, setProgress);
      setClientPath(path);

      const formData = new FormData();
      formData.set("lesson_id", lessonId);
      formData.set("course_id", courseId);
      formData.set("video_storage_path", path);
      formAction(formData);
    } catch (error) {
      setClientError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const displayPath = clientPath ?? currentPath;

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Replace video · {lessonTitle}
      </p>
      {displayPath ? (
        <p className="mt-1 truncate font-mono text-[10px] text-slate-500">{displayPath}</p>
      ) : null}
      {(state && !state.ok && state.error) || clientError ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400" role="alert">
          {clientError ?? state?.error}
        </p>
      ) : null}
      {state?.ok && state.message ? (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400" role="status">
          {state.message}
        </p>
      ) : null}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        className="mt-2 cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-600 hover:border-indigo-300 dark:border-slate-600"
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,.mp4"
          className="sr-only"
          disabled={uploading || pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />
        Drop .mp4 to upload (resumable)
      </div>

      {uploading ? (
        <UploadProgressBar percent={progress} label="Streaming lecture video" />
      ) : null}

      <p className="mt-2 font-mono text-[10px] text-slate-400">
        Path: courses/{courseId}/&lt;filename&gt;
      </p>
      {pending ? (
        <p className={`${secondaryButtonClassName} mt-2`}>Saving lesson record…</p>
      ) : null}
    </div>
  );
}
