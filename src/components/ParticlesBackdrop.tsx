"use client";

import { useEffect, useState } from "react";
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";
import { PERF_TIER_EVENT, readPerfTier, type PerfTier } from "@/lib/perf-tier";

/** Same breakpoint as the sidebar layout (Tailwind `lg`, 1100px). */
const DESKTOP = "(min-width: 1100px)";

/**
 * Particle settings per performance tier (see src/lib/perf-tier.ts). `density`
 * is particles per 100,000 px²: 56 ≈ 610 particles on a 1488×734 window, 28 ≈
 * 300. Both draw at 30fps; the component scales movement and trail fade by real
 * time, so the look matches a 60fps draw. The "low" tier has no background.
 */
const TIER_SETTINGS = {
  high: { density: 56, maxFps: 30 },
  mid: { density: 28, maxFps: 30 },
} as const;

/**
 * Decorative particle field behind every page — desktop only.
 *
 * On phones and small tablets it is not mounted at all (not just hidden), so
 * no canvas, particle array or animation loop runs there. Hiding it with CSS
 * would still burn CPU every frame. It is also removed entirely when the
 * adaptive performance check drops the site to the "low" tier.
 *
 * Renders nothing on the server and on the first client render, then mounts
 * once the media query confirms a desktop-width screen, so server and client
 * markup always match. Crossing the breakpoint (resizing, rotating) mounts or
 * unmounts it; unmounting cancels the animation loop.
 *
 * Styling: `fixed -z-10` puts it under all content; the sidebar and cards are
 * opaque, so it shows through the open page areas. Light theme: Clay Brown
 * particles fading into Soft Butter trails. Dark theme: butter particles
 * fading into the espresso page colour. It follows the toggle through the
 * `themechange` event (see ThemeToggle.tsx).
 */
export function ParticlesBackdrop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [tier, setTier] = useState<PerfTier>("high");

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);

    const readTheme = () => setIsDark(document.documentElement.dataset.theme === "dark");
    readTheme();
    window.addEventListener("themechange", readTheme);

    const readTier = () => setTier(readPerfTier());
    readTier();
    window.addEventListener(PERF_TIER_EVENT, readTier);

    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("themechange", readTheme);
      window.removeEventListener(PERF_TIER_EVENT, readTier);
    };
  }, []);

  if (!isDesktop || tier === "low") return null;

  const { density, maxFps } = TIER_SETTINGS[tier];

  return (
    <FluidParticlesBackground
      className="pointer-events-none fixed inset-0 -z-10 h-auto bg-transparent dark:bg-transparent"
      particleRgb={isDark ? "255, 241, 166" : "107, 53, 42"}
      trailColor={isDark ? "rgba(18, 11, 9, 0.12)" : "rgba(255, 241, 166, 0.12)"}
      density={density}
      maxFps={maxFps}
    />
  );
}
