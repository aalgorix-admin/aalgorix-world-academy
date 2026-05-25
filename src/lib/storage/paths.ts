export function safeStorageFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/** Object path inside the `lesson-videos` bucket. */
export function lessonVideoObjectPath(courseId: string, fileName: string): string {
  return `courses/${courseId}/${safeStorageFileName(fileName)}`;
}

/** Object path inside the `assignment-files` bucket. */
export function lessonWorksheetObjectPath(courseId: string, fileName: string): string {
  return `courses/${courseId}/worksheets/${safeStorageFileName(fileName)}`;
}
