import { createSmtpTransporter, escapeHtml } from "@/lib/email/smtp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, email, phone } = (await request.json()) as Partial<{
      name: string;
      email: string;
      phone: string;
    }>;

    if (!name || !email || !phone) {
      return Response.json({ success: false, error: "Missing fields." }, { status: 400 });
    }

    const { transporter, fromAddress } = createSmtpTransporter();

    const origin = new URL(request.url).origin;
    const brochureUrl = `${origin}/docs/Aalgorix_World_Academy_Brochure.pdf`;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0f172a;">
        <h2 style="margin: 0 0 12px;">Aalgorix World Academy — Brochure</h2>
        <p style="margin: 0 0 12px;">Dear ${escapeHtml(name)},</p>
        <p style="margin: 0 0 16px;">
          Thank you for your interest in Aalgorix World Academy. Your digital brochure is ready.
        </p>
        <p style="margin: 0 0 16px;">
          <a href="${brochureUrl}" style="display: inline-block; padding: 10px 14px; background: #4f46e5; color: white; text-decoration: none; border-radius: 10px;">
            Download the Brochure (PDF)
          </a>
        </p>
        <div style="margin-top: 18px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
          <p style="margin: 0 0 10px; font-weight: 700;">Syllabus & Academy Overview</p>
          <ul style="margin: 0; padding-left: 18px;">
            <li>Six accredited curricula pathways aligned for global university placement.</li>
            <li>Live specialist masterclasses with structured weekly pacing and recordings.</li>
            <li>Verified mentor mapping and parent accountability dashboards.</li>
            <li>Teacher-marked assessments with disciplined turnaround SLAs.</li>
          </ul>
        </div>
        <p style="margin: 18px 0 0; font-size: 12px; color: #475569;">
          Submitted contact number: ${escapeHtml(phone)} · If you didn’t request this, you can ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Aalgorix World Academy" <${fromAddress}>`,
      to: email,
      subject: "Your Aalgorix World Academy Brochure",
      html,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

