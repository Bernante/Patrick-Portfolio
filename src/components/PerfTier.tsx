"use client";

import { useEffect } from "react";
import { startPerfMonitor } from "@/lib/perf-tier";

/**
 * Starts the adaptive performance check once per page load (see
 * src/lib/perf-tier.ts). Renders nothing.
 */
export function PerfTier() {
  useEffect(() => {
    void startPerfMonitor();
  }, []);

  return null;
}
