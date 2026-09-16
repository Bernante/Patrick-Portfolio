import nodemailer from "nodemailer";

/**
 * POST /api/contact/ — receives the contact form and emails it to the owner.
 *
 * Sends straight through Gmail's SMTP with an App Password, so there is no
 * third-party service, no monthly cost and no message limit. Both values are
 * private server settings (Vercel -> Settings -> Environment Variables); they
 * are never sent to the browser and never committed:
 *
 *   GMAIL_USER          the Gmail address that sends (and receives) the mail
 *   GMAIL_APP_PASSWORD  a 16-character Google App Password, not the real one
 *   CONTACT_TO_EMAIL    optional, if the notification should go somewhere else
 *
 * The visitor's address goes in Reply-To, so replying from the inbox answers
 * them directly.
 *
 * Responses: 200 { ok: true } · 400 invalid input · 503 not configured ·
 * 502 sending failed. Bots that fill the hidden "website" field get a silent
 * 200 and nothing is sent.
 */

type Submission = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const LIMITS = { firstName: 80, lastName: 80, email: 254, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parse(body: unknown): Submission | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const out = {} as Submission;
  for (const key of Object.keys(LIMITS) as (keyof Submission)[]) {
    const value = typeof data[key] === "string" ? (data[key] as string).trim() : "";
    if (!value || value.length > LIMITS[key]) return null;
    out[key] = value;
  }
  return EMAIL.test(out.email) ? out : null;
}

/** Escapes the visitor's text so it cannot inject markup into the HTML email. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function deliver(submission: Submission, user: string, pass: string) {
  const name = `${submission.firstName} ${submission.lastName}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    // Gmail only allows its own account as the sender; the visitor's address
    // goes in Reply-To instead, so "Reply" in the inbox reaches them.
    from: `"Portfolio contact form" <${user}>`,
    to: process.env.CONTACT_TO_EMAIL || user,
    replyTo: `"${name}" <${submission.email}>`,
    subject: `New portfolio message from ${name}`,
    text: [
      `Name:    ${name}`,
      `Email:   ${submission.email}`,
      `Sent:    ${new Date().toISOString()}`,
      "",
      "Message:",
      submission.message,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#1c0f0b">
        <h2 style="margin:0 0 16px;font-size:18px">New message from your portfolio</h2>
        <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 4px"><strong>Email:</strong>
          <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a>
        </p>
        <p style="margin:16px 0 4px"><strong>Message:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(submission.message)}</p>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot filled: pretend it worked so bots don't retry.
  const website = (body as Record<string, unknown> | null)?.website;
  if (typeof website === "string" && website.trim()) return Response.json({ ok: true });

  const submission = parse(body);
  if (!submission) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[contact] GMAIL_USER or GMAIL_APP_PASSWORD is not set");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  try {
    await deliver(submission, user, pass);
    return Response.json({ ok: true });
  } catch (error) {
    // Only the message, never the error object: keeps credentials and SMTP
    // transcript out of the server logs.
    console.error("[contact] sending failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json({ ok: false, error: "failed" }, { status: 502 });
  }
}
