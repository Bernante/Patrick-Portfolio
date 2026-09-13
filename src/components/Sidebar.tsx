"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { CustomCursorTarget } from "@/components/ui/custom-cursor";
import { Icon, type IconName } from "./Icon";

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
        className={`no-print scrollbar-hidden fixed inset-y-0 left-0 z-50 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-r border-line bg-surface px-6 py-8 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-[24rem] lg:shrink-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="rounded-full">
            <Avatar size="lg" />
          </Link>
          <h2 className="mt-5 flex items-center gap-2 text-[22px] font-bold text-ink">
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
          <p className="mt-1 text-[14.5px] text-ink-muted">{site.shortRole}</p>

          <ul className="mt-5 flex items-center justify-center gap-2.5">
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
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-blueberry transition hover:-translate-y-0.5 hover:border-blueberry hover:bg-cream"
                  >
                    <Icon name={social.icon as IconName} size={22} weight="fill" />
                    <span className="sr-only">
                      {site.name} on {social.label}
                    </span>
                  </a>
                </CustomCursorTarget>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-7 border-line" />

        {/* Primary navigation */}
        <nav aria-label="Primary">
          <ul className="flex flex-col gap-1.5">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[3.25rem] items-center gap-3.5 rounded-2xl px-4 text-[16.5px] font-medium transition ${
                      active
                        ? "bg-blueberry text-cream shadow-[0_10px_24px_-14px_rgba(107,53,42,0.9)]"
                        : "text-ink hover:bg-cream"
                    }`}
                  >
                    <Icon name={item.icon as IconName} size={26} weight={active ? "fill" : "duotone"} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* "Get in touch" lives next to the home headline (Hero.tsx), like the
            reference; the sidebar keeps only the copyright line. */}
        <div className="mt-auto pt-8">
          <p className="text-center text-[0.85rem] leading-relaxed text-ink-muted">
            © {new Date().getFullYear()} {site.name}.
            <br />
            All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}

function Avatar({ size }: { size: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-28 w-28 text-4xl" : "h-10 w-10 text-base";
  return (
    <span
      className={`${dim} flex items-center justify-center rounded-full bg-blueberry font-bold tracking-tight text-cream ring-4 ring-cream`}
      aria-hidden="true"
    >
      PB
    </span>
  );
}
