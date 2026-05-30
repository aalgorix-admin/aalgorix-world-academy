import nodemailer from "nodemailer";
import type Transporter from "nodemailer/lib/mailer";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function toSmtpPort(value: string) {
  const port = Number.parseInt(value, 10);
  if (!Number.isFinite(port)) throw new Error("Invalid SMTP_PORT.");
  return port;
}

export function createSmtpTransporter(): {
  transporter: Transporter;
  fromAddress: string;
} {
  const SMTP_HOST = getRequiredEnv("SMTP_HOST");
  const SMTP_PORT = toSmtpPort(getRequiredEnv("SMTP_PORT"));
  const SMTP_USER = getRequiredEnv("SMTP_USER");
  const SMTP_PASS = getRequiredEnv("SMTP_PASS");

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return { transporter, fromAddress: SMTP_USER };
}

export function getContactInquiryRecipient() {
  return (process.env.CONTACT_INQUIRY_TO ?? "awa@aalgorix.com").trim();
}
