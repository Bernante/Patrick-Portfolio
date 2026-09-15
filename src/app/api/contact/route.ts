/**
 * POST /api/contact/ — receives the contact form and hands it on.
 *
 * Phase 2 (now): forwards the submission as JSON to the GoHighLevel inbound
 * webhook in the private CONTACT_WEBHOOK_URL environment value (set in Vercel,
 * never sent to the browser). The GoHighLevel workflow saves the lead and sends
 * the notification and any auto-reply.
 *
 * Phase 4 (after the trial): only `deliver()` changes, to send the emails
 * directly. The form, its fields and this route's responses stay the same.
 *
 * Responses: 200 { ok: true } · 400 invalid input · 503 not configured ·
 * 502 the webhook failed. Bots that fill the hidden "website" field get a
 * silent 200 and nothing is sent.
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

async function deliver(submission: Submission, webhookUrl: string) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: submission.firstName,
      last_name: submission.lastName,
      email: submission.email,
      message: submission.message,
      source: "Portfolio contact form",
      submitted_at: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
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

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[contact] CONTACT_WEBHOOK_URL is not set");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  try {
    await deliver(submission, webhookUrl);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return Response.json({ ok: false, error: "failed" }, { status: 502 });
  }
}
