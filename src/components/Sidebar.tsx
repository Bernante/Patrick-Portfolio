"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, profilePhoto, site } from "@/lib/site";
import { CustomCursorTarget } from "@/components/ui/custom-cursor";
import { Icon, type IconName } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Desktop sidebar (1100px and up). On phones and tablets it is not shown at
 * all, like the reference: navigation there is the bottom tab bar
 * (MobileTabBar.tsx), the theme toggle floats top-right (FloatingThemeToggle)
 * and the home page carries the profile row (HomeMobile.tsx).
 */
export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside data-sidebar className="no-print scrollbar-hidden hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[312px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:px-[30px] lg:pt-[clamp(28px,4vh,52px)] lg:pb-[28px]">
      {/* Profile */}
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="rounded-full">
          <Avatar />
        </Link>
        <h2 className="mt-[20px] flex items-center gap-[7px] text-[22px] leading-[1.2] font-bold tracking-[-0.022em] text-ink">
          {site.name}
          {/* Facebook-style verified badge: a blue seal with a white check.
              The white dot sits behind the seal so the check cut-out stays
              white on any background. */}
          <span className="relative inline-flex h-6 w-6 items-center justify-center" title="Verified professional">
            <span aria-hidden="true" className="absolute inset-[6px] rounded-full bg-white" />
            <Icon name="verified" size={24} weight="fill" className="relative text-[#0866FF]" />
            <span className="sr-only">Verified</span>
          </span>
        </h2>
        <p className="mt-[5px] text-[14.5px] tracking-[0.004em] text-ink-muted">{site.shortRole}</p>

        <ul className="mt-[18px] flex items-center justify-center gap-[10px]">
          {site.socials.map((social) => (
            <li key={social.label}>
              {/* size-auto drops the variant's fixed box so the link keeps its
                  own circle; hover:opacity-100 keeps the component's dimming
                  from fighting the link's existing hover style. */}
              <CustomCursorTarget className="size-auto hover:opacity-100">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line bg-white/70 text-blueberry transition hover:-translate-y-px hover:border-line-strong hover:bg-white"
                >
                  <Icon name={social.icon as IconName} size={20} weight="fill" />
                  <span className="sr-only">
                    {site.name} on {social.label}
                  </span>
                </a>
              </CustomCursorTarget>
            </li>
          ))}
          {/* Light / dark toggle, after the socials like the reference. A
              solid background so the moon's cut-out matches the button. */}
          <li>
            <CustomCursorTarget className="size-auto hover:opacity-100">
              <ThemeToggle className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line bg-white text-blueberry transition hover:-translate-y-px hover:border-line-strong" />
            </CustomCursorTarget>
          </li>
        </ul>
      </div>

      {/* Primary navigation — spacing, divider and row sizes copied from the
          reference sidebar (rail__nav / rail__link). */}
      <nav
        aria-label="Primary"
        className="mt-[clamp(20px,3vh,32px)] border-t border-line pt-[clamp(18px,2.6vh,28px)]"
      >
        <ul className="flex flex-col gap-[3px]">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[clamp(42px,5.4vh,48px)] items-center gap-[13px] rounded-[10px] px-4 text-[16.5px] tracking-[-0.006em] transition ${
                    active
                      ? "bg-[var(--tint-strong)] font-semibold text-ink"
                      : "font-medium text-ink/80 hover:bg-[var(--tint)] hover:text-ink"
                  }`}
                >
                  <Icon
                    name={item.icon as IconName}
                    size={21}
                    weight={active ? "fill" : "duotone"}
                    className={active ? "text-blueberry" : undefined}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* "Get in touch" lives next to the home headline (Hero.tsx), like the
          reference; the sidebar keeps only the copyright line. */}
      <div className="mt-auto border-t border-line pt-[clamp(24px,4vh,40px)] pl-[52px]">
        <p className="text-left text-[12px] leading-[1.7] tracking-[0.004em] text-ink-muted">
          © {new Date().getFullYear()} {site.name}.
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
}

/**
 * Profile photo, copied from the reference avatar (rail__avatar): a transparent
 * cut-out in a square clamp(132px, 21vh, 190px) box, contained and resting on
 * the bottom edge, with a soft drop shadow, an oval mask that fades the edges,
 * and a blurred glow behind it (clay brown here, orange on the reference). The
 * alt text names the home link it sits in.
 */
function Avatar() {
  return (
    <span className="relative block h-[clamp(132px,21vh,190px)] w-[clamp(132px,21vh,190px)] before:pointer-events-none before:absolute before:inset-[18%_4%_0] before:rounded-full before:bg-[radial-gradient(ellipse_at_50%_70%,rgba(107,53,42,0.32),transparent_66%)] before:blur-[22px] before:content-['']">
      <img
        src={profilePhoto}
        alt={site.name}
        width={900}
        height={900}
        className="relative block h-full w-full object-contain object-bottom drop-shadow-[0_14px_22px_rgba(6,12,26,0.35)] mask-[radial-gradient(ellipse_80%_86%_at_50%_24%,black_50%,transparent_100%)]"
      />
    </span>
  );
}
