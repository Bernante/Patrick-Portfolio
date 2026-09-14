"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Phone / tablet theme toggle (below 1100px), copied from the reference's
 * floating theme button: a 44px glass circle fixed top-right, 14px from the
 * top (plus the safe area) and 16px from the right, shrinking to 92% while
 * pressed. Not shown on the home page, which has the toggle in its profile row.
 */
export function FloatingThemeToggle() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <ThemeToggle className="theme-btn-glass no-print fixed top-[calc(14px+env(safe-area-inset-top,0px))] right-[16px] z-50 grid h-[44px] w-[44px] place-items-center rounded-full border border-line text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_16px_-10px_rgba(58,28,22,0.35)] transition-transform duration-300 active:scale-[0.92] active:duration-100 lg:hidden" />
  );
}
