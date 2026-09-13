"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
};

/**
 * Scroll-reveal built as progressive enhancement.
 *
 * The content is visible by default. Only when JavaScript has actually run
 * (the inline script in layout.tsx puts `.js` on <html>) does CSS hide it
 * ready to animate in — so a reader with JS blocked, JS still loading, or a
 * failed IntersectionObserver always sees the page, never a blank column.
 * A timeout also force-reveals anything the observer never reports.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => node.classList.add("is-revealed");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.01 },
    );

    observer.observe(node);

    // Safety net: never leave content hidden, whatever the observer does.
    const timer = window.setTimeout(show, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
