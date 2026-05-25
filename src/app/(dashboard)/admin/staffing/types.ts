import type { UserRole } from "@/lib/auth/roles";

export type StaffProfile = {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
};

export type PublishedCourseOption = {
  id: string;
  slug: string;
  title: string;
  grade_level: string | null;
  curriculum_tag: string | null;
};

export type TeacherCourseAssignment = {
  teacher_id: string;
  course_id: string;
  assigned_at: string;
  course: PublishedCourseOption;
};

export type StaffingPageData = {
  profiles: StaffProfile[];
  publishedCourses: PublishedCourseOption[];
  assignments: TeacherCourseAssignment[];
};

export function assignmentsForTeacher(
  assignments: TeacherCourseAssignment[],
  teacherId: string,
): TeacherCourseAssignment[] {
  return assignments.filter((row) => row.teacher_id === teacherId);
}

export function displayRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "teacher":
      return "Teacher";
    case "parent":
      return "Parent";
    case "student":
      return "Student";
  }
}
