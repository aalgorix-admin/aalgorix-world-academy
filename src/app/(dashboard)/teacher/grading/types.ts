export const SUBMISSION_STATUSES = [
  "draft",
  "submitted",
  "graded",
  "returned",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export type StoragePathEntry = {
  path: string;
  name: string;
  size: number;
};

export type GradingQueueItem = {
  id: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  gradedAt: string | null;
  grade: number | null;
  feedback: string | null;
  storagePaths: StoragePathEntry[];
  studentName: string;
  courseTitle: string;
  lessonTitle: string | null;
  assignmentId: string;
  assignmentTitle: string;
  assignmentDescription: string | null;
  maxPoints: number;
  courseId: string;
  lessonId: string | null;
};

export type GradingQueueMetrics = {
  pendingHomework: number;
  gradedThisWeek: number;
  revisionQueue: number;
};
