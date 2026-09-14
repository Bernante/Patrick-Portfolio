import { asset } from "@/lib/site";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";

/**
 * Projects page, copied from the reference (portfolio.brewedops.cloud/projects)
 * but only the cards the owner picked: Automations, Funnels and sites, and the
 * three stacked build cards (GoHighLevel blueprint, How I build with AI, How I
 * ship end to end). Sizes, spacing and hover motion follow the reference CSS.
 *
 * No photos yet, on purpose: the Automations frames and the Funnels pages are
 * blank until the owner supplies real screenshots. Logos are tool logos that
 * already ship with the site.
 */

const GHL_LOGO = asset("/logos/gohighlevel.png");
const N8N_LOGO = asset("/logos/n8n.svg");
const CLAUDE_LOGO = asset("/logos/claude.svg");

/** Stacked build cards. Titles and descriptions are placeholders until the owner provides them. */
const BUILDS = [
  { kicker: "GoHighLevel blueprint", logo: GHL_LOGO, title: "Coming soon", desc: "The full GoHighLevel build will be added here soon." },
  { kicker: "How I build with AI", logo: CLAUDE_LOGO, title: "Coming soon", desc: "The tools, rules and loop I build with will be added here soon." },
  { kicker: "How I ship, end to end", logo: CLAUDE_LOGO, title: "Coming soon", desc: "The end-to-end workflow will be added here soon." },
] as const;

/** Shared card box: the reference bento card (padding, 22px corners, hover lift). */
const CARD =
  "group card card-hover relative min-h-0 min-w-0 overflow-hidden rounded-[22px] bg-surface px-[clamp(12px,1.1vw,18px)] py-[clamp(12px,1.4vh,18px)]";

/** Row height on desktop, from the reference's one-screen grid (≈330px at 940px tall, ≈255px at 734px). */
const ROW_H = "xl:h-[clamp(240px,35vh,340px)]";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-8">
      {/* Page header copied from the reference (pgrid__head): eyebrow, one-line
          title and lede, full width, 8px apart, no icon tile. */}
      <header className="flex flex-col gap-[8px]">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">Projects</p>
        <h1
          id="projects-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink"
        >
          Real apps, funnels and GHL builds you can open.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted">
          Everything here shipped. Open a card to walk through the work at full size.
        </p>
      </header>

      <Reveal className="mt-[clamp(16px,2.6vh,34px)] block">
        <div className="rounded-[2rem] border border-line [background:var(--glass-bg)] px-[clamp(14px,1.4vw,24px)] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)]">
          <ul className="grid grid-cols-1 gap-[clamp(10px,1vw,16px)] md:grid-cols-2 xl:grid-cols-4">
            {/* ---- Automations (two columns wide) ---- */}
            <li className={`${CARD} ${ROW_H} grid gap-3 md:col-span-2 sm:grid-cols-2 sm:gap-x-[14px]`}>
              <CardHead
                logos={[GHL_LOGO, N8N_LOGO]}
                title="Automations"
                description="Screens from the GoHighLevel and n8n workflows I build."
              />
              <ScreenReel />
            </li>

            {/* ---- Funnels and sites ---- */}
            <li className={`${CARD} ${ROW_H} flex flex-col`}>
              <CardHead logos={[GHL_LOGO]} title="Funnels and sites" description="Complete funnel builds and websites." />
              <PageFan />
            </li>

            {/* ---- Stacked build cards ---- */}
            <li className={`${ROW_H} grid min-h-0 min-w-0 gap-[clamp(8px,0.9vw,12px)] xl:grid-rows-3`}>
              {BUILDS.map((build) => (
                <BuildCard key={build.kicker} {...build} />
              ))}
            </li>
          </ul>
        </div>
      </Reveal>
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
      <h2 className="mt-[12px] text-[length:clamp(16px,1.15vw,19px)] leading-[1.15] font-semibold tracking-[-0.012em] text-ink">
        {title}
      </h2>
      <p className="mt-[6px] text-[length:clamp(11.5px,0.74vw,13px)] leading-[1.45] tracking-[0.004em] text-ink-muted">
        {description}
      </p>
    </div>
  );
}

/** Frames per loop half in the Automations reel. */
const FRAMES = 4;

/**
 * Automations media: a column of browser frames drifting up, as on the
 * reference (22s per loop, paused until hover or focus, pauses in place,
 * 12% top/bottom fade). Frames are blank until real screenshots are added.
 * Spacing is bottom padding so the two halves are exactly equal.
 */
function ScreenReel() {
  return (
    <div
      aria-hidden="true"
      className="h-[190px] min-h-0 overflow-hidden rounded-[14px] mask-[linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:h-full"
    >
      <div className="animate-[reel-up_22s_linear_infinite] [animation-play-state:paused] group-focus-within:[animation-play-state:running] group-hover:[animation-play-state:running]">
        {Array.from({ length: FRAMES * 2 }, (_, i) => (
          <div key={i} className="pb-[10px]">
            <div className="relative rounded-[12px] bg-white px-[4px] pt-[18px] pb-[4px] shadow-[inset_0_0_0_1px_var(--color-line),0_6px_18px_-14px_rgba(6,12,26,0.5)]">
              <span className="absolute top-[7px] left-[9px] flex gap-[4px]">
                <span className="h-[6px] w-[6px] rounded-full bg-blueberry" />
                <span className="h-[6px] w-[6px] rounded-full bg-line-strong" />
                <span className="h-[6px] w-[6px] rounded-full bg-line-strong" />
              </span>
              <div className="aspect-video rounded-[7px] bg-cream-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Funnels media: three blank 3:4 pages fanned like the reference (and the home
 * About card) — rotate ±9° and slide 26px at rest; ±11° and 30px with a 2px
 * lift on hover. Blank until real page screenshots are added.
 */
const FAN = [
  "[transform:rotate(-9deg)_translateX(-26px)] group-hover:[transform:rotate(-11deg)_translateX(-30px)_translateY(-2px)] group-focus-within:[transform:rotate(-11deg)_translateX(-30px)_translateY(-2px)]",
  "group-hover:[transform:translateY(-2px)] group-focus-within:[transform:translateY(-2px)]",
  "[transform:rotate(9deg)_translateX(26px)] group-hover:[transform:rotate(11deg)_translateX(30px)_translateY(-2px)] group-focus-within:[transform:rotate(11deg)_translateX(30px)_translateY(-2px)]",
] as const;

function PageFan() {
  return (
    <div
      aria-hidden="true"
      className="mt-[clamp(8px,1.2vh,14px)] grid min-h-[150px] flex-1 place-items-center xl:min-h-0"
    >
      {FAN.map((fan, i) => (
        <span
          key={i}
          className={`col-start-1 row-start-1 aspect-[3/4] w-[clamp(72px,5.6vw,96px)] rounded-[12px] bg-[var(--plate)] shadow-[0_0_0_3px_var(--plate-ring),0_14px_30px_-14px_rgba(6,12,26,0.6)] transition-transform duration-[520ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${fan}`}
          style={{ zIndex: i + 1 }}
        />
      ))}
    </div>
  );
}

/**
 * Stacked build card from the reference: 38px logo plate, kicker, title,
 * two-line description and a round arrow that nudges up-right on hover.
 */
function BuildCard({ kicker, logo, title, desc }: { kicker: string; logo: string; title: string; desc: string }) {
  return (
    <div className="group card card-hover grid min-h-[84px] min-w-0 grid-cols-[38px_minmax(0,1fr)_26px] items-center gap-x-[12px] overflow-hidden rounded-[16px] bg-surface px-[clamp(10px,0.9vw,14px)] py-[clamp(8px,1vh,12px)] xl:min-h-0">
      <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-white shadow-[inset_0_0_0_1px_var(--color-line)]">
        <img src={logo} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
      </span>
      <span className="flex min-w-0 flex-col gap-[1px]">
        <span className="truncate text-[8.5px] font-bold tracking-[0.12em] text-blueberry uppercase">{kicker}</span>
        <h3 className="truncate text-[length:clamp(12px,0.85vw,14px)] leading-[1.2] font-bold tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <span className="line-clamp-2 text-[length:clamp(9.5px,0.62vw,11px)] leading-[1.35] text-ink-muted">{desc}</span>
      </span>
      <span
        aria-hidden="true"
        className="grid h-[26px] w-[26px] place-items-center rounded-full border border-line-strong text-ink transition-[translate,border-color,color] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:border-blueberry group-hover:text-blueberry"
      >
        <Icon name="arrow-up-right" size={13} weight="bold" />
      </span>
    </div>
  );
}
