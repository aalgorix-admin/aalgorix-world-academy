"use server";

import { revalidatePath } from "next/cache";

import {
  generateParentLinkCode,
  hashCodeBinding,
  hashCodeDigest,
  parentLinkCodeExpiresAt,
} from "@/lib/parent-link/codes";
import { createClient } from "@/lib/supabase/server";

import { parseStudentMetadata, type StudentMetadata } from "./types";

const STUDENT_PROFILE_PATH = "/student/profile";

export type PassportUpdateResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

export type ParentLinkActionState = {
  ok: boolean;
  error?: string;
  message?: string;
  code?: string;
  expiresAt?: string;
};

export type UnlinkParentResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

async function requireStudent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in.", supabase: null, userId: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, metadata")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "student") {
    return {
      error: "Only student accounts can update this passport.",
      supabase: null,
      userId: null,
    };
  }

  return {
    error: null,
    supabase,
    userId: user.id,
    existingMetadata: parseStudentMetadata(profile.metadata),
  };
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildMetadataFromForm(
  formData: FormData,
  existing: StudentMetadata,
): StudentMetadata {
  return {
    ...existing,
    gender: readFormString(formData, "gender") || undefined,
    nationality: readFormString(formData, "nationality") || undefined,
    bio: readFormString(formData, "bio") || undefined,
    batch_enrolled: readFormString(formData, "batch_enrolled") || undefined,
    previous_school: readFormString(formData, "previous_school") || undefined,
    highest_grade: readFormString(formData, "highest_grade") || undefined,
    address: {
      street: readFormString(formData, "address_street"),
      city: readFormString(formData, "address_city"),
      state: readFormString(formData, "address_state"),
      postal_code: readFormString(formData, "address_postal_code"),
      country: readFormString(formData, "address_country"),
    },
  };
}

export async function updateStudentPassport(
  formData: FormData,
): Promise<PassportUpdateResult> {
  const ctx = await requireStudent();
  if (ctx.error || !ctx.supabase || !ctx.userId) {
    return { ok: false, error: ctx.error ?? "Unauthorized." };
  }

  const fullName = readFormString(formData, "full_name");
  const phone = readFormString(formData, "phone");
  const dateOfBirth = readFormString(formData, "date_of_birth");
  const metadata = buildMetadataFromForm(formData, ctx.existingMetadata ?? {});

  const { error } = await ctx.supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      phone: phone || null,
      date_of_birth: dateOfBirth || null,
      metadata,
    })
    .eq("id", ctx.userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(STUDENT_PROFILE_PATH);
  return { ok: true, message: "Academic passport saved successfully." };
}

export async function generateParentLinkCodeAction(
  _prev: ParentLinkActionState | null,
): Promise<ParentLinkActionState> {
  const ctx = await requireStudent();
  if (ctx.error || !ctx.supabase || !ctx.userId) {
    return { ok: false, error: ctx.error ?? "Unauthorized." };
  }

  const plainCode = generateParentLinkCode();
  const expiresAt = parentLinkCodeExpiresAt();
  const codeDigest = hashCodeDigest(plainCode);
  const codeHash = hashCodeBinding(ctx.userId, plainCode);

  await ctx.supabase
    .from("parent_link_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("student_id", ctx.userId)
    .is("used_at", null);

  const { error } = await ctx.supabase.from("parent_link_codes").insert({
    student_id: ctx.userId,
    code_digest: codeDigest,
    code_hash: codeHash,
    expires_at: expiresAt,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(STUDENT_PROFILE_PATH);
  return {
    ok: true,
    message: "Share this code with your parent. It expires in 24 hours.",
    code: plainCode,
    expiresAt,
  };
}

export async function unlinkParentGuardian(
  parentId: string,
): Promise<UnlinkParentResult> {
  const ctx = await requireStudent();
  if (ctx.error || !ctx.supabase || !ctx.userId) {
    return { ok: false, error: ctx.error ?? "Unauthorized." };
  }

  if (!parentId) {
    return { ok: false, error: "Invalid parent reference." };
  }

  const { error } = await ctx.supabase
    .from("student_parent_relations")
    .delete()
    .eq("student_id", ctx.userId)
    .eq("parent_id", parentId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(STUDENT_PROFILE_PATH);
  return { ok: true, message: "Parent guardian link removed." };
}
