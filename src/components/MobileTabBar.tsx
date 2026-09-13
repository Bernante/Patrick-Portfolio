"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

/**
 * Floating bottom navigation for phones and small tablets (hidden at `lg`,
 * where the sidebar takes over). Four tabs flank a raised butter-yellow Contact
 * button, so the primary call to action is always one thumb-tap away.
 *
 * Hidden on short screens (phones in landscape, height ≤ 500px): there the top
 * bar plus this bar covered half the viewport. The top bar's Menu still offers
 * full navigation.
 *
 * Layered under the slide-out drawer (z-30 vs the drawer's z-40/50), so opening
 * the drawer covers it instead of the two fighting for the screen.
 */
const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Projects", icon: "folder" },
  { href: "/services", label: "Services", icon: "stack" },
  { href: "/about", label: "About", icon: "user" },
];

/** Soft Butter: stands out against the dark clay-brown bar. */
const ACCENT = "#fff1a6";

export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const contactActive = pathname.startsWith("/contact");

  const renderTab = (tab: (typeof tabs)[number]) => {
    const active = isActive(tab.href);
    return (
      <li key={tab.href}>
        <Link
          href={tab.href}
          aria-current={active ? "page" : undefined}
          className={`flex min-h-[3.75rem] flex-col items-center justify-center gap-1 rounded-full text-[0.75rem] font-semibold transition ${
            active ? "bg-white/10" : "text-cream/75 hover:text-cream"
          }`}
          style={active ? { color: ACCENT } : undefined}
        >
          <Icon name={tab.icon} size={24} weight={active ? "bold" : "regular"} />
          {tab.label}
        </Link>
      </li>
    );
  };

  return (
    <nav
      aria-label="Mobile"
      className="no-print fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 lg:hidden [@media(max-height:500px)]:hidden"
    >
      <ul className="grid grid-cols-5 items-center rounded-full bg-blueberry-900 p-1.5 shadow-[0_18px_40px_-12px_rgba(58,28,22,0.6)] ring-1 ring-white/10">
        {tabs.slice(0, 2).map(renderTab)}

        <li className="flex justify-center">
          <Link
            href="/contact"
            aria-current={contactActive ? "page" : undefined}
            className={`-mt-9 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full text-blueberry-900 shadow-[0_10px_28px_-6px_rgba(255,241,166,0.55)] transition active:scale-95 ${
              contactActive ? "ring-4 ring-cream" : ""
            }`}
            style={{ backgroundColor: ACCENT }}
          >
            <Icon name="email" size={30} weight="bold" />
            <span className="sr-only">Contact</span>
          </Link>
        </li>

        {tabs.slice(2).map(renderTab)}
      </ul>
    </nav>
  );
}
