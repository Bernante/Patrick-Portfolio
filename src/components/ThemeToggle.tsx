"use client";

import { useEffect, useState } from "react";

/**
 * Light / dark toggle, modelled on the reference site's:
 *  - The theme is `data-theme` on <html>, saved in localStorage "pb-theme".
 *    The inline script in layout.tsx applies a saved "dark" before first paint;
 *    otherwise the site starts light (the system setting is not used).
 *  - Switching runs a View Transition: the new theme is revealed as a circle
 *    growing from the button's centre to the farthest corner (theme-sweep in
 *    globals.css, 1.2s). Without View Transitions, or with reduced motion, it
 *    switches instantly.
 *  - A `themechange` event lets other client components (the particle
 *    background) follow the theme.
 */

const STORAGE_KEY = "pb-theme";
type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode): the theme still applies for this page.
  }
  window.dispatchEvent(new CustomEvent<Theme>("themechange", { detail: theme }));
}

function switchTheme(theme: Theme, origin?: { x: number; y: number }) {
  const doc = document as ViewTransitionDocument;
  const root = document.documentElement;
  // The site's own "Reduce motion" switch (A11yWidget) also skips the sweep.
  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.dataset.a11yMotion === "true";

  if (!doc.startViewTransition || reducedMotion || currentTheme() === theme) {
    applyTheme(theme);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--sweep-x", `${x}px`);
  root.style.setProperty("--sweep-y", `${y}px`);
  root.style.setProperty("--sweep-r", `${radius}px`);
  root.dataset.themeSweep = "on";

  doc
    .startViewTransition(() => applyTheme(theme))
    .finished.finally(() => {
      delete root.dataset.themeSweep;
    });
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Server and first client render are "light"; the real value is read after
  // mount, so hydration always matches.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(currentTheme());
    const onChange = (event: Event) => setTheme((event as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  return (
    <button
      type="button"
      className={className}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const next: Theme = currentTheme() === "dark" ? "light" : "dark";
        switchTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
        setTheme(next);
      }}
    >
      <ThemeIcon theme={theme} size={21} />
    </button>
  );
}

/** Sun/moon icon from the reference; the morph is CSS (.tg rules in globals.css). */
function ThemeIcon({ theme, size }: { theme: Theme; size: number }) {
  return (
    <svg className="tg" data-theme={theme} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <g className="tg__rays" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="1.6" x2="12" y2="3.4" />
        <line x1="12" y1="20.6" x2="12" y2="22.4" />
        <line x1="1.6" y1="12" x2="3.4" y2="12" />
        <line x1="20.6" y1="12" x2="22.4" y2="12" />
        <line x1="4.65" y1="4.65" x2="5.9" y2="5.9" />
        <line x1="18.1" y1="18.1" x2="19.35" y2="19.35" />
        <line x1="4.65" y1="19.35" x2="5.9" y2="18.1" />
        <line x1="18.1" y1="5.9" x2="19.35" y2="4.65" />
      </g>
      <circle className="tg__disc" cx="12" cy="12" r="7" fill="currentColor" />
      <circle className="tg__cut" cx="12" cy="12" r="6.5" />
    </svg>
  );
}
