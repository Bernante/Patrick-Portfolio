import type { ReactNode } from "react";
import Link from "next/link";
import { aboutPhotos, aiBuilds, projectShots, services, testimonials } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";

/** Icon-tile colour: Clay Brown, the theme primary. */
const ACCENT = "#6b352a";

/**
 * About card fan, copied from the reference's CSS: 3:4 cards
 * clamp(72px, 5.6vw, 96px) wide, stacked in one grid cell and centred, with a
 * 3px white ring, deep soft shadow and 12px corners. The transform order is the
 * reference's too — rotate first, then slide along the tilted axis: at rest
 * rotate(±9deg) translateX(±26px); on hover / keyboard focus rotate(±11deg)
 * translateX(±30px) and every card lifts 2px.
 */
const FAN_ICONS = ["robot", "code", "film"] as const;
const FAN = [
  "[transform:rotate(-9deg)_translateX(-26px)] group-hover:[transform:rotate(-11deg)_translateX(-30px)_translateY(-2px)] group-focus-within:[transform:rotate(-11deg)_translateX(-30px)_translateY(-2px)]",
  "group-hover:[transform:translateY(-2px)] group-focus-within:[transform:translateY(-2px)]",
  "[transform:rotate(9deg)_translateX(26px)] group-hover:[transform:rotate(11deg)_translateX(30px)_translateY(-2px)] group-focus-within:[transform:rotate(11deg)_translateX(30px)_translateY(-2px)]",
] as const;

/**
 * Home bento: one large rounded container holding six cards, laid out like the
 * reference (Projects, Services and Testimonials two columns wide). All card content comes
 * from `site.ts` — nothing about anyone else is shown here.
 *
 * Layout by screen:
 *  - `fit:` (one-screen desktop, see globals.css): 4 columns × 2 equal rows that
 *    fill the remaining viewport height; card content is compact and clipped.
 *  - 3xl: 4 columns, equal-height rows, scrolling page.
 *  - md / xl: 2 columns. lg (1024–1279px) and phones: 1 column.
 */
export function HomeBento() {
  const wide = "md:col-span-2 lg:col-span-1 xl:col-span-2";

  return (
    <Reveal delay={0.24} className="mt-6 block fit:mt-[clamp(12px,1.9vh,18px)] fit:min-h-0">
      <section
        aria-label="Overview"
        className="rounded-[2rem] border border-line bg-[linear-gradient(100deg,#ffffff_0%,#ffffff_62%,#f5e08a_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_60px_-36px_rgba(58,28,22,0.4)] sm:p-4 md:p-5 fit:h-full fit:p-3.5 fit:py-[clamp(8px,1.4vh,15.75px)]"
      >
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 3xl:auto-rows-fr 3xl:grid-cols-4 fit:h-full fit:grid-cols-4 fit:grid-rows-2 fit:gap-3">
          <BentoCard
            className={wide}
            icon="folder"
            title="Projects"
            href="/projects"
            description="Automations, funnels, sites and edits, each shipped for a client."
            aside={<ProjectReel />}
          />

          <BentoCard icon="user" title="About" href="/about" description="Who I am and how I work.">
            <div className="grid h-full min-h-[9rem] place-items-center fit:min-h-0">
              {FAN.map((fan, i) => {
                const photo = aboutPhotos.length ? aboutPhotos[i % aboutPhotos.length] : null;
                return (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`col-start-1 row-start-1 flex aspect-[3/4] w-28 items-center justify-center overflow-hidden rounded-[12px] bg-[#f4f4ed] shadow-[0_0_0_3px_#fff,0_14px_30px_-14px_rgba(6,12,26,0.6)] transition-transform duration-[520ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] fit:w-[clamp(72px,5.6vw,96px)] ${fan}`}
                    style={{ zIndex: i + 1 }}
                  >
                    {photo ? (
                      <img src={photo.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_20%]" />
                    ) : (
                      <Icon name={FAN_ICONS[i]} size={30} weight="duotone" className="text-blueberry" />
                    )}
                  </span>
                );
              })}
            </div>
          </BentoCard>

          <BentoCard
            icon="robot"
            title="AI Builds"
            href="/projects"
            description="Systems I have built and shipped."
          >
            <ChipRows />
          </BentoCard>

          <BentoCard
            className={wide}
            icon="stack"
            title="Services"
            href="/services"
            description="What I build for coaches, agencies and small teams."
          >
            <ol className="flex flex-col">
              {services.map((service) => (
                <li
                  key={service.title}
                  className="flex items-center gap-3 border-b border-line py-2 last:border-b-0 fit:gap-2 fit:py-[0.3rem]"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-soft fit:h-6 fit:w-6">
                    <Icon name={service.icon as IconName} size={16} className="text-blueberry" />
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-ink fit:truncate fit:text-[0.75rem]">
                    {service.title}
                  </span>
                  <span className="text-[0.8rem] text-ink-muted fit:text-[0.68rem]">{service.num}</span>
                </li>
              ))}
            </ol>
          </BentoCard>

          <BentoCard
            className={wide}
            icon="chats"
            title="Testimonials"
            href="/testimonials"
            description="What the people I build for say about the work."
            aside={
              testimonials.length ? (
                <ul className="flex flex-col gap-2">
                  {testimonials.map((t) => (
                    <li
                      key={t.name}
                      className="rounded-xl border border-line bg-white p-3 shadow-card fit:p-2.5"
                    >
                      <p className="font-semibold text-ink fit:text-[0.8rem]">{t.name}</p>
                      <p className="text-[0.9rem] text-ink-muted fit:text-[0.72rem]">{t.role}</p>
                      <p className="mt-1 text-[0.9rem] text-ink fit:text-[0.72rem]">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-line-strong bg-white p-4 fit:p-3">
                  <p className="font-semibold text-ink fit:text-[0.8rem]">Testimonials coming soon</p>
                  <p className="mt-1 text-[0.95rem] leading-snug text-ink-muted fit:text-[0.72rem]">
                    Real words from real clients will appear here.
                  </p>
                </div>
              )
            }
          />
        </ul>
      </section>
    </Reveal>
  );
}

/**
 * A bento card. The title is a link stretched over the whole card, so the card
 * is one click target without nesting interactive elements. With `aside`, the
 * card splits into text on the left and the aside on the right.
 */
function BentoCard({
  icon,
  title,
  description,
  href,
  className = "",
  aside,
  children,
}: {
  icon: IconName;
  title: string;
  description: string;
  href: string;
  className?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const header = (
    <>
      {/* z-10 (a flex-item stacking context, no `position`) keeps the header
          above media that overflows into it, like the reference's head, while
          the stretched link below still measures against the whole card. */}
      <div className="z-10 flex items-center gap-3 fit:gap-[10px]">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-cream fit:h-[34px] fit:w-[34px] fit:rounded-[10px]"
          style={{ backgroundColor: ACCENT }}
        >
          <Icon name={icon} size={22} weight="duotone" />
        </span>
        <h2 className="text-[1.3rem] font-bold text-ink fit:text-[clamp(16px,1.15vw,19px)] fit:leading-[1.15] fit:font-semibold">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none"
          >
            {title}
          </Link>
        </h2>
      </div>
      <p className="pointer-events-none z-10 mt-2.5 text-[1rem] leading-relaxed text-ink-muted fit:mt-[6px] fit:line-clamp-2 fit:text-[clamp(11.5px,0.74vw,13px)] fit:leading-[1.45]">
        {description}
      </p>
    </>
  );

  return (
    <li
      className={`group card card-hover relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[22px] bg-surface p-6 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blueberry fit:px-[clamp(12px,1.1vw,18px)] fit:py-[clamp(12px,1.4vh,18px)] ${className}`}
    >
      {aside ? (
        <div className="grid h-full min-h-0 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 fit:gap-3">
          <div className="min-w-0">{header}</div>
          {/* pointer-events-none: the aside (the screenshot reel, quotes) is
              drawn above the stretched title link, so without this, clicks on
              it would miss the link. Hover still reaches the card, so the reel
              still starts on hover. */}
          <div className="pointer-events-none min-h-0 overflow-hidden">{aside}</div>
        </div>
      ) : (
        <>
          {header}
          <div className="z-0 mt-4 min-h-0 flex-1 fit:mt-[clamp(8px,1.2vh,14px)]">{children}</div>
        </>
      )}
    </li>
  );
}

/** Copies of each chip per loop half; enough to overfill the widest card. */
const CHIP_REPEAT = 6;

/**
 * Sideways chip rows for the AI Builds card, modelled on the reference:
 *  - One row per entry in `aiBuilds`; even rows drift left, odd rows run the
 *    same `drift-left` keyframes in reverse so they drift right. 26s linear
 *    per loop, like the reference.
 *  - Paused until the card is hovered or keyboard-focused, and pauses in place
 *    when the pointer leaves.
 *  - Each track holds its chips twice and moves exactly half its width, so the
 *    restart is invisible. Spacing is right padding, not `gap`, so the halves
 *    are exactly equal.
 *  - Edges fade out with a 10% mask on each side.
 *  - The moving rows are aria-hidden; a visually hidden list names each build
 *    and its status once. Reduced motion is honoured by the rule in globals.css.
 */
function ChipRows() {
  return (
    <>
      <div
        aria-hidden="true"
        className="flex h-full flex-col justify-center gap-[8px] overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {aiBuilds.map((build, row) => (
          <div key={build.name} className="overflow-hidden">
            <div
              className={`flex w-max animate-[drift-left_26s_linear_infinite] [animation-play-state:paused] group-focus-within:[animation-play-state:running] group-hover:[animation-play-state:running] ${
                row % 2 ? "[animation-direction:reverse]" : ""
              }`}
            >
              {Array.from({ length: CHIP_REPEAT * 2 }, (_, i) => (
                <span key={i} className="flex-none pr-[8px]">
                  <span className="inline-flex h-[32px] items-center gap-[7px] rounded-full bg-white pr-[12px] pl-[9px] text-[12px] font-semibold tracking-[0.01em] whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_var(--color-line)]">
                    <Icon name={build.icon} size={15} weight="duotone" className="shrink-0 text-blueberry" />
                    {build.name}
                    <span
                      className={`ml-[2px] h-[6px] w-[6px] rounded-full ${build.status === "Live" ? "bg-[#22a15c]" : "bg-line-strong"}`}
                    />
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {aiBuilds.map((build) => (
          <li key={build.name}>
            {build.name} ({build.status})
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Vertical screenshot reel for the Projects card, modelled on the reference: a
 * tall strip that holds the shots twice and slides up by exactly half its
 * height per loop (`reel-up`, 22s linear), so the restart is invisible.
 *
 *  - Paused until the card is hovered or keyboard-focused; it pauses in place
 *    when the pointer leaves instead of jumping back.
 *  - The shots are repeated within each set so the strip always overfills the
 *    window even with only two projects.
 *  - Frame spacing is bottom padding, not flex `gap`: with a gap, -50% would
 *    land half a gap off the duplicate set and the loop would visibly jump.
 *  - The duplicate set is aria-hidden; only the first occurrence of each shot
 *    has alt text. Reduced motion is honoured by the global rule in globals.css.
 *  - Screenshots keep their real proportions (no cover-crop), so nothing at
 *    the edges is cut off.
 *  - Fixed height outside the one-screen layout, so the full strip can never
 *    stretch the card on phones or tablets.
 */
function ProjectReel() {
  const set = [...projectShots, ...projectShots];

  return (
    <div className="h-56 overflow-hidden rounded-xl mask-[linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] fit:h-full">
      <div className="animate-[reel-up_22s_linear_infinite] [animation-play-state:paused] group-focus-within:[animation-play-state:running] group-hover:[animation-play-state:running]">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {set.map((shot, i) => (
              <div key={`${copy}-${i}`} className="pb-3 fit:pb-2">
                <figure className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
                  <div
                    aria-hidden="true"
                    className="flex items-center gap-1.5 border-b border-line bg-cream-soft px-3 py-1.5"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <span className="h-2 w-2 rounded-full bg-line-strong" />
                    <span className="h-2 w-2 rounded-full bg-line-strong" />
                  </div>
                  <img
                    src={shot.src}
                    alt={copy === 0 && i < projectShots.length ? shot.alt : ""}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </figure>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
