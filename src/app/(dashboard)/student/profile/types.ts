export type StudentAddress = {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type StudentMetadata = {
  gender?: string;
  nationality?: string;
  bio?: string;
  batch_enrolled?: string;
  previous_school?: string;
  highest_grade?: string;
  address?: Partial<StudentAddress>;
};

export type StudentProfileData = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  metadata: StudentMetadata;
};

export type LinkedParentGuardian = {
  id: string;
  full_name: string | null;
  email: string;
};

const EMPTY_ADDRESS: StudentAddress = {
  street: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseAddress(raw: unknown): StudentAddress {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY_ADDRESS };
  }

  const record = raw as Record<string, unknown>;
  return {
    street: readString(record.street) ?? "",
    city: readString(record.city) ?? "",
    state: readString(record.state) ?? "",
    postal_code: readString(record.postal_code) ?? "",
    country: readString(record.country) ?? "",
  };
}

export function parseStudentMetadata(raw: unknown): StudentMetadata {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { address: { ...EMPTY_ADDRESS } };
  }

  const record = raw as Record<string, unknown>;

  return {
    gender: readString(record.gender),
    nationality: readString(record.nationality),
    bio: readString(record.bio),
    batch_enrolled: readString(record.batch_enrolled),
    previous_school: readString(record.previous_school),
    highest_grade: readString(record.highest_grade),
    address: parseAddress(record.address),
  };
}

export function buildStudentProfileData(row: {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  metadata: unknown;
}): StudentProfileData {
  const metadata = parseStudentMetadata(row.metadata);

  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    date_of_birth: row.date_of_birth,
    created_at: row.created_at,
    metadata: {
      ...metadata,
      address: metadata.address ?? { ...EMPTY_ADDRESS },
    },
  };
}

export function profileInitials(fullName: string | null, email: string): string {
  const source = fullName?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function formatAccountAnniversary(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(new Date(iso));
}
