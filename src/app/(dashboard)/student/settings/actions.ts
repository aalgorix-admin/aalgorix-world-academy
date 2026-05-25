"use server";

import { revalidatePath } from "next/cache";

import {
  generateParentLinkCode,
  hashCodeBinding,
  hashCodeDigest,
  parentLinkCodeExpiresAt,
} from "@/lib/parent-link/codes";
import { createClient } from "@/lib/supabase/server";

const STUDENT_SETTINGS_PATH = "/student/settings";

export type ParentLinkActionState = {
  ok: boolean;
  error?: string;
  message?: string;
  code?: string;
  expiresAt?: string;
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
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "student") {
    return { error: "Only student accounts can generate parent link codes.", supabase: null, userId: null };
  }

  return { error: null, supabase, userId: user.id };
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

  revalidatePath(STUDENT_SETTINGS_PATH);
  return {
    ok: true,
    message: "Share this code with your parent. It expires in 24 hours.",
    code: plainCode,
    expiresAt,
  };
}
