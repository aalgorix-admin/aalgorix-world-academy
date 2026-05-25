import * as tus from "tus-js-client";

import { getSupabaseUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

import { lessonVideoObjectPath, lessonWorksheetObjectPath, safeStorageFileName } from "./paths";

const LESSON_VIDEO_BUCKET = "lesson-videos";
const ASSIGNMENT_FILES_BUCKET = "assignment-files";
const MAX_LESSON_VIDEO_BYTES = 524_288_000;
const MAX_WORKSHEET_BYTES = 52_428_800;

export type UploadProgressHandler = (percent: number) => void;

function getProjectRef(): string {
  return new URL(getSupabaseUrl()).hostname.split(".")[0] ?? "";
}

function getResumableEndpoint(): string {
  return `https://${getProjectRef()}.storage.supabase.co/storage/v1/upload/resumable`;
}

async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be signed in to upload files.");
  }

  return session.access_token;
}

function encodeStoragePath(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function uploadLessonVideoResumable(
  file: File,
  courseId: string,
  onProgress: UploadProgressHandler,
): Promise<string> {
  if (!file.name.toLowerCase().endsWith(".mp4") && file.type !== "video/mp4") {
    throw new Error("Lesson videos must be .mp4 files.");
  }

  if (file.size > MAX_LESSON_VIDEO_BYTES) {
    throw new Error("Video must be 500 MB or smaller.");
  }

  const objectPath = lessonVideoObjectPath(courseId, file.name);
  const accessToken = await getAccessToken();

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: getResumableEndpoint(),
      retryDelays: [0, 1000, 3000, 5000],
      chunkSize: 6 * 1024 * 1024,
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: LESSON_VIDEO_BUCKET,
        objectName: objectPath,
        contentType: file.type || "video/mp4",
        cacheControl: "3600",
      },
      onError: (error) => reject(error),
      onProgress: (bytesUploaded, bytesTotal) => {
        if (bytesTotal > 0) {
          onProgress(Math.min(100, (bytesUploaded / bytesTotal) * 100));
        }
      },
      onSuccess: () => {
        onProgress(100);
        resolve(objectPath);
      },
    });

    upload
      .findPreviousUploads()
      .then((previous) => {
        if (previous.length > 0) {
          upload.resumeFromPreviousUpload(previous[0]!);
        }
        upload.start();
      })
      .catch(reject);
  });
}

export async function uploadLessonWorksheet(
  file: File,
  courseId: string,
  onProgress: UploadProgressHandler,
): Promise<string> {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    throw new Error("Worksheets must be PDF files.");
  }

  if (file.size > MAX_WORKSHEET_BYTES) {
    throw new Error("Worksheet must be 50 MB or smaller.");
  }

  const objectPath = lessonWorksheetObjectPath(courseId, file.name);
  const accessToken = await getAccessToken();
  const url = `${getSupabaseUrl()}/storage/v1/object/${ASSIGNMENT_FILES_BUCKET}/${encodeStoragePath(objectPath)}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(100, (event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(objectPath);
        return;
      }

      let message = `Upload failed (${xhr.status})`;
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        message = body.message ?? body.error ?? message;
      } catch {
        if (xhr.responseText) message = xhr.responseText;
      }
      reject(new Error(message));
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during worksheet upload."));
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("Content-Type", file.type || "application/pdf");
    xhr.setRequestHeader("x-upsert", "true");
    xhr.send(file);
  });
}

export function formatUploadPercent(percent: number): string {
  return `${Math.round(percent)}%`;
}

export { safeStorageFileName };
