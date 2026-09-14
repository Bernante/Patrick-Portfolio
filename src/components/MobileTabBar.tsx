"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

/**
 * Phone / tablet navigation (below 1100px), copied from the reference tab bar:
 *  - A floating pill 14px from the sides and bottom (plus the iPhone safe
 *    area), 64px tall, 6px padding, dark glass (`.tabbar` in globals.css:
 *    78% dark brown with a 24px blur; solid on slower devices).
 *  - Five tabs: Home · Work · Contact · Services · About. Contact is the
 *    primary action: a raised 54px butter circle lifted 24px above the bar,
 *    with no label.
 *  - Tabs: 21px duotone icon over a 10.5px label; the current page gets a soft
 *    white pill, butter label and a warm clay icon. Tabs shrink to 94% while
 *    pressed (the Contact circle to 92%).
 *  - 380px and narrower: 10px side insets, 62px tall, 10px labels.
 *  - Hidden on very short screens (landscape phones, height ≤ 500px).
 */
const TABS: { href: string; label: string; icon: IconName; primary?: boolean }[] = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Work", icon: "folder" },
  { href: "/contact", label: "Contact", icon: "email", primary: true },
  { href: "/services", label: "Services", icon: "stack" },
  { href: "/about", label: "About", icon: "user" },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary navigation"
      className="tabbar no-print fixed right-[14px] bottom-[calc(14px+env(safe-area-inset-bottom,0px))] left-[14px] z-[60] grid h-[64px] grid-cols-5 items-center rounded-full border border-[rgba(255,255,255,0.1)] p-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_-20px_rgba(20,10,8,0.55)] lg:hidden [@media(max-height:500px)]:hidden max-[380px]:right-[10px] max-[380px]:left-[10px] max-[380px]:h-[62px]"
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);

        if (tab.primary) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className="group flex h-full items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#fff1a6]"
            >
              <span
                className={`-mt-[24px] grid h-[54px] w-[54px] place-items-center rounded-full text-[#3a1c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(6,12,26,0.2),0_10px_24px_-10px_rgba(255,241,166,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-active:scale-[0.92] group-active:duration-100 ${
                  active ? "bg-[#fff8d6]" : "bg-[#fff1a6]"
                }`}
              >
                <Icon name={tab.icon} size={24} weight="bold" />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-full flex-col items-center justify-center gap-[3px] rounded-full text-[10.5px] font-semibold tracking-[0.02em] transition-[color,background-color,transform] duration-150 active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[#fff1a6] max-[380px]:text-[10px] ${
              active ? "bg-[rgba(255,255,255,0.08)] text-[#fff1a6]" : "text-[rgba(255,241,166,0.62)]"
            }`}
          >
            <Icon name={tab.icon} size={21} weight="duotone" className={active ? "text-[#f2b48c]" : undefined} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
