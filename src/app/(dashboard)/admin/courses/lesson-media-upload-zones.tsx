"use client";

import { useRef, useState } from "react";

import {
  formatUploadPercent,
  uploadLessonVideoResumable,
  uploadLessonWorksheet,
} from "@/lib/storage/admin-media-upload";

import { fieldInputClassName, fieldLabelClassName } from "./form-classes";
import { UploadProgressBar } from "./upload-progress-bar";

type LessonMediaUploadZonesProps = {
  courseId: string;
  videoStoragePath: string;
  onVideoStoragePathChange: (path: string) => void;
  resourcePaths: string[];
  onResourcePathsChange: (paths: string[]) => void;
};

type UploadZoneState = {
  uploading: boolean;
  progress: number;
  error: string | null;
};

const idleUploadState: UploadZoneState = {
  uploading: false,
  progress: 0,
  error: null,
};

const dropzoneClassName =
  "cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30";

export function LessonMediaUploadZones({
  courseId,
  videoStoragePath,
  onVideoStoragePathChange,
  resourcePaths,
  onResourcePathsChange,
}: LessonMediaUploadZonesProps) {
  const [videoDrag, setVideoDrag] = useState(false);
  const [worksheetDrag, setWorksheetDrag] = useState(false);
  const [videoUpload, setVideoUpload] = useState<UploadZoneState>(idleUploadState);
  const [worksheetUpload, setWorksheetUpload] = useState<UploadZoneState>(idleUploadState);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const worksheetInputRef = useRef<HTMLInputElement>(null);

  async function handleVideoFile(file: File) {
    setVideoUpload({ uploading: true, progress: 0, error: null });
    try {
      const path = await uploadLessonVideoResumable(file, courseId, (percent) => {
        setVideoUpload((prev) => ({ ...prev, progress: percent }));
      });
      onVideoStoragePathChange(path);
      setVideoUpload({ uploading: false, progress: 100, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Video upload failed.";
      setVideoUpload({ uploading: false, progress: 0, error: message });
    }
  }

  async function handleWorksheetFile(file: File) {
    setWorksheetUpload({ uploading: true, progress: 0, error: null });
    try {
      const path = await uploadLessonWorksheet(file, courseId, (percent) => {
        setWorksheetUpload((prev) => ({ ...prev, progress: percent }));
      });
      onResourcePathsChange([...resourcePaths, path]);
      setWorksheetUpload({ uploading: false, progress: 100, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Worksheet upload failed.";
      setWorksheetUpload({ uploading: false, progress: 0, error: message });
    }
  }

  return (
    <div className="mt-3 space-y-4">
      <div>
        <p className={fieldLabelClassName}>Lecture video (.mp4)</p>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              videoInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setVideoDrag(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setVideoDrag(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setVideoDrag(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setVideoDrag(false);
            const file = event.dataTransfer.files[0];
            if (file) void handleVideoFile(file);
          }}
          onClick={() => videoInputRef.current?.click()}
          className={`${dropzoneClassName} ${
            videoDrag ? "border-indigo-400 bg-indigo-50/80 dark:border-indigo-500" : ""
          }`}
        >
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,.mp4"
            className="sr-only"
            disabled={videoUpload.uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleVideoFile(file);
              event.target.value = "";
            }}
          />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drop .mp4 lecture video here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Resumable upload to lesson-videos · courses/{courseId}/…
          </p>
        </div>

        {videoUpload.uploading || videoUpload.progress > 0 ? (
          <UploadProgressBar
            percent={videoUpload.progress}
            label={
              videoUpload.uploading
                ? `Streaming video (${formatUploadPercent(videoUpload.progress)})`
                : "Video upload complete"
            }
          />
        ) : null}

        {videoUpload.error ? (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400" role="alert">
            {videoUpload.error}
          </p>
        ) : null}

        <label className="mt-3 block">
          <span className={fieldLabelClassName}>video_storage_path</span>
          <input
            name="video_storage_path"
            readOnly
            value={videoStoragePath}
            placeholder="Upload a video to auto-fill this path"
            className={`${fieldInputClassName} font-mono text-xs`}
          />
        </label>
      </div>

      <div>
        <p className={fieldLabelClassName}>Worksheet PDF (resource_paths)</p>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              worksheetInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setWorksheetDrag(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setWorksheetDrag(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setWorksheetDrag(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setWorksheetDrag(false);
            const file = event.dataTransfer.files[0];
            if (file) void handleWorksheetFile(file);
          }}
          onClick={() => worksheetInputRef.current?.click()}
          className={`${dropzoneClassName} ${
            worksheetDrag ? "border-indigo-400 bg-indigo-50/80 dark:border-indigo-500" : ""
          }`}
        >
          <input
            ref={worksheetInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={worksheetUpload.uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleWorksheetFile(file);
              event.target.value = "";
            }}
          />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drop worksheet PDF here
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Streams to assignment-files · appended to resource_paths JSON
          </p>
        </div>

        {worksheetUpload.uploading || worksheetUpload.progress > 0 ? (
          <UploadProgressBar
            percent={worksheetUpload.progress}
            label={
              worksheetUpload.uploading
                ? `Uploading worksheet (${formatUploadPercent(worksheetUpload.progress)})`
                : "Worksheet upload complete"
            }
          />
        ) : null}

        {worksheetUpload.error ? (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400" role="alert">
            {worksheetUpload.error}
          </p>
        ) : null}

        <input type="hidden" name="resource_paths" value={JSON.stringify(resourcePaths)} />

        {resourcePaths.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {resourcePaths.map((path) => (
              <li
                key={path}
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              >
                <span className="min-w-0 truncate font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {path}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-xs font-medium text-rose-600 hover:text-rose-500"
                  onClick={() =>
                    onResourcePathsChange(resourcePaths.filter((entry) => entry !== path))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            No worksheet resources attached yet.
          </p>
        )}
      </div>
    </div>
  );
}
