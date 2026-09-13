import { site } from "@/lib/site";
import { Reveal } from "../Reveal";
import { ToolsMarquee } from "../ToolsMarquee";
import { HomeBento } from "./HomeBento";

/**
 * Home composition: headline + description → tools marquee → bento container.
 *
 * `fit:` (≥1360px wide and ≥600px tall, see globals.css) makes home a single
 * non-scrolling screen: the section is exactly the viewport height minus
 * <main>'s 3rem top and bottom padding, and the bento takes whatever height is
 * left. Smaller screens keep the normal scrolling, stacked layout.
 */
export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="scroll-mt-8 fit:grid fit:h-[calc(100dvh_-_2_*_clamp(32px,5vh,54px))] fit:grid-cols-[minmax(0,1fr)] fit:grid-rows-[auto_auto_minmax(0,1fr)] fit:overflow-hidden"
    >
      <Reveal>
        <div className="min-w-0">
          <h1
            id="home-heading"
            className="text-[length:clamp(30px,3.5vw,72px)] leading-[1.06] font-bold tracking-[-0.03em] text-ink"
          >
            {site.tagline}
          </h1>

          <p className="mt-[clamp(12px,1.8vh,22px)] text-[length:clamp(14px,1.05vw,22px)] leading-[1.5] font-medium text-ink-muted">
            {site.heroDescription}
          </p>
        </div>

      </Reveal>

      <Reveal delay={0.18} className="mt-6 block fit:mt-[clamp(12px,1.9vh,18px)]">
        <ToolsMarquee />
      </Reveal>

      <HomeBento />
    </section>
  );
}
