"use client";

import { useEffect, useState } from "react";
import { basePath } from "@/lib/base-path";

/**
 * The running visit total under the name, like the reference's sidebar line.
 *
 * Counts once per browser session: the first page view of a session adds one
 * (POST), later views and other pages only read the number (GET). The flag
 * lives in sessionStorage, so a reader refreshing or clicking around does not
 * inflate it, while a fresh visit tomorrow counts again.
 *
 * Two things stop the number being inflated by the page itself:
 *  - The sidebar (desktop) and the home profile row (phones) both render this
 *    component — one of them is only hidden with CSS, so both mount together.
 *    `pending` shares a single request between every instance on the page.
 *  - The session flag is claimed *before* the request goes out, so React's
 *    development double-render and any refresh mid-flight cannot count twice.
 *    A failed request therefore skips this session rather than risk counting
 *    it twice: undercounting is the safer mistake.
 *
 * Until the number arrives — and on the static GitHub Pages copy, where there
 * is no API — it renders as an empty line of the same height, so nothing on the
 * page jumps once the count appears.
 */

const SESSION_FLAG = "pb-visit-counted";

/** One shared request per page load, whichever instance asks first. */
let pending: Promise<number | null> | null = null;

function loadCount(): Promise<number | null> {
  if (pending) return pending;

  let counted = true;
  try {
    counted = sessionStorage.getItem(SESSION_FLAG) === "1";
    // Claim the session up front so nothing else can count it again.
    if (!counted) sessionStorage.setItem(SESSION_FLAG, "1");
  } catch {
    // Storage blocked (private window): read only, never risk double-counting.
    counted = true;
  }

  pending = fetch(`${basePath}/api/visits/`, { method: counted ? "GET" : "POST" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { ok: boolean; count: number } | null) => (data?.ok ? data.count : null))
    .catch(() => null); // Offline or no API: show nothing rather than an error.

  return pending;
}

export function VisitCount({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCount().then((value) => {
      if (!cancelled && value !== null) setCount(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className={className} aria-live="polite">
      {count === null ? " " : `${count.toLocaleString()} ${count === 1 ? "visit" : "visits"}`}
    </span>
  );
}
