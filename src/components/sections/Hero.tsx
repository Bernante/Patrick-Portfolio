import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";
import { ToolsMarquee } from "../ToolsMarquee";
import { HomeBento } from "./HomeBento";
import { HomeExplore, HomeFacts, HomeProfile, HomeProof } from "./HomeMobile";

/**
 * Home composition.
 *
 * Desktop (1100px and up): headline + "Get in touch" → tools marquee → bento.
 * `fit:` (≥1360px wide and ≥600px tall, see globals.css) makes it a single
 * non-scrolling screen: the section is the viewport height minus <main>'s
 * vertical padding, and the bento takes whatever height is left.
 *
 * Phones and tablets (below 1100px), like the reference's phone home: profile
 * row → headline → description → facts → tools marquee → "Explore · Swipe"
 * tiles → "What clients say". The bento and the "Get in touch" pill are not
 * shown (the tab bar's Contact button replaces the pill). Blocks fade up in
 * turn as they enter.
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
          <HomeProfile />

          {/* Headline row copied from the reference: headline on the left, a
              "Get in touch" pill pinned top-right; stacked below 1100px, where
              the pill is hidden. */}
          <div className="flex flex-col items-start gap-3 lg:flex-row lg:justify-between lg:gap-[clamp(20px,4vw,56px)]">
            <h1
              id="home-heading"
              className="min-w-0 text-[length:clamp(30px,3.5vw,72px)] leading-[1.06] font-bold tracking-[-0.03em] text-ink max-[380px]:text-[28px]"
            >
              {site.tagline}
            </h1>
            <Link
              href="/contact"
              className="hidden h-[44px] shrink-0 items-center gap-2 rounded-full bg-blueberry-900 px-5 text-[14px] font-semibold tracking-[-0.006em] text-cream shadow-[0_1px_2px_rgba(6,12,26,0.12),0_8px_20px_-12px_rgba(58,28,22,0.55)] transition-[translate,scale,box-shadow,background-color] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-px hover:bg-blueberry-700 hover:shadow-[0_1px_2px_rgba(6,12,26,0.12),0_12px_26px_-12px_rgba(58,28,22,0.7)] active:scale-[0.97] active:duration-100 lg:inline-flex"
            >
              Get in touch
              <Icon name="arrow-up-right" size={16} weight="bold" className="text-cream-deep" />
            </Link>
          </div>

          <p className="mt-[clamp(12px,1.8vh,22px)] text-[length:clamp(14px,1.05vw,22px)] leading-[1.5] font-medium text-ink-muted">
            {site.heroDescription}
          </p>

          <HomeFacts />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-[20px] block lg:mt-6 fit:mt-[clamp(12px,1.9vh,18px)]">
        <ToolsMarquee />
      </Reveal>

      {/* Desktop only; `contents` keeps it a direct grid row of the section. */}
      <div className="hidden lg:contents">
        <HomeBento />
      </div>

      <Reveal delay={0.22} className="mt-[26px] flex flex-col gap-[26px] lg:hidden">
        <HomeExplore />
        <HomeProof />
      </Reveal>
    </section>
  );
}
