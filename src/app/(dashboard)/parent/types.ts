import type { SubmissionStatus } from "@/lib/dashboard/submission-status";

export type LinkedChild = {
  id: string;
  full_name: string | null;
  email: string;
  relationshipLabel: string;
};

export type CourseEnrollmentProgress = {
  enrollmentId: string;
  course: {
    id: string;
    title: string;
    curriculum_tag: string | null;
  };
  progressPercent: number;
};

export type ScholasticSummary = {
  completionPercent: number;
  assignmentsSubmitted: number;
  averageGrade: number | null;
  pendingRevisions: number;
};

export type StoragePathEntry = {
  path: string;
  name: string;
  size: number;
};

export type GradingTimelineEntry = {
  id: string;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string | null;
  courseTitle: string;
  lessonTitle: string | null;
  assignmentTitle: string;
  storagePaths: StoragePathEntry[];
};
