"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, profilePhoto, site } from "@/lib/site";
import { CustomCursorTarget } from "@/components/ui/custom-cursor";
import { Icon, type IconName } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* --- Mobile drawer: close on navigation ---------------------------------
     The layout keeps this component mounted across routes, so without this the
     drawer would stay open on top of the page you just navigated to. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* --- Mobile drawer: lock scroll, close on Escape ------------------------ */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ---------- Mobile top bar ---------- */}
      <div className="no-print sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Avatar size="sm" />
          <span className="text-lg font-semibold text-ink">{site.name}</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          className="flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-base font-semibold text-blueberry"
        >
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={`h-0.5 w-full rounded bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-full rounded bg-current transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-full rounded bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* ---------- Backdrop ---------- */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-blueberry-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- Sidebar panel ---------- */}
      <aside
        id="primary-navigation"
        className={`no-print scrollbar-hidden fixed inset-y-0 left-0 z-50 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-r border-line bg-surface px-6 py-8 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-[312px] lg:shrink-0 lg:translate-x-0 lg:px-[30px] lg:pt-[clamp(28px,4vh,52px)] lg:pb-[28px] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="rounded-full">
            <Avatar size="lg" />
          </Link>
          <h2 className="mt-5 flex items-center gap-2 text-[22px] leading-[1.2] font-bold tracking-[-0.022em] text-ink lg:mt-[20px] lg:gap-[7px]">
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
          <p className="mt-1 text-[14.5px] tracking-[0.004em] text-ink-muted lg:mt-[5px]">{site.shortRole}</p>

          <ul className="mt-5 flex items-center justify-center gap-2.5 lg:mt-[18px] lg:gap-[10px]">
            {site.socials.map((social) => (
              <li key={social.label}>
                {/* size-auto drops the variant's fixed box so the link keeps its
                    own 48px circle; hover:opacity-100 keeps the component's
                    dimming from fighting the link's existing hover style. */}
                <CustomCursorTarget className="size-auto hover:opacity-100">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/70 text-blueberry transition hover:-translate-y-px hover:border-line-strong hover:bg-white lg:h-[44px] lg:w-[44px]"
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
                <ThemeToggle className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-blueberry transition hover:-translate-y-px hover:border-line-strong lg:h-[44px] lg:w-[44px]" />
              </CustomCursorTarget>
            </li>
          </ul>
        </div>

        {/* Primary navigation — spacing, divider and row sizes copied from the
            reference sidebar (rail__nav / rail__link). */}
        <nav
          aria-label="Primary"
          className="mt-7 border-t border-line pt-7 lg:mt-[clamp(20px,3vh,32px)] lg:pt-[clamp(18px,2.6vh,28px)]"
        >
          <ul className="flex flex-col gap-1.5 lg:gap-[3px]">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[3.25rem] items-center gap-3.5 rounded-2xl px-4 text-[16.5px] tracking-[-0.006em] transition lg:min-h-[clamp(42px,5.4vh,48px)] lg:gap-[13px] lg:rounded-[10px] ${
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
        <div className="mt-auto border-t border-line pt-[clamp(24px,4vh,40px)] lg:pl-[52px]">
          <p className="text-left text-[12px] leading-[1.7] tracking-[0.004em] text-ink-muted">
            © {new Date().getFullYear()} {site.name}.
            <br />
            All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}

/**
 * Profile photo, copied from the reference avatar (rail__avatar):
 *  - lg: a transparent cut-out in a square clamp(132px, 21vh, 190px) box,
 *    contained and resting on the bottom edge, with a soft drop shadow, an oval
 *    mask that fades the edges, and a blurred glow behind it (clay brown here,
 *    orange on the reference). The alt text names the home link it sits in.
 *  - sm (phone top bar): the same photo in a small round crop; the link next to
 *    it already shows the name, so the image is decorative there.
 */
function Avatar({ size }: { size: "sm" | "lg" }) {
  if (size === "sm") {
    return (
      <span className="block h-10 w-10 overflow-hidden rounded-full bg-cream ring-2 ring-cream">
        <img src={profilePhoto} alt="" width={40} height={40} className="h-full w-full object-cover object-top" />
      </span>
    );
  }
  return (
    <span className="relative block h-28 w-28 before:pointer-events-none before:absolute before:inset-[18%_4%_0] before:rounded-full before:bg-[radial-gradient(ellipse_at_50%_70%,rgba(107,53,42,0.32),transparent_66%)] before:blur-[22px] before:content-[''] lg:h-[clamp(132px,21vh,190px)] lg:w-[clamp(132px,21vh,190px)]">
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
