/**
 * /api/visits/ — the sidebar's visit counter.
 *
 *   GET   read the running total (no change)
 *   POST  add one, then return the new total
 *
 * The number lives in a free Upstash Redis database, added to the project from
 * Vercel -> Storage. That integration injects the connection details as
 * environment variables; both the older KV_* names and the newer UPSTASH_* ones
 * are accepted, so it works whichever Vercel sets.
 *
 * If those variables are missing (local development, or the static GitHub Pages
 * copy) every call answers { ok: false } and the sidebar simply shows nothing —
 * the site never displays a broken or zero count.
 */

const KEY = "pb:visits";

function credentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/** Upstash's REST API: /incr/<key> and /get/<key> both answer { result: ... }. */
async function redis(command: "incr" | "get") {
  const creds = credentials();
  if (!creds) return null;
  const response = await fetch(`${creds.url}/${command}/${KEY}`, {
    method: command === "incr" ? "POST" : "GET",
    headers: { Authorization: `Bearer ${creds.token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`Upstash responded ${response.status}`);
  const data = (await response.json()) as { result: number | string | null };
  return Number(data.result ?? 0);
}

async function answer(command: "incr" | "get") {
  try {
    const count = await redis(command);
    if (count === null) return Response.json({ ok: false, error: "unconfigured" }, { status: 503 });
    return Response.json({ ok: true, count }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[visits] failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json({ ok: false, error: "failed" }, { status: 502 });
  }
}

export const GET = () => answer("get");
export const POST = () => answer("incr");
