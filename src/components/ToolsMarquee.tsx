"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { InfiniteSlider } from "@/components/ui/logo-marquee";
import { tools } from "@/lib/site";

/**
 * "Tools I work with" — built on the InfiniteSlider from components/ui.
 *
 * Layout: an outer pill that fades to butter yellow on its right edge, holding a
 * label block, a hairline divider, and an inner white track where tools sit as
 * plain logo + name entries separated by thin vertical rules.
 *
 * Accessibility notes:
 *  - InfiniteSlider renders its children twice to make the loop seamless, so
 *    the moving strip is marked aria-hidden and a single visually-hidden list
 *    carries the real content. Screen readers hear each tool once.
 *  - `durationOnHover` is much slower than the base duration, so hovering
 *    nearly stops the strip to read it.
 *  - Under `prefers-reduced-motion` the slider is not rendered at all — the
 *    tools become a plain static wrapped list.
 *
 * The static list is also what renders on the server. `useReducedMotion` can
 * only know the real preference in the browser, so branching on it during SSR
 * makes the server and client markup disagree and hydration fails. Gating on
 * `mounted` keeps the first client render identical to the server's.
 */
export function ToolsMarquee() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const showStatic = !mounted || reduced;

  return (
    <section
      aria-labelledby="tools-heading"
      className="rounded-[2rem] border border-line bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_72%,#f5e08a_100%)] p-2 shadow-card"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="shrink-0 px-5 py-3 lg:py-2 lg:pr-6">
          {/* Clay Brown: ~9.7:1 on white, readable at this small size. */}
          <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">
            Daily drivers
          </p>
          <h2 id="tools-heading" className="mt-0.5 text-[length:clamp(15px,1.15vw,20px)] leading-[1.15] font-bold whitespace-nowrap text-ink">
            Tools I work with
          </h2>
        </div>

        <span aria-hidden="true" className="hidden h-12 w-px shrink-0 bg-line lg:block" />

        <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-2xl border border-line bg-white py-3.5 lg:ml-3">
          {showStatic ? (
            /* No motion (or not yet mounted): a plain, fully readable list. */
            <ul className="flex flex-wrap items-center gap-y-3">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <ToolItem name={tool.name} logo={tool.logo} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <InfiniteSlider
                gap={0}
                duration={45}
                durationOnHover={400}
                className="flex-1 mask-[linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)]"
              >
                {tools.map((tool) => (
                  <div key={tool.name} aria-hidden="true">
                    <ToolItem name={tool.name} logo={tool.logo} />
                  </div>
                ))}
              </InfiniteSlider>

              {/* The accessible copy of the same content, announced once. */}
              <ul className="sr-only">
                {tools.map((tool) => (
                  <li key={tool.name}>{tool.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ToolItem({ name, logo }: { name: string; logo: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3 border-r border-line px-10">
      {/* Decorative: the visible label right beside it already names the tool,
          so an alt here would make screen readers say it twice. */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        loading="lazy"
        decoding="async"
        className="pointer-events-none h-6 w-6 shrink-0 object-contain select-none"
      />
      <span className="text-[13.5px] font-semibold whitespace-nowrap text-ink">{name}</span>
    </span>
  );
}
