"use client";

import { useState } from "react";

/**
 * The "Copy" button on the framework page's code blocks, like the reference's.
 * Says "Copied" for a moment after a successful copy, and "Press Ctrl+C" if the
 * browser refuses (clipboard access needs a secure context and permission).
 */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex-none rounded-[7px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-[11px] py-[4px] text-[12px] text-[#cdd9ec] transition-[transform,background-color,border-color] duration-[250ms] ease-[cubic-bezier(0.2,0.9,0.25,1.1)] hover:-translate-y-[1px] hover:border-[rgba(255,154,90,0.6)] hover:bg-[rgba(255,255,255,0.16)] active:translate-y-0 active:scale-[0.96] active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a]"
    >
      {state === "done" ? "Copied" : state === "failed" ? "Press Ctrl+C" : "Copy"}
    </button>
  );
}
