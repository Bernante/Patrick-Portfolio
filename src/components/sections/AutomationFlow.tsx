"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon";

/**
 * "Automation Workflow" window from the reference Services page: a booking
 * flow drawn on a fixed 1000×388 board.
 *  - Top row: Submit Form → Booking Email → Client Booked → 24hr Reminder →
 *    1hr Reminder → Discovery Call, with a dashed "Booking Rescheduled" loop.
 *  - Discovery Call branches to Proposal Sent → Won, Maybe / Later → Nurture,
 *    and Lost.
 *  - Glowing dots travel along every cable (CSS offset-path, no JS loop);
 *    hovering a step lifts it 7px with a springy ease and an accent glow.
 * Desktop scales the board down to fit its box; phones keep it full size and
 * scroll it sideways, like the reference.
 */

const BOARD_W = 1000;
const BOARD_H = 388;
const TOP = 67;
const BOTTOM = 299;
const HALF = 31; // half of the 62px step tile

type Tone = "trigger" | "gate" | "win" | "lost";
type Step = { x: number; y: number; icon: IconName; title: string; note: string; tone?: Tone };

const STEPS: Step[] = [
  { x: 56, y: TOP, icon: "lightning", title: "Submit Form", note: "New lead trigger", tone: "trigger" },
  { x: 226, y: TOP, icon: "email", title: "Booking Email", note: "Send booking link" },
  { x: 396, y: TOP, icon: "calendar", title: "Client Booked", note: "Slot confirmed" },
  { x: 566, y: TOP, icon: "clock", title: "24hr Reminder", note: "Pre-appt email" },
  { x: 736, y: TOP, icon: "bell", title: "1hr Reminder", note: "Pre-appt email" },
  { x: 916, y: TOP, icon: "video", title: "Discovery Call", note: "Qualify the lead", tone: "gate" },
  { x: 106, y: BOTTOM, icon: "file", title: "Proposal Sent", note: "Scope + price" },
  { x: 290, y: BOTTOM, icon: "trophy", title: "Won", note: "Deal closed", tone: "win" },
  { x: 518, y: BOTTOM, icon: "hourglass", title: "Maybe / Later", note: "Not ready yet" },
  { x: 702, y: BOTTOM, icon: "heart", title: "Nurture", note: "Long-term drip" },
  { x: 916, y: BOTTOM, icon: "x-circle", title: "Lost", note: "Closed out", tone: "lost" },
];

/** A straight cable between two steps on the same row (right port → left port). */
const across = (a: Step, b: Step) => {
  const x1 = a.x + HALF;
  const x2 = b.x - HALF;
  const pull = (x2 - x1) / 2;
  return { d: `M${x1} ${a.y} C${x1 + pull} ${a.y} ${x2 - pull} ${b.y} ${x2} ${b.y}`, ends: [[x1, a.y], [x2, b.y]] };
};

/** A curved branch from under Discovery Call down to the top of a lower step. */
const drop = (to: Step) => {
  const x1 = 916;
  const y1 = TOP + 74;
  const y2 = to.y - HALF;
  return { d: `M${x1} ${y1} C${x1} ${y1 + 64} ${to.x} ${y2 - 64} ${to.x} ${y2}`, ends: [[x1, y1], [to.x, y2]] };
};

type Cable = { d: string; ends: number[][]; kind: "solid" | "dotted" | "loop"; seconds: number };

const [FORM, EMAIL, BOOKED, DAY, HOUR, CALL, PROPOSAL, WON, MAYBE, NURTURE, LOST] = STEPS;

const CABLES: Cable[] = [
  { ...across(FORM, EMAIL), kind: "solid", seconds: 2.2 },
  { ...across(EMAIL, BOOKED), kind: "solid", seconds: 2.2 },
  { ...across(BOOKED, DAY), kind: "solid", seconds: 2.2 },
  { ...across(DAY, HOUR), kind: "solid", seconds: 2.2 },
  { ...across(HOUR, CALL), kind: "solid", seconds: 2.4 },
  {
    // Booking Rescheduled: from under 1hr Reminder back to Client Booked.
    d: `M${HOUR.x} ${TOP + 74} C${HOUR.x} ${TOP + 104} ${BOOKED.x} ${TOP + 104} ${BOOKED.x} ${TOP + 74}`,
    ends: [[HOUR.x, TOP + 74], [BOOKED.x, TOP + 74]],
    kind: "loop",
    seconds: 3.4,
  },
  { ...drop(PROPOSAL), kind: "dotted", seconds: 4.2 },
  { ...drop(MAYBE), kind: "dotted", seconds: 3.4 },
  { d: `M916 ${TOP + 74} L916 ${BOTTOM - HALF}`, ends: [[916, TOP + 74], [916, BOTTOM - HALF]], kind: "dotted", seconds: 2.6 },
  { ...across(PROPOSAL, WON), kind: "solid", seconds: 2.2 },
  { ...across(MAYBE, NURTURE), kind: "solid", seconds: 2.2 },
];

/*
 * Tones override the tile's --flow-node-bg / --flow-node-border variables rather
 * than setting background or border colour again, so they never compete with
 * the base tile classes.
 */
const TONE_CARD: Record<Tone | "base", string> = {
  base: "text-ink",
  trigger:
    "rounded-l-[11px] text-blueberry [--flow-node-bg:linear-gradient(158deg,#fff8d6,#f5e08a)] [--flow-node-border:color-mix(in_srgb,var(--color-blueberry)_35%,transparent)] dark:[--flow-node-bg:linear-gradient(158deg,#3a241a,#2a1a12)]",
  gate: "text-blueberry [--flow-node-border:var(--color-blueberry)] shadow-[0_2px_6px_color-mix(in_srgb,var(--color-blueberry)_12%,transparent),0_16px_28px_-12px_color-mix(in_srgb,var(--color-blueberry)_34%,transparent),0_0_0_2px_color-mix(in_srgb,var(--color-blueberry)_13%,transparent)]",
  win: "text-[#2e9e6b] [--flow-node-border:color-mix(in_srgb,#2e9e6b_45%,transparent)]",
  lost: "text-[#d9544f] [--flow-node-border:color-mix(in_srgb,#d9544f_40%,transparent)]",
};

const TONE_TITLE: Record<Tone | "base", string> = {
  base: "text-ink",
  trigger: "text-ink",
  gate: "text-blueberry",
  win: "text-[#2e9e6b]",
  lost: "text-[#d9544f]",
};

export function AutomationFlow() {
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Desktop: shrink the fixed board to fit its box. Phones: full size, scrolls.
  useEffect(() => {
    const fit = fitRef.current;
    if (!fit) return;
    const desktop = window.matchMedia("(min-width: 1100px)");
    const update = () => {
      if (!desktop.matches) return setScale(1);
      const { width, height } = fit.getBoundingClientRect();
      setScale(Math.min(1, width / BOARD_W, height / BOARD_H));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(fit);
    desktop.addEventListener("change", update);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
    };
  }, []);

  return (
    <section
      aria-label="The booking flow, end to end"
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[rgba(58,28,22,0.1)] bg-white shadow-[0_30px_60px_-30px_rgba(58,28,22,0.4),0_12px_26px_-16px_rgba(58,28,22,0.22)] dark:border-line"
    >
      <div className="relative flex h-[42px] shrink-0 items-center border-b border-[rgba(58,28,22,0.08)] [background:var(--flow-titlebar)] px-[16px] dark:border-line">
        <span aria-hidden="true" className="inline-flex gap-[8px]">
          {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
            <span
              key={color}
              className="h-[12px] w-[12px] rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)]"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
        <span className="absolute left-1/2 -translate-x-1/2 text-[12.5px] font-semibold tracking-[0.02em] whitespace-nowrap text-ink-muted">
          Automation Workflow
        </span>
      </div>

      <div className="flow-canvas flex min-h-0 flex-1 flex-col px-[clamp(14px,2vw,28px)] py-[clamp(12px,2vh,26px)] max-sm:px-[14px] max-sm:py-[17px]">
        <div className="scrollbar-hidden min-h-0 w-full flex-1 overflow-x-auto lg:overflow-hidden">
          <div ref={fitRef} className="relative lg:h-full">
            <div
              className="relative mx-auto lg:absolute lg:top-1/2 lg:left-1/2 lg:mx-0 lg:[transform:translate(-50%,-50%)_scale(var(--flow-scale))]"
              style={{ width: BOARD_W, height: BOARD_H, ["--flow-scale" as string]: scale }}
            >
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-visible"
                width={BOARD_W}
                height={BOARD_H}
                viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
              >
                {CABLES.map((cable, i) => (
                  <g key={i}>
                    <path
                      d={cable.d}
                      fill="none"
                      strokeLinecap="round"
                      strokeWidth={cable.kind === "dotted" ? 2.6 : cable.kind === "loop" ? 2 : 2.3}
                      strokeDasharray={cable.kind === "dotted" ? "0.1 6" : cable.kind === "loop" ? "7 8" : undefined}
                      style={{ stroke: cable.kind === "loop" ? "var(--flow-loop)" : "var(--flow-cable)" }}
                    />
                    {cable.ends.map(([cx, cy]) => (
                      <circle
                        key={`${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r={3.2}
                        style={{ fill: cable.kind === "loop" ? "var(--flow-loop)" : "var(--flow-port)" }}
                      />
                    ))}
                  </g>
                ))}
                <text
                  x={(HOUR.x + BOOKED.x) / 2}
                  y={TOP + 112}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={600}
                  style={{ fill: "var(--flow-loop)" }}
                >
                  Booking Rescheduled
                </text>
              </svg>

              {/* Signals travelling along the cables. */}
              {CABLES.map((cable, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="flow-signal"
                  style={{ offsetPath: `path("${cable.d}")`, animationDuration: `${cable.seconds}s`, animationDelay: `-${(i * 0.37) % cable.seconds}s` }}
                />
              ))}

              <ol className="contents">
                {STEPS.map((step) => {
                  const tone = step.tone ?? "base";
                  return (
                    <li
                      key={step.title}
                      className="group absolute z-[3] flex w-[100px] flex-col items-center text-center"
                      style={{ left: step.x - 50, top: step.y - HALF }}
                    >
                      <span
                        className={`relative inline-flex h-[62px] w-[62px] items-center justify-center rounded-[18px] border border-[var(--flow-node-border)] [background:var(--flow-node-bg)] shadow-[0_1px_2px_rgba(58,28,22,0.05),0_9px_18px_-10px_rgba(58,28,22,0.2),0_24px_40px_-22px_rgba(58,28,22,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[translate,box-shadow,border-color,color] duration-[450ms] ease-[cubic-bezier(0.34,1.5,0.5,1)] group-hover:-translate-y-[7px] group-hover:border-blueberry group-hover:text-blueberry group-hover:shadow-[0_2px_6px_color-mix(in_srgb,var(--color-blueberry)_16%,transparent),0_26px_44px_-16px_color-mix(in_srgb,var(--color-blueberry)_42%,transparent),0_0_0_4px_color-mix(in_srgb,var(--color-blueberry)_10%,transparent)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_9px_18px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ${TONE_CARD[tone]}`}
                      >
                        <Icon name={step.icon} size={24} weight="regular" />
                      </span>
                      <span className="mt-[13px] block">
                        <strong className={`block text-[11.5px] leading-[1.25] font-semibold tracking-[-0.01em] ${TONE_TITLE[tone]}`}>
                          {step.title}
                        </strong>
                        <span className="mt-[3px] block text-[9.5px] leading-[1.3] text-ink-muted">{step.note}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
