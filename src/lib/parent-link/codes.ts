import { createHash, randomBytes, timingSafeEqual } from "crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const EXPIRY_MS = 24 * 60 * 60 * 1000;

export function getParentLinkCodeSecret(): string {
  const secret = process.env.PARENT_LINK_CODE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "PARENT_LINK_CODE_SECRET is not configured (minimum 16 characters).",
    );
  }
  return secret;
}

export function generateParentLinkCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return code;
}

export function normalizeParentLinkCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);
}

export function isValidParentLinkCodeFormat(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

export function hashCodeDigest(code: string): string {
  const normalized = normalizeParentLinkCode(code);
  return createHash("sha256")
    .update(`${getParentLinkCodeSecret()}:digest:${normalized}`)
    .digest("hex");
}

export function hashCodeBinding(studentId: string, code: string): string {
  const normalized = normalizeParentLinkCode(code);
  return createHash("sha256")
    .update(`${getParentLinkCodeSecret()}:bind:${studentId}:${normalized}`)
    .digest("hex");
}

export function verifyCodeBinding(
  studentId: string,
  code: string,
  storedHash: string,
): boolean {
  const expected = hashCodeBinding(studentId, code);
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

export function parentLinkCodeExpiresAt(from = new Date()): string {
  return new Date(from.getTime() + EXPIRY_MS).toISOString();
}

export function formatExpiryLabel(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
