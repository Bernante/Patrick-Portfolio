"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { basePath } from "@/lib/base-path";
import { asset, site } from "@/lib/site";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";

/**
 * Projects page in the reference's visual language (portfolio.brewedops.cloud/
 * projects), rebuilt for exactly four cards.
 *
 * Desktop (1100px+): the glass panel fills the screen height (same spacing as
 * the reference page) and holds a 12-column, 2-row grid with the wide cards
 * on opposite corners so the weight balances left/right and top/bottom:
 *
 *   ┌──────────── Automations (7) ────────────┬──── Funnels and sites (5) ────┐
 *   ├──── How I build with AI (5) ────┬───────── Apps and extensions (7) ───────┤
 *
 * Both rows share the height equally, so there is no dead space under the
 * cards at any desktop size. Wide cards put copy on the left and moving media
 * on the right; the narrower cards stack copy over media that grows to fill.
 *
 * Phones/tablets (below 1100px): a filter pill, then a 2-column grid 10px apart.
 * Automations and Apps span both columns; Funnels and How I build with AI pair
 * up from 640px and span both columns on small phones.
 *
 * Content comes from the site: the Automations screenshot, the AGASPAY and
 * SalesTrack screenshots and names, and tool logos that already ship with it.
 */

const GHL_LOGO = asset("/logos/gohighlevel.png");
const N8N_LOGO = asset("/logos/n8n.svg");
const CLAUDE_LOGO = asset("/logos/claude.svg");
const CHATGPT_LOGO = asset("/logos/chatgpt.webp");
const VSCODE_LOGO = asset("/logos/vscode.png");
const PLAY_LOGO = asset("/logos/googleplay.svg");
const EXPO_LOGO = asset("/logos/expo.svg");
const CHROME_LOGO = asset("/logos/googlechrome.svg");

type Shot = { title: string; src: string; width: number; height: number } | { title: string; src: null };

/**
 * Automations screenshots, shown in the card reel and the pop-up in this order.
 * To add a project, replace a blank slot: put the image in
 * public/projects/automations/ and give its title, path and pixel size.
 */
const AUTOMATIONS: Shot[] = [
  {
    title: "Order Assistant — Messenger (Meta Direct)",
    src: asset("/projects/automations/order-assistant-messenger.webp"),
    width: 1820,
    height: 877,
  },
  { title: "Coming soon", src: null },
];

/**
 * Apps and extensions pop-up: blank "Coming soon" windows until there are
 * apps or extensions to show. Replace an entry the same way as AUTOMATIONS.
 */
const APPS: Shot[] = [
  { title: "Coming soon", src: null },
  { title: "Coming soon", src: null },
  { title: "Coming soon", src: null },
];

type Category = "ghl" | "funnels" | "apps" | "ai";
type Filter = "all" | Category;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ghl", label: "GHL" },
  { key: "funnels", label: "Funnels" },
  { key: "apps", label: "Apps" },
  { key: "ai", label: "AI" },
];

/** Shared card box: the reference bento card (padding, 22px corners, hover lift). */
const CARD =
  "group card card-hover relative min-h-0 min-w-0 overflow-hidden rounded-[22px] bg-surface px-[clamp(12px,1.1vw,18px)] py-[clamp(12px,1.4vh,18px)] max-lg:p-[12px]";

/**
 * Desktop panel height: the screen minus the reference page's spacing and the
 * header above it (eyebrow, title, lede), so the grid ends just above the fold.
 */
const PANEL_H =
  "lg:h-[max(480px,calc(100dvh-clamp(28px,5vh,64px)-34px-clamp(30px,3.1vw,60px)*1.06-clamp(14px,1vw,19px)*1.6-clamp(16px,2.6vh,34px)-clamp(16px,3vh,32px)))]";

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [automationsOpen, setAutomationsOpen] = useState(false);
  const [frameworkOpen, setFrameworkOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const appsRef = useRef<HTMLButtonElement>(null);
  const frameworkRef = useRef<HTMLButtonElement>(null);
  // Closing hands focus back to the card, like the reference.
  const closeAutomations = useCallback(() => {
    setAutomationsOpen(false);
    openerRef.current?.focus();
  }, []);
  const closeApps = useCallback(() => {
    setAppsOpen(false);
    appsRef.current?.focus();
  }, []);
  const closeFramework = useCallback(() => {
    setFrameworkOpen(false);
    frameworkRef.current?.focus();
  }, []);

  // Filtering only applies to the phone layout; desktop always shows all cards.
  const phoneHidden = (cat: Category) => (filter === "all" || filter === cat ? "" : "max-lg:hidden");

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-8 lg:mx-[calc(min(4vw,64px)-56px)] lg:mt-[calc(clamp(28px,5vh,64px)-3rem)] lg:mb-[calc(clamp(16px,3vh,32px)-3rem)]"
    >
      {/* Page header copied from the reference (pgrid__head): eyebrow, title
          and lede, 8px apart, no icon tile. */}
      <header className="flex flex-col gap-[8px] max-lg:pr-[56px]">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">Projects</p>
        <h1
          id="projects-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink"
        >
          From idea to working system.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted">
          Real apps, n8n automations, GoHighLevel funnels, and AI systems built and shipped.
        </p>
      </header>

      {/* Phone filter (reference .pfilter): segmented pill, 34px buttons. */}
      <div role="group" aria-label="Filter projects" className="mt-[16px] flex gap-[3px] rounded-full bg-[var(--tint)] p-[3px] lg:hidden">
        {FILTERS.map((option) => {
          const pressed = filter === option.key;
          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(option.key)}
              className={`min-h-[34px] flex-1 rounded-full text-[13px] font-semibold tracking-[-0.004em] transition-[background-color,color,transform] duration-150 active:scale-[0.96] ${
                pressed
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(6,12,26,0.08),0_3px_10px_-4px_rgba(58,28,22,0.25)]"
                  : "text-ink-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <Reveal className="mt-[clamp(16px,2.6vh,34px)] block">
        <div
          className={`rounded-[28px] border border-line [background:var(--glass-bg)] px-[clamp(14px,1.4vw,24px)] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)] max-sm:p-[12px] max-sm:rounded-[22px] ${PANEL_H}`}
        >
          <ul className="grid grid-cols-2 gap-[10px] lg:h-full lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(0,1fr))] lg:gap-[clamp(10px,1vw,16px)]">
            {/* ---- 1. Automations: wide, top left ---- */}
            <li
              className={`${CARD} col-span-2 flex flex-col gap-[clamp(8px,1.2vh,14px)] [transition:transform_.35s_cubic-bezier(0.22,1,0.36,1),box-shadow_.35s,border-color_.35s,scale_.34s_cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] lg:col-span-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-x-[clamp(12px,1.2vw,20px)] ${phoneHidden("ghl")}`}
            >
              {/* The whole card is one button that opens the pop-up (reference: bento__card--btn). */}
              <button
                ref={openerRef}
                type="button"
                aria-haspopup="dialog"
                aria-label="Open Automations screenshots"
                onClick={() => setAutomationsOpen(true)}
                className="absolute inset-0 z-[1] cursor-pointer rounded-[22px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blueberry"
              />
              <div className="relative flex min-w-0 flex-col">
                <CardHead
                  logos={[GHL_LOGO, N8N_LOGO]}
                  title="Automations"
                  description="Screens from the GoHighLevel and n8n workflows I build."
                />
                {/* Arrow that slides in on hover (reference: bento__arrow). */}
                <span
                  aria-hidden="true"
                  className="absolute top-[2px] right-0 text-blueberry opacity-0 [translate:-4px_4px] transition-[opacity,translate] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-focus-within:opacity-100 group-focus-within:[translate:0_0] group-hover:opacity-100 group-hover:[translate:0_0]"
                >
                  <Icon name="arrow-up-right" size={18} weight="bold" />
                </span>
                <span className="mt-auto hidden pt-[12px] text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase lg:block">
                  Open the screens
                </span>
              </div>
              <ScreenReel />
            </li>

            {/* ---- 2. Funnels and sites: top right ---- */}
            <li className={`${CARD} col-span-2 flex flex-col sm:col-span-1 lg:col-span-5 ${phoneHidden("funnels")}`}>
              <CardHead logos={[GHL_LOGO]} title="Funnels and sites" description="Complete funnel builds and websites." />
              <PageFan />
            </li>

            {/* ---- 3. How I build with AI: bottom left. The whole card is one
                    button that opens the framework in a browser-style window. ---- */}
            <li className={`${CARD} relative col-span-2 flex flex-col sm:col-span-1 lg:col-span-5 ${phoneHidden("ai")}`}>
              <button
                ref={frameworkRef}
                type="button"
                aria-haspopup="dialog"
                aria-label="Open the Agentic Framework"
                onClick={() => setFrameworkOpen(true)}
                className="absolute inset-0 z-[1] cursor-pointer rounded-[22px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blueberry"
              />
              <CardHead
                logos={[CLAUDE_LOGO, CHATGPT_LOGO, VSCODE_LOGO]}
                title="How I build with AI"
                description="The tools, the rules, and the loop I use to build apps with AI."
              />
              <AiLoop />
            </li>

            {/* ---- 4. Apps and extensions: wide, bottom right ---- */}
            <li
              className={`${CARD} col-span-2 flex flex-col gap-[clamp(8px,1.2vh,14px)] [transition:transform_.35s_cubic-bezier(0.22,1,0.36,1),box-shadow_.35s,border-color_.35s,scale_.34s_cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] lg:col-span-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-x-[clamp(12px,1.2vw,20px)] ${phoneHidden("apps")}`}
            >
              {/* Opens the same pop-up as Automations, with Coming soon windows. */}
              <button
                ref={appsRef}
                type="button"
                aria-haspopup="dialog"
                aria-label="Open Apps and extensions"
                onClick={() => setAppsOpen(true)}
                className="absolute inset-0 z-[1] cursor-pointer rounded-[22px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blueberry"
              />
              <div className="relative flex min-w-0 flex-col">
                <CardHead
                  logos={[PLAY_LOGO, EXPO_LOGO, CHROME_LOGO]}
                  title="Apps and extensions"
                  description="Mobile apps and Chrome extensions will be added here soon."
                />
              </div>
              <AppReel />
            </li>
          </ul>
        </div>
      </Reveal>

      {automationsOpen && <ShotsModal label="Automations" shots={AUTOMATIONS} onClose={closeAutomations} />}
      {appsOpen && <ShotsModal label="Apps and extensions" shots={APPS} onClose={closeApps} />}
      {frameworkOpen && <FrameworkModal onClose={closeFramework} />}
    </section>
  );
}

/** Hover motion per logo tile, from the reference (bento__logo:nth-child). */
const LOGO_HOVER = [
  "group-hover:[transform:translateY(-2px)_rotate(-4deg)]",
  "group-hover:[transform:translateY(-3px)]",
  "group-hover:[transform:translateY(-2px)_rotate(4deg)]",
] as const;

/**
 * Logo tiles, title and description, sized like the reference's bento head.
 * Several logos overlap by 8px, as on the reference's multi-tool cards.
 */
function CardHead({ logos, title, description }: { logos: string[]; title: string; description: string }) {
  return (
    <div className="min-w-0">
      <span className="flex items-center">
        {logos.map((logo, i) => (
          <span
            key={logo}
            className={`inline-grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-white shadow-[inset_0_0_0_1px_var(--color-line),0_6px_14px_-10px_rgba(6,12,26,0.5)] transition-transform duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${i > 0 ? "-ml-[8px]" : ""} ${LOGO_HOVER[i % LOGO_HOVER.length]}`}
          >
            <img src={logo} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
          </span>
        ))}
      </span>
      <h2 className="mt-[12px] text-[length:clamp(16px,1.15vw,19px)] leading-[1.15] font-semibold tracking-[-0.012em] text-ink max-sm:text-[14px]">
        {title}
      </h2>
      <p className="mt-[6px] text-[length:clamp(11.5px,0.74vw,13px)] leading-[1.45] tracking-[0.004em] text-ink-muted max-sm:text-[12px]">
        {description}
      </p>
    </div>
  );
}

/** Real macOS window buttons: close, minimise, zoom. */
function WindowDots({ size }: { size: number }) {
  return (
    <>
      {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
        <span
          key={color}
          className="rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{ width: size, height: size, backgroundColor: color }}
        />
      ))}
    </>
  );
}

/**
 * Automations media: small browser frames of AUTOMATIONS that drift, as on the
 * reference. Blank slots show an empty frame.
 *  - Desktop: a column drifting up (22s per loop) with a 12% top/bottom fade.
 *  - Phones/tablets: a 150px strip of 200px frames drifting sideways (26s per
 *    loop) with an 8% side fade.
 * Paused until hover or focus, pauses in place. The list is drawn twice and
 * spacing is padding, not gap, so the two halves are equal and the loop is seamless.
 */
function ScreenReel() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[150px] min-h-0 items-center overflow-hidden rounded-[14px] mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] lg:block lg:h-full lg:mask-[linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
    >
      {/* Play state is !important: the responsive animate-[] shorthand would otherwise reset it to running. */}
      <div className="flex w-max animate-[drift-left_26s_linear_infinite] [animation-play-state:paused]! group-focus-within:[animation-play-state:running]! group-hover:[animation-play-state:running]! lg:block lg:w-auto lg:animate-[reel-up_22s_linear_infinite]">
        {[...AUTOMATIONS, ...AUTOMATIONS].map((shot, i) => (
          <div key={i} className="w-[200px] pr-[10px] lg:mx-auto lg:w-[min(100%,36vh)] lg:pr-0 lg:pb-[10px]">
            <div className="relative rounded-[12px] bg-white px-[4px] pt-[18px] pb-[4px] shadow-[inset_0_0_0_1px_var(--color-line),0_6px_18px_-14px_rgba(6,12,26,0.5)]">
              <span className="absolute top-[7px] left-[9px] flex gap-[4px]">
                <WindowDots size={6} />
              </span>
              {shot.src ? (
                <img
                  src={shot.src}
                  alt=""
                  width={shot.width}
                  height={shot.height}
                  decoding="async"
                  className="block aspect-video w-full rounded-[7px] object-cover object-center"
                />
              ) : (
                <div className="aspect-video rounded-[7px] bg-cream-soft" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Apps media: empty window frames drifting sideways (reference:
 * bento__reel--row, 28s per loop) with an 8% side fade. No photos until the
 * owner has apps or extensions to show, so each says Coming soon. Paused until
 * hover or focus.
 */
const APP_FRAMES = 8;

function AppReel() {
  const shots = Array.from({ length: APP_FRAMES });
  return (
    <div
      aria-hidden="true"
      className="flex h-[150px] min-h-0 items-center overflow-hidden rounded-[14px] mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] lg:h-full"
    >
      <div className="flex w-max animate-[drift-left_28s_linear_infinite] [animation-play-state:paused]! group-focus-within:[animation-play-state:running]! group-hover:[animation-play-state:running]! motion-reduce:animate-none">
        {shots.map((_, i) => (
          <div key={i} className="w-[210px] pr-[10px] lg:w-[clamp(200px,17vw,340px)] lg:pr-[12px]">
            <div className="relative rounded-[12px] bg-white px-[4px] pt-[18px] pb-[4px] shadow-[inset_0_0_0_1px_var(--color-line),0_6px_18px_-14px_rgba(6,12,26,0.5)]">
              <span className="absolute top-[7px] left-[9px] flex gap-[4px]">
                <WindowDots size={6} />
              </span>
              <div className="grid aspect-[16/10] place-items-center rounded-[7px] bg-cream-soft text-[12px] font-semibold tracking-[0.02em] text-ink-muted lg:text-[length:clamp(11px,0.8vw,14px)]">
                Coming soon
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/**
 * Preview of the framework page inside a browser window, the media for the
 * "How I build with AI" card. The real page runs in an iframe rather than a
 * screenshot, so it never goes stale: it is laid out at desktop width and
 * scaled down, and the frame clips it just below the credits line.
 * `pointer-events-none` keeps every click on the card's own button, and the
 * iframe only loads once the card is near the viewport.
 */
/**
 * Width the framework page is laid out at inside the preview, and how much of
 * it shows. 960px keeps its desktop layout while making its type larger
 * relative to the frame than a wider layout would; 460px ends just under the
 * credits line.
 */
const PREVIEW_W = 960;
const PREVIEW_H = 460;

function AiLoop() {
  const host = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const areaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const viewRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(0.3);
  const [viewH, setViewH] = useState<number | null>(null);

  // The frame always takes the card's full width and the page is scaled to
  // that width, so the preview stays as large and legible as the card allows
  // and follows the window while it resizes. On desktop the card has a fixed
  // height: there the frame keeps its width and simply shows less of the page
  // from the bottom when the space under the card text is short.
  useEffect(() => {
    const area = areaRef.current;
    const bar = barRef.current;
    const view = viewRef.current;
    if (!area || !bar || !view) return;
    const desktop = window.matchMedia("(min-width: 1100px)");
    const update = () => {
      const s = view.clientWidth / PREVIEW_W;
      const natural = PREVIEW_H * s;
      setScale(s);
      setViewH(desktop.matches ? Math.max(60, Math.min(natural, area.clientHeight - bar.offsetHeight - 2)) : natural);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(area);
    observer.observe(view);
    desktop.addEventListener("change", update);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={areaRef} aria-hidden="true" className="mt-[clamp(8px,1.2vh,14px)] flex min-h-[130px] flex-1 items-start lg:min-h-0">
      <div className="w-full overflow-hidden rounded-[12px] border border-line-strong bg-white shadow-[0_14px_30px_-22px_rgba(58,28,22,0.45)] transition-transform duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[3px]">
        <span ref={barRef} className="flex items-center gap-[clamp(6px,0.6vw,10px)] border-b border-line bg-[linear-gradient(#f4f4ed,#e9e9e0)] px-[clamp(8px,0.8vw,12px)] py-[clamp(5px,0.5vw,8px)]">
          <WindowDots size={7} />
          <span className="min-w-0 flex-1 truncate rounded-full bg-[rgba(255,255,255,0.75)] px-[8px] py-[3px] text-[length:clamp(10px,0.75vw,12px)] leading-[1.4] text-[#5e4036]">
            <span className="font-semibold text-[#3a1c16]">{host}</span>
            <span className="opacity-70">/framework/</span>
          </span>
        </span>
        <span
          ref={viewRef}
          className="relative block aspect-[960/460] w-full overflow-hidden bg-[#f4f4ed]"
          style={viewH ? { height: viewH, aspectRatio: "auto" } : undefined}
        >
          <iframe
            src={`${basePath}/framework/`}
            title=""
            tabIndex={-1}
            loading="lazy"
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
            style={{ width: PREVIEW_W, height: PREVIEW_H, transform: `scale(${scale})` }}
          />
        </span>
      </div>
    </div>
  );
}

/**
 * The Agentic Framework pop-up, copied from the reference: the same dark
 * backdrop and rounded close button as the Automations one, but the panel is a
 * browser window — light title bar with the traffic-light dots and an address
 * pill — holding the /framework page in an iframe, so it scrolls inside the
 * frame exactly like the reference's.
 */
function FrameworkModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const host = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Agentic Framework"
      className="no-print fixed inset-0 z-[8000] grid grid-cols-[minmax(0,1fr)] place-items-center bg-[rgba(20,10,8,0.82)] px-[clamp(10px,2.4vw,40px)] pt-[clamp(56px,8vh,72px)] pb-[clamp(12px,3vh,32px)] animate-[pmodal-in_.26s_cubic-bezier(0.25,0.1,0.25,1)_both]"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[clamp(12px,2vh,20px)] right-[clamp(12px,1.6vw,24px)] z-[2] grid h-[42px] w-[42px] place-items-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.12)] text-white transition-[rotate,background-color] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:rotate-90 hover:bg-[rgba(255,255,255,0.22)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#fff1a6]"
      >
        <Icon name="close" size={18} weight="bold" />
      </button>

      <div className="flex h-full max-h-[1000px] w-full max-w-[1460px] flex-col overflow-hidden rounded-[14px] border border-[rgba(11,30,63,0.12)] bg-white shadow-[0_40px_90px_-40px_rgba(20,10,8,0.8)] animate-[pmodal-panel_.42s_cubic-bezier(0.2,0.8,0.2,1)_both]">
        {/* Title bar: dots, then the address pill, like a real browser. */}
        <div className="flex flex-none items-center gap-[12px] border-b border-[rgba(11,30,63,0.1)] bg-[linear-gradient(#f4f4ed,#e9e9e0)] px-[14px] py-[9px]">
          <WindowDots size={9} />
          <span className="min-w-0 flex-1 truncate rounded-full bg-[rgba(255,255,255,0.75)] px-[12px] py-[5px] text-[12px] text-[#5e4036] shadow-[inset_0_0_0_1px_rgba(11,30,63,0.08)]">
            <span className="font-semibold text-[#3a1c16]">{host}</span>
            <span className="opacity-70">/framework/</span>
          </span>
        </div>
        <iframe
          src={`${basePath}/framework/`}
          title={`${site.firstName}'s AI Agentic Framework`}
          loading="lazy"
          className="min-h-0 w-full flex-1 border-0 bg-cream"
        />
      </div>
    </div>,
    document.body,
  );
}

/**
 * Full-screen pop-up for the Automations and the Apps and extensions cards,
 * copied from the reference (.pmodal):
 *  - 82% dark backdrop fading in over 0.26s; the row rises 18px and grows from
 *    98.5% over 0.42s with a spring ease.
 *  - A 42px glass close button, top right, that turns 90° on hover and takes
 *    focus on open. Escape also closes; clicking the backdrop does not.
 *  - One row of large window frames (light title bar, red/yellow/green dots,
 *    16:10 screenshot) sliding left non-stop, and not pausing on hover.
 *  - Reduced motion: the row stands still and can be scrolled sideways instead.
 * Rendered into <body> so no transformed parent can trap its fixed position.
 * Page scroll is locked while it is open, and Tab stays on the close button.
 */
function ShotsModal({ label, shots, onClose }: { label: string; shots: Shot[]; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="no-print fixed inset-0 z-[8000] grid grid-cols-[minmax(0,1fr)] place-items-center bg-[rgba(20,10,8,0.82)] px-[clamp(12px,2.4vw,40px)] pt-[clamp(56px,8vh,72px)] pb-[clamp(14px,3vh,32px)] animate-[pmodal-in_.26s_cubic-bezier(0.25,0.1,0.25,1)_both]"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[clamp(12px,2vh,20px)] right-[clamp(12px,1.6vw,24px)] z-[2] grid h-[42px] w-[42px] place-items-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.12)] text-white transition-[rotate,background-color] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:rotate-90 hover:bg-[rgba(255,255,255,0.22)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#fff1a6]"
      >
        <Icon name="close" size={18} weight="bold" />
      </button>

      <div className="flex h-full min-h-0 w-full max-w-[1560px] min-w-0 items-center overflow-hidden animate-[pmodal-panel_.42s_cubic-bezier(0.2,0.8,0.2,1)_both]">
        <div className="w-full overflow-hidden motion-reduce:overflow-x-auto">
          <ul className="flex w-max animate-[drift-left_28s_linear_infinite] motion-reduce:animate-none">
            {[...shots, ...shots].map((shot, i) => (
              <li
                key={i}
                // The second copy only exists for the seamless loop.
                aria-hidden={i >= shots.length || undefined}
                className="w-[clamp(520px,46vw,820px)] shrink-0 pr-[clamp(20px,2vw,30px)] max-[720px]:w-[min(88vw,480px)]"
              >
                <figure className="overflow-hidden rounded-[16px] border border-[rgba(11,30,63,0.12)] bg-[#fff] shadow-[0_1px_0_rgba(11,30,63,0.03),0_18px_40px_-26px_rgba(11,30,63,0.34)]">
                  <span aria-hidden="true" className="flex items-center gap-[6px] border-b border-[rgba(11,30,63,0.12)] bg-[linear-gradient(#f4f4ed,#e9e9e0)] px-[12px] py-[9px]">
                    <WindowDots size={9} />
                  </span>
                  {shot.src ? (
                    <img
                      src={shot.src}
                      alt={shot.title}
                      width={shot.width}
                      height={shot.height}
                      decoding="async"
                      className="block aspect-[16/10] w-full bg-[#f4f4ed] object-cover object-center"
                    />
                  ) : (
                    <div className="grid aspect-[16/10] place-items-center bg-[#f4f4ed] text-[14px] font-semibold tracking-[0.02em] text-[#8a8f9c]">
                      Coming soon
                    </div>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Funnels media: three blank 3:4 pages fanned like the reference (and the home
 * About card) — rotate ±9° and slide 26px at rest; ±11° and 30px with a 2px
 * lift on hover. On desktop the pages scale with the card height so the fan
 * fills its space. Blank until real page screenshots are added.
 */
const FAN = [
  "[transform:rotate(-9deg)_translateX(-26%)] group-hover:[transform:rotate(-11deg)_translateX(-30%)_translateY(-2px)] group-focus-within:[transform:rotate(-11deg)_translateX(-30%)_translateY(-2px)]",
  "group-hover:[transform:translateY(-2px)] group-focus-within:[transform:translateY(-2px)]",
  "[transform:rotate(9deg)_translateX(26%)] group-hover:[transform:rotate(11deg)_translateX(30%)_translateY(-2px)] group-focus-within:[transform:rotate(11deg)_translateX(30%)_translateY(-2px)]",
] as const;

function PageFan() {
  return (
    <div
      aria-hidden="true"
      className="mt-[clamp(8px,1.2vh,14px)] grid min-h-[150px] flex-1 place-items-center lg:min-h-0 lg:py-[6px]"
    >
      {FAN.map((fan, i) => (
        <span
          key={i}
          className={`col-start-1 row-start-1 aspect-[3/4] w-[96px] rounded-[12px] bg-[var(--plate)] shadow-[0_0_0_3px_var(--plate-ring),0_14px_30px_-14px_rgba(6,12,26,0.6)] transition-transform duration-[520ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:h-full lg:max-h-[190px] lg:w-auto ${fan}`}
          style={{ zIndex: i + 1 }}
        />
      ))}
    </div>
  );
}
