/**
 * Adaptive performance tier, modelled on the reference site
 * (portfolio.brewedops.cloud):
 *
 *  - Tiers: "high" (default), "mid", "low", stored on <html data-perf> and in
 *    sessionStorage "pb-perf-tier" for the rest of the visit. The inline script
 *    in layout.tsx restores a saved tier before first paint.
 *  - After the page settles, the browser's frames are timed in rounds (1.5–5s,
 *    at least 20 frames). If the median frame takes longer than 22ms (below
 *    ~45fps), the site steps down one tier and measures again, up to 6 rounds.
 *  - What each tier turns off: mid → lighter particle background and no
 *    backdrop blur (globals.css); low → no particle background at all.
 *  - Visitors with reduced motion are never measured (they already get a still
 *    background).
 *
 * A `perftierchange` event lets client components follow the tier.
 */

export type PerfTier = "high" | "mid" | "low";

const STORAGE_KEY = "pb-perf-tier";
export const PERF_TIER_EVENT = "perftierchange";

/** Median frame time above this (ms) steps the tier down; 22ms ≈ 45fps. */
const SLOW_FRAME_MS = 22;
/** Measure for at least this long… */
const MIN_SAMPLE_MS = 1500;
/** …and at most this long. */
const MAX_SAMPLE_MS = 5000;
/**
 * Frames longer than this count as exactly this long. A one-off stall (GC,
 * tab switch) then cannot move the median, but a device where every frame is
 * slow still reads as slow. (Dropping long frames instead, as the reference
 * does, means a very slow device never collects enough frames and is never
 * stepped down.)
 */
const OUTLIER_FRAME_MS = 100;
/** A round needs at least this many frames to count. */
const MIN_FRAMES = 20;
/** Give up after this many rounds. */
const MAX_ROUNDS = 6;

export function readPerfTier(): PerfTier {
  const tier = document.documentElement.dataset.perf;
  return tier === "mid" || tier === "low" ? tier : "high";
}

function setPerfTier(tier: PerfTier) {
  if (tier === readPerfTier()) return;
  document.documentElement.dataset.perf = tier;
  try {
    sessionStorage.setItem(STORAGE_KEY, tier);
  } catch {
    // Storage blocked: the tier still applies to this page.
  }
  window.dispatchEvent(new CustomEvent<PerfTier>(PERF_TIER_EVENT, { detail: tier }));
}

function savedTier(): PerfTier | null {
  try {
    const tier = sessionStorage.getItem(STORAGE_KEY);
    return tier === "mid" || tier === "low" ? tier : null;
  } catch {
    return null;
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Median frame time over one sampling round, or null if the round was unusable. */
function medianFrameTime(): Promise<number | null> {
  return new Promise((resolve) => {
    const frames: number[] = [];
    let last = performance.now();
    const minEnd = last + MIN_SAMPLE_MS;
    const maxEnd = last + MAX_SAMPLE_MS;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      if (document.visibilityState === "hidden") return resolve(null);
      frames.push(Math.min(delta, OUTLIER_FRAME_MS));
      if ((now < minEnd || frames.length < MIN_FRAMES) && now < maxEnd) {
        requestAnimationFrame(tick);
        return;
      }
      if (frames.length < MIN_FRAMES) return resolve(null);
      frames.sort((a, b) => a - b);
      resolve(frames[frames.length >> 1]);
    };

    requestAnimationFrame(tick);
  });
}

let started = false;

/** Starts the one-time measurement for this page load (safe to call twice). */
export async function startPerfMonitor() {
  if (started) return;
  started = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (savedTier() === "low") return;

  // Let hydration, fonts and the intro reveal finish before measuring.
  await wait(2000);

  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (readPerfTier() === "low") return;
    const median = await medianFrameTime();
    if (median === null) {
      await wait(1200);
      continue;
    }
    if (median <= SLOW_FRAME_MS) {
      await wait(2500);
      continue;
    }
    setPerfTier(readPerfTier() === "high" ? "mid" : "low");
    await wait(600);
  }
}
