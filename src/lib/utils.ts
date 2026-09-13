import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts, so a class
 * passed in by a caller reliably overrides the component's own default.
 * This is the standard shadcn/ui helper — every component in components/ui
 * expects it at this exact path (`@/lib/utils`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
