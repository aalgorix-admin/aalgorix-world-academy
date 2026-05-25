export type LessonStatus = "completed" | "unlocked" | "locked";

export type CurriculumLesson = {
  id: string;
  title: string;
  status: LessonStatus;
};

export type CurriculumModule = {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
};
