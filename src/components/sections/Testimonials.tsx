"use client";

import { useState } from "react";
import { testimonials } from "@/lib/site";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";

/**
 * Testimonials page, laid out like the reference (portfolio.brewedops.cloud/
 * testimonials) in this site's clay/butter design, with no invented clients:
 *  - Header: eyebrow, large title, lede.
 *  - One glass panel. Desktop (1100px+): two columns, 0.8fr / 1.5fr, filling
 *    the screen height. Left, a dark featured "video" stage with a play button
 *    and a two-tab picker; right, a titled list of three numbered rows with a
 *    mark tile, badge, text, tag shapes and a large faint number.
 *  - Below 1100px everything stacks (stage min(56vh, 420px) tall, numbers
 *    hidden); below 640px the picker tabs and the rows stack too.
 *  - Interactions from the reference: hovering the stage slowly zooms its
 *    backdrop and grows the play button; the picker tabs switch the featured
 *    slot with a sliding underline.
 * Everything is a coming-soon placeholder: the stage plays nothing, and no
 * names, quotes, photos, ratings or durations are shown. When real quotes are
 * added to `testimonials` in site.ts, they are listed instead.
 */

const SLOTS = ["01", "02"] as const;
const ROWS = ["01", "02", "03"] as const;
/** Widths of the empty tag shapes in each row. */
const TAG_SHAPES = [70, 84, 64] as const;

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-8 lg:mx-[calc(min(4vw,64px)-56px)] lg:mt-[calc(clamp(28px,5vh,64px)-3rem)] lg:mb-[calc(clamp(16px,3vh,32px)-3rem)]"
    >
      {/* Desktop spacing copied from the reference page: min(4vw, 64px) sides, clamp(28px,5vh,64px)
          above the header and clamp(16px,3vh,32px) below the panel, replacing the layout's 56px / 3rem. */}
      <header className="flex flex-col gap-[8px] max-lg:pr-[56px]">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">Testimonials</p>
        <h1
          id="testimonials-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink max-lg:leading-[1.08] max-lg:tracking-[-0.022em]"
        >
          The people who will have worked with me.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted max-lg:leading-[1.5] max-lg:font-medium">
          Coming soon — real words from real clients will appear here.
        </p>
      </header>

      {testimonials.length ? <QuoteList /> : <ComingSoon />}
    </section>
  );
}

/* ------------------------------------------------------------ Coming soon */

function ComingSoon() {
  const [active, setActive] = useState(0);

  return (
    <Reveal className="mt-[clamp(16px,2.6vh,34px)] block">
      <div className="flex flex-col gap-[18px] rounded-[28px] border border-line [background:var(--glass-bg)] px-[14px] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)] max-sm:rounded-[22px] max-sm:p-[12px] max-sm:gap-[12px] lg:grid lg:h-[max(460px,calc(100dvh-clamp(28px,5vh,64px)-34px-clamp(30px,3.1vw,60px)*1.06-clamp(14px,1vw,19px)*1.6-clamp(16px,2.6vh,34px)-clamp(16px,3vh,32px)))] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.5fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-[clamp(16px,1.6vw,28px)] lg:px-[clamp(14px,1.4vw,24px)]">
        {/* ---- Featured stage + picker ---- */}
        <div className="flex min-h-0 min-w-0 flex-col gap-[clamp(10px,1.2vh,14px)]">
          <FeaturedStage slot={SLOTS[active]} />

          <div
            role="group"
            aria-label="Featured testimonial"
            className="grid flex-none grid-cols-2 overflow-hidden rounded-[14px] bg-surface shadow-[inset_0_0_0_1px_var(--color-line-strong)] max-sm:grid-cols-1"
          >
            {SLOTS.map((slot, i) => {
              const on = active === i;
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  className={`relative flex min-w-0 items-center gap-[10px] px-[12px] py-[9px] text-left transition-[background-color,color] duration-[220ms] after:absolute after:right-[12px] after:bottom-0 after:left-[12px] after:h-[2px] after:origin-left after:rounded-t-[2px] after:bg-[#ff7a1a] after:transition-transform after:duration-[260ms] after:ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-2 focus-visible:-outline-offset-[3px] focus-visible:outline-blueberry ${
                    i > 0 ? "shadow-[inset_1px_0_0_var(--color-line)] max-sm:shadow-[inset_0_1px_0_var(--color-line)]" : ""
                  } ${on ? "bg-white text-ink after:scale-x-100" : "text-ink-muted after:scale-x-0 hover:bg-[var(--tint)] hover:text-ink"}`}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-[32px] w-[44px] flex-none place-items-center rounded-[8px] bg-[#2a140f] text-[#fff1a6] shadow-[inset_0_0_0_1px_rgba(58,28,22,0.12)]"
                  >
                    <Icon name="play" size={12} weight="fill" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-[1px]">
                    <span className="truncate text-[12.5px] font-bold tracking-[-0.005em]">Testimonial {slot}</span>
                    <span
                      className={`truncate text-[10.5px] font-semibold tracking-[0.08em] uppercase max-sm:text-[12px] ${on ? "text-[#b4490a] dark:text-[#ff9a4d]" : ""}`}
                    >
                      Coming soon
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Numbered list ---- */}
        <div className="flex min-h-0 min-w-0 flex-col gap-[clamp(10px,1.4vh,16px)]">
          <div className="flex flex-none flex-col gap-[2px]">
            <h2 className="text-[length:clamp(18px,1.5vw,26px)] leading-[1.15] font-bold tracking-[-0.028em] text-ink">
              Client stories
            </h2>
            <p className="text-[13px] text-ink-muted">Coming soon.</p>
          </div>

          <ul className="grid min-h-0 overflow-hidden rounded-[22px] border border-line-strong bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(6,12,26,0.04),0_24px_50px_-36px_rgba(58,28,22,0.45)] lg:flex-1 lg:grid-rows-3">
            {ROWS.map((row, i) => (
              <li
                key={row}
                className={`relative flex min-h-0 items-center gap-[clamp(14px,1.3vw,22px)] overflow-hidden px-[clamp(18px,1.5vw,28px)] py-[clamp(10px,1.4vh,20px)] max-sm:flex-col max-sm:items-start ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-[clamp(10px,1vw,18px)] -translate-y-1/2 text-[length:clamp(56px,6vw,96px)] leading-none font-extrabold tracking-[-0.04em] text-ink opacity-[0.05] select-none max-lg:hidden dark:opacity-[0.07]"
                >
                  {row}
                </span>
                <span
                  aria-hidden="true"
                  className="grid h-[clamp(48px,3.4vw,58px)] w-[clamp(48px,3.4vw,58px)] flex-none place-items-center rounded-[14px] bg-[var(--plate)] text-[#ff7a1a] shadow-[inset_0_0_0_1px_var(--color-line)]"
                >
                  <Icon name="chats" size={28} weight="duotone" />
                </span>
                <span className="relative flex min-w-0 flex-1 flex-col justify-center gap-[clamp(3px,0.5vh,6px)] lg:pr-[clamp(56px,5vw,88px)]">
                  <span className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
                    <span className="text-[length:clamp(16px,min(1.3vw,2.45vh),23px)] leading-[1.15] font-bold tracking-[-0.015em] text-ink">
                      Testimonial {row}
                    </span>
                    <span className="rounded-full bg-[rgba(255,122,26,0.1)] px-[10px] py-[3px] text-[length:clamp(10.5px,min(0.74vw,1.35vh),12.5px)] font-bold tracking-[0.05em] whitespace-nowrap text-[#b4490a] uppercase shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] dark:text-[#ff9a4d] max-sm:text-[11.5px]">
                      Coming soon
                    </span>
                  </span>
                  <span className="max-w-[78ch] text-[length:clamp(12.5px,min(0.95vw,1.8vh),16.5px)] leading-[1.5] text-ink-muted">
                    Real words from real clients will appear here.
                  </span>
                  {/* Empty tag shapes: tags will name the real work once there is a client. */}
                  <span aria-hidden="true" className="mt-[2px] flex flex-wrap gap-[6px]">
                    {TAG_SHAPES.map((w) => (
                      <span
                        key={w}
                        className="h-[calc(clamp(11px,min(0.72vw,1.4vh),12.5px)*1.5+6px)] rounded-full bg-[var(--tint)] shadow-[inset_0_0_0_1px_var(--color-line)] max-sm:h-[24px]"
                        style={{ width: w }}
                      />
                    ))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Featured stage: a dark card in place of a video poster. Purely visual — the
 * play button marks where a real testimonial video will go and plays nothing.
 * Hover (or focus within the page's pointer) zooms the backdrop 1.02 → 1.06
 * over 0.7s and grows the play button, as on the reference.
 */
function FeaturedStage({ slot }: { slot: string }) {
  return (
    <div
      role="img"
      aria-label={`Testimonial ${slot} video placeholder. Coming soon. Real words from real clients will appear here.`}
      className="group relative min-h-0 flex-1 overflow-hidden rounded-[22px] border border-line-strong bg-[#2a140f] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(6,12,26,0.04),0_30px_60px_-36px_rgba(58,28,22,0.55)] max-lg:h-[min(56vh,420px)] max-lg:flex-none dark:bg-[#0f0907]">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.02] [background:radial-gradient(120%_80%_at_28%_18%,rgba(255,241,166,0.16),transparent_60%),radial-gradient(90%_70%_at_82%_92%,rgba(227,164,127,0.22),transparent_65%),linear-gradient(160deg,#3a1c16,#1e0e0a)] transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-[1.02]"
      >
        <Icon
          name="chats"
          size={220}
          weight="fill"
          className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[#fff1a6] opacity-[0.06]"
        />
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-0 [background:linear-gradient(rgba(20,10,8,0.1),rgba(20,10,8,0)_35%,rgba(20,10,8,0.78))]"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 grid h-[clamp(60px,4.6vw,76px)] w-[clamp(60px,4.6vw,76px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ff7a1a] text-[#2a140f] shadow-[0_0_0_8px_rgba(255,122,26,0.22),0_18px_40px_-14px_rgba(0,0,0,0.7)] transition-[scale,box-shadow] duration-[260ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06] group-hover:shadow-[0_0_0_12px_rgba(255,122,26,0.18),0_22px_44px_-14px_rgba(0,0,0,0.75)] motion-reduce:transition-none"
      >
        <Icon name="play" size={26} weight="bold" className="ml-[3px]" />
      </span>
      {/* Caption sized like the reference's cover meta: kicker clamp(14px,1.05vw,18px), sub clamp(11px,0.7vw,12.5px),
          in sentence case so the longer placeholder sentence stays on one line like the reference's sub. */}
      <span
        aria-hidden="true"
        className="absolute right-[clamp(14px,1.3vw,22px)] bottom-[clamp(14px,1.6vh,22px)] left-[clamp(14px,1.3vw,22px)] flex flex-col gap-[3px] text-[#fff]"
      >
        <span className="text-[length:clamp(14px,1.05vw,18px)] leading-[1.5] font-bold tracking-[-0.012em] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
          Coming soon.
        </span>
        <span className="text-[length:clamp(11px,0.7vw,12.5px)] leading-[1.5] font-semibold text-[rgba(255,255,255,0.72)] max-sm:text-[12px]">
          Real words from real clients will appear here.
        </span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------- Real quotes (later) */

function QuoteList() {
  return (
    <ul className="mt-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal as="li" key={t.name} delay={0.05 * (i % 3)} className="card flex flex-col rounded-xl2 p-7">
          <Icon name="chats" size={28} weight="duotone" className="text-blueberry" />
          <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
          <p className="mt-5 font-semibold text-ink">{t.name}</p>
          <p className="text-[0.95rem] text-ink-muted">{t.role}</p>
        </Reveal>
      ))}
    </ul>
  );
}
