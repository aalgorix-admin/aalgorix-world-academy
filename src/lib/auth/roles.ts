export const USER_ROLES = ["student", "parent", "teacher", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Roles allowed during self-service signup (admin is provisioned separately). */
export const SIGNUP_ROLES = ["student", "parent", "teacher"] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export function isSignupRole(value: string): value is SignupRole {
  return (SIGNUP_ROLES as readonly string[]).includes(value);
}

export function roleLabel(role: SignupRole): string {
  switch (role) {
    case "student":
      return "Student";
    case "parent":
      return "Parent";
    case "teacher":
      return "Teacher";
  }
}
