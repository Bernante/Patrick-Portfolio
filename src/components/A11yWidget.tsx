"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Accessibility widget, copied from the reference site (portfolio.brewedops.
 * cloud) in this site's espresso/butter colours with the reference orange:
 *  - A 48px round button fixed bottom-left (above the tab bar below 1100px).
 *    Hover lifts it 2px; pressing shrinks it to 97%.
 *  - It opens a 300px panel above it: fades in (140ms) while rising 8px and
 *    growing from 98%, anchored bottom-left. Closes with ✕, Escape (focus goes
 *    back to the button), a click outside, or the button again. Closed, the
 *    panel is inert so it can't be tabbed into.
 *  - Text size A / A+ / A++ (page and sidebar at 100%, 112%, 125%), and switches
 *    for High contrast, Reduce motion and Underline links, plus Reset to
 *    default (disabled while everything is default).
 *  - Choices are data attributes on <html> (styles in globals.css), saved in
 *    localStorage "pb-a11y" and applied before first paint by layout.tsx, so
 *    they carry across reloads and pages. An `a11ychange` event tells the
 *    particle background to stop under Reduce motion.
 *  - Dark theme flips the panel to a light card, like the reference. Tints are
 *    mixed from currentColor so they flip with it.
 */

export const A11Y_STORAGE_KEY = "pb-a11y";

type TextSize = "md" | "lg" | "xl";
type Settings = { text: TextSize; contrast: boolean; motion: boolean; links: boolean };
type Toggle = "contrast" | "motion" | "links";

const DEFAULTS: Settings = { text: "md", contrast: false, motion: false, links: false };

const SIZES: { value: TextSize; label: string; aria: string; font: string }[] = [
  { value: "md", label: "A", aria: "Default text size", font: "text-[15px]" },
  { value: "lg", label: "A+", aria: "Larger text", font: "text-[16px]" },
  { value: "xl", label: "A++", aria: "Largest text", font: "text-[18px]" },
];

const SWITCHES: { key: Toggle; attr: string; label: string; desc: string }[] = [
  { key: "contrast", attr: "a11yContrast", label: "High contrast", desc: "Darker text, stronger edges" },
  { key: "motion", attr: "a11yMotion", label: "Reduce motion", desc: "No animation or drifting" },
  { key: "links", attr: "a11yLinks", label: "Underline links", desc: "Every link gets a line" },
];

function readSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) ?? "{}");
    return {
      text: saved.text === "lg" || saved.text === "xl" ? saved.text : "md",
      contrast: saved.contrast === true,
      motion: saved.motion === true,
      links: saved.links === true,
    };
  } catch {
    return DEFAULTS;
  }
}

function applySettings(settings: Settings) {
  const root = document.documentElement;
  if (settings.text === "md") delete root.dataset.a11yText;
  else root.dataset.a11yText = settings.text;
  for (const item of SWITCHES) {
    if (settings[item.key]) root.dataset[item.attr] = "true";
    else delete root.dataset[item.attr];
  }
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked: the settings still apply for this page.
  }
  window.dispatchEvent(new CustomEvent<Settings>("a11ychange", { detail: settings }));
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a]";

export function A11yWidget() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The saved settings were already applied by the head script; read them for the controls.
  useEffect(() => setSettings(readSettings()), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const update = (next: Settings) => {
    setSettings(next);
    applySettings(next);
  };

  const isDefault = settings.text === "md" && !settings.contrast && !settings.motion && !settings.links;

  return (
    <div
      ref={rootRef}
      className="no-print fixed bottom-[clamp(16px,3vw,28px)] left-[clamp(16px,3vw,28px)] z-[710] max-lg:bottom-[calc(94px+env(safe-area-inset-bottom,0px))] max-lg:left-[14px] max-lg:[@media(max-height:500px)]:bottom-[14px]"
    >
      <div
        role="dialog"
        aria-label="Accessibility options"
        inert={!open}
        className={`absolute bottom-[calc(100%+12px)] left-0 flex w-[min(300px,calc(100vw-32px))] origin-bottom-left flex-col gap-[12px] rounded-[18px] border border-[color-mix(in_srgb,#f6ecd9_14%,transparent)] bg-[#2a140f] p-[14px] text-[#f6ecd9] shadow-[0_30px_60px_-20px_rgba(20,10,8,0.7)] [transition:opacity_140ms_cubic-bezier(0.25,0.1,0.25,1),transform_340ms_cubic-bezier(0.2,0.8,0.2,1)] dark:border-[color-mix(in_srgb,#1c0f0b_14%,transparent)] dark:bg-[#f6ecd9] dark:text-[#1c0f0b] ${
          open ? "opacity-100 [transform:none]" : "pointer-events-none opacity-0 [transform:translateY(8px)_scale(0.98)]"
        }`}
      >
        <header className="flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-[-0.01em]">Accessibility</span>
          <button
            type="button"
            aria-label="Close accessibility options"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
            className={`grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-[color-mix(in_srgb,currentColor_8%,transparent)] hover:bg-[color-mix(in_srgb,currentColor_16%,transparent)] ${FOCUS}`}
          >
            <Icon name="close" size={16} weight="bold" className="opacity-75" />
          </button>
        </header>

        <div role="group" aria-label="Text size">
          <span className="mb-[6px] block text-[11px] font-semibold tracking-[0.08em] uppercase opacity-55">Text size</span>
          <div className="grid grid-cols-3 gap-[6px]">
            {SIZES.map((size) => {
              const on = settings.text === size.value;
              return (
                <button
                  key={size.value}
                  type="button"
                  aria-label={size.aria}
                  aria-pressed={on}
                  onClick={() => update({ ...settings, text: size.value })}
                  className={`h-[40px] rounded-[10px] border font-bold transition-[background-color,border-color] duration-[140ms] ${FOCUS} ${size.font} ${
                    on
                      ? "border-[#ff7a1a] bg-[#ff7a1a] text-[#fff] dark:text-[#1c0f0b]"
                      : "border-[color-mix(in_srgb,currentColor_12%,transparent)] bg-[color-mix(in_srgb,currentColor_9%,transparent)] hover:bg-[color-mix(in_srgb,currentColor_14%,transparent)]"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="flex flex-col gap-[4px]">
          {SWITCHES.map((item) => {
            const on = settings[item.key];
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => update({ ...settings, [item.key]: !on })}
                  className={`flex w-full items-center justify-between gap-[12px] rounded-[11px] px-[10px] py-[9px] text-left transition-[background-color] duration-[140ms] hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] ${FOCUS}`}
                >
                  <span className="flex flex-col gap-[1px]">
                    <span className="text-[13.5px] font-semibold">{item.label}</span>
                    <span className="text-[12px] opacity-60">{item.desc}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative h-[22px] w-[38px] flex-none rounded-full transition-[background-color] duration-[140ms] ${
                      on ? "bg-[#ff7a1a]" : "bg-[color-mix(in_srgb,currentColor_18%,transparent)]"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] left-[3px] h-[16px] w-[16px] rounded-full transition-transform duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        on ? "translate-x-[16px] bg-[#fff]" : "bg-current"
                      }`}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          disabled={isDefault}
          onClick={() => update(DEFAULTS)}
          className={`inline-flex h-[36px] items-center justify-center gap-[6px] rounded-[10px] bg-[color-mix(in_srgb,currentColor_9%,transparent)] text-[12.5px] font-semibold enabled:hover:bg-[color-mix(in_srgb,currentColor_14%,transparent)] disabled:cursor-default disabled:opacity-40 ${FOCUS}`}
        >
          <Icon name="reset" size={14} weight="bold" />
          Reset to default
        </button>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Accessibility options"
        title="Accessibility options"
        onClick={() => setOpen((value) => !value)}
        className={`grid h-[48px] w-[48px] place-items-center rounded-full border border-[color-mix(in_srgb,#f6ecd9_14%,transparent)] bg-[#2a140f] text-[#f6ecd9] shadow-[0_16px_38px_-16px_rgba(20,10,8,0.6)] transition-[translate,scale,box-shadow] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] active:duration-100 dark:border-[color-mix(in_srgb,#1c0f0b_14%,transparent)] dark:bg-[#f6ecd9] dark:text-[#2a140f] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-[2px] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_22px_48px_-18px_rgba(20,10,8,0.7)] ${FOCUS}`}
      >
        <Icon name="accessibility" size={22} weight="bold" />
      </button>
    </div>
  );
}
