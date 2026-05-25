export const SUBMISSION_STATUSES = [
  "draft",
  "submitted",
  "graded",
  "returned",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}

export function submissionStatusBadgeClass(status: SubmissionStatus): string {
  switch (status) {
    case "submitted":
      return "bg-amber-100 text-amber-900 ring-amber-200";
    case "graded":
      return "bg-emerald-100 text-emerald-900 ring-emerald-200";
    case "returned":
      return "bg-rose-100 text-rose-900 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

export function submissionStatusLabel(status: SubmissionStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "graded":
      return "Graded";
    case "returned":
      return "Returned";
    default:
      return status;
  }
}
