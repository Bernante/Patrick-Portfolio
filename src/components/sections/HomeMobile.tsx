import Link from "next/link";
import { asset, homeFacts, profilePhoto, projectShots, site, testimonials } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { ThemeToggle } from "../ThemeToggle";
import { VisitCount } from "../VisitCount";

/**
 * Home-page pieces that exist only on phones and tablets (below 1100px),
 * copied from the reference's phone home: the profile row, the facts row, the
 * "Explore · Swipe" tile row and the "What clients say" card. Every one is
 * hidden from 1100px up, where the sidebar and bento take over.
 */

/** Profile row (reference .hprofile): photo, name + verified badge, role, theme toggle. */
export function HomeProfile() {
  return (
    <header className="mb-[22px] flex items-center gap-[12px] lg:hidden">
      <img
        src={profilePhoto}
        alt=""
        width={56}
        height={56}
        className="h-[56px] w-[56px] shrink-0 rounded-full bg-white object-cover object-top shadow-[inset_0_0_0_1px_var(--color-line),0_6px_16px_-8px_rgba(58,28,22,0.35)]"
      />
      <div className="flex min-w-0 flex-col">
        <span className="inline-flex items-center gap-[4px] text-[16px] leading-[1.1] font-bold tracking-[-0.018em] text-ink">
          {site.name}
          <span className="relative inline-flex h-[16px] w-[16px] items-center justify-center">
            <span aria-hidden="true" className="absolute inset-[4px] rounded-full bg-white" />
            <Icon name="verified" size={16} weight="fill" className="relative text-[#0866FF]" />
            <span className="sr-only">Verified</span>
          </span>
        </span>
        <VisitCount className="mt-[3px] truncate text-[12.5px] tracking-[0.004em] text-ink-muted" />
      </div>
      <ThemeToggle className="theme-btn-glass ml-auto grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full border border-line text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_16px_-10px_rgba(58,28,22,0.35)] transition-transform duration-300 active:scale-[0.92] active:duration-100" />
    </header>
  );
}

/** Facts row (reference .hstats): 18px bold value over an 11.5px uppercase label. */
export function HomeFacts() {
  return (
    <ul role="list" className="mt-[16px] flex gap-[22px] lg:hidden">
      {homeFacts.map((fact) => (
        <li key={fact.label}>
          <b className="block text-[18px] leading-[1.5] font-bold tracking-[-0.02em] text-ink">{fact.value}</b>
          <span className="text-[11.5px] tracking-[0.05em] text-ink-muted uppercase">{fact.label}</span>
        </li>
      ))}
    </ul>
  );
}

type Tile = {
  n: string;
  label: string;
  href: string;
  title: string;
  desc: string;
  img?: string;
  icon?: IconName;
  variant?: "tint" | "accent";
  /** Icon in the orange rounded tile used on the Services page method cards. */
  orangeTile?: boolean;
};

const TILES: Tile[] = [
  { n: "01", label: "Projects", href: "/projects", title: "Real apps, funnels and GHL builds", desc: "Automations, funnels and sites I've built.", img: projectShots[0].src },
  { n: "02", label: "Services", href: "/services", title: "What I build", desc: "Automation, CRM, funnels, websites and apps.", icon: "funnel", variant: "tint", orangeTile: true },
  { n: "03", label: "About", href: "/about", title: `Hi, I’m ${site.firstName}.`, desc: "I build the systems that keep businesses running seamlessly behind the scenes.", img: asset("/about/about-illustration.webp") },
  { n: "04", label: "Testimonials", href: "/testimonials", title: "What clients say", desc: "Real words from real clients, coming soon.", icon: "chats", variant: "accent" },
  { n: "05", label: "Contact", href: "/contact", title: "FAQs / Contact", desc: "Quick answers, and how to reach me.", icon: "email" },
];

/**
 * "Explore · Swipe" (reference .hsec + .htiles): a sideways row of 236px × 290px
 * tiles (66% of the screen) that snaps as you swipe, running edge to edge.
 * Each tile: numbered pill, 170px picture or icon, title, description and a
 * round arrow. 220px wide at 380px and under; 260px on tablets.
 */
export function HomeExplore() {
  return (
    <section aria-labelledby="explore-heading" className="lg:hidden">
      <div className="flex items-baseline justify-between">
        <h2 id="explore-heading" className="text-[15px] font-bold tracking-[-0.012em] text-ink">
          Explore
        </h2>
        <span aria-hidden="true" className="text-[12.5px] font-semibold text-blueberry">
          Swipe
        </span>
      </div>

      <ul
        role="list"
        className="scrollbar-hidden -mx-[20px] mt-[6px] flex snap-x snap-proximity scroll-px-[20px] gap-[12px] overflow-x-auto overscroll-x-contain px-[20px] pt-[6px] pb-[10px]"
      >
        {TILES.map((tile) => (
          <li key={tile.href} className="shrink-0 snap-start">
            <Link
              href={tile.href}
              className={`group relative flex h-[290px] w-[min(236px,66vw)] flex-col overflow-hidden rounded-[20px] border border-line text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_1.5px_rgba(58,28,22,0.04),0_12px_30px_-20px_rgba(58,28,22,0.3)] transition-transform duration-300 active:scale-[0.97] active:duration-100 sm:w-[min(260px,40vw)] max-[380px]:w-[min(220px,72vw)] ${
                tile.variant === "tint"
                  ? "[background:linear-gradient(160deg,rgba(107,53,42,0.1),transparent_60%),var(--color-white)]"
                  : tile.variant === "accent"
                    ? "[background:linear-gradient(160deg,rgba(245,224,138,0.35),transparent_60%),var(--color-white)]"
                    : "bg-white"
              }`}
            >
              <span
                className={`absolute top-[12px] left-[12px] z-[1] rounded-full px-[9px] py-[5px] text-[10.5px] font-semibold tracking-[0.06em] uppercase ${
                  tile.variant ? "bg-[#fff1a6] text-[#3a1c16]" : "bg-[#3a1c16] text-[#fff1a6]"
                }`}
              >
                {tile.n} {tile.label}
              </span>
              {tile.img ? (
                <img src={tile.img} alt="" loading="lazy" decoding="async" className="block h-[170px] w-full object-cover object-top" />
              ) : tile.orangeTile ? (
                <span className="grid h-[170px] place-items-center">
                  <span className="grid h-[84px] w-[84px] place-items-center rounded-[24px] bg-[rgba(255,122,26,0.14)] text-[#ff7a1a] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.28)]">
                    <Icon name={tile.icon ?? "sparkle"} size={44} weight="regular" />
                  </span>
                </span>
              ) : (
                <span className="grid h-[170px] place-items-center text-blueberry">
                  <Icon name={tile.icon ?? "sparkle"} size={52} weight="duotone" />
                </span>
              )}
              <span className="flex flex-col gap-[4px] px-[16px] py-[14px]">
                <span className="text-[16px] leading-[1.2] font-semibold tracking-[-0.014em]">{tile.title}</span>
                <span className="pr-[30px] text-[12.5px] leading-[1.45] tracking-[0.004em] text-ink-muted">{tile.desc}</span>
              </span>
              <span
                aria-hidden="true"
                className="absolute right-[12px] bottom-[12px] grid h-[34px] w-[34px] place-items-center rounded-full bg-blueberry text-cream transition-transform duration-300 group-active:scale-90"
              >
                <Icon name="arrow-up-right" size={16} weight="bold" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * "What clients say" (reference .hsec + .hproof): a card with a 96px tile, an
 * uppercase kicker, a title and a meta line, linking to Testimonials. Shows the
 * first testimonial once there is one; "coming soon" until then.
 */
export function HomeProof() {
  const first = testimonials[0];

  return (
    <section aria-labelledby="proof-heading" className="lg:hidden">
      <div className="flex items-baseline justify-between">
        <h2 id="proof-heading" className="text-[15px] font-bold tracking-[-0.012em] text-ink">
          What clients say
        </h2>
        <Link href="/testimonials" className="text-[12.5px] font-semibold text-blueberry">
          See all
        </Link>
      </div>

      <Link
        href="/testimonials"
        className="mt-[14px] grid grid-cols-[96px_minmax(0,1fr)] items-center gap-[14px] rounded-[18px] border border-line bg-white p-[12px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_-18px_rgba(58,28,22,0.3)] transition-transform duration-300 active:scale-[0.98] active:duration-100"
      >
        <span aria-hidden="true" className="grid h-[96px] w-[96px] place-items-center rounded-[14px] bg-cream-soft text-blueberry">
          <Icon name="chats" size={36} weight="duotone" />
        </span>
        <span className="flex min-w-0 flex-col gap-[3px]">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-blueberry uppercase">Testimonials</span>
          <span className="text-[14px] leading-[1.3] font-bold">
            {first ? `“${first.quote}”` : "Testimonials coming soon"}
          </span>
          <span className="text-[12px] leading-[1.5] text-ink-muted">
            {first ? `${first.name}, ${first.role}` : "Real words from real clients will appear here."}
          </span>
        </span>
      </Link>
    </section>
  );
}
