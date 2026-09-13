"use client";

import { useEffect, useState } from "react";
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";

/** Same breakpoint as the sidebar layout (Tailwind `lg`). */
const DESKTOP = "(min-width: 1024px)";

/**
 * Decorative particle field behind every page — desktop only.
 *
 * On phones and small tablets it is not mounted at all (not just hidden), so
 * no canvas, particle array or animation loop runs there. Hiding it with CSS
 * would still burn CPU every frame.
 *
 * Renders nothing on the server and on the first client render, then mounts
 * once the media query confirms a desktop-width screen, so server and client
 * markup always match. Crossing the breakpoint (resizing, rotating) mounts or
 * unmounts it; unmounting cancels the animation loop.
 *
 * Styling: `fixed -z-10` puts it under all content; the sidebar and cards are
 * opaque, so it shows through the open butter areas. Clay Brown particles fade
 * into Soft Butter trails to match the page background; `density` keeps ~2000
 * particles on 1920×1080.
 */
export function ParticlesBackdrop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return null;

  return (
    <FluidParticlesBackground
      className="pointer-events-none fixed inset-0 -z-10 h-auto bg-transparent"
      particleRgb="107, 53, 42"
      trailColor="rgba(255, 241, 166, 0.12)"
      density={96}
    />
  );
}
