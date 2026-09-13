import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-[1rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
        Error 404
      </p>
      <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-bold text-ink">
        That page does not exist
      </h1>
      <p className="mt-4 max-w-lg text-[1.15rem] leading-relaxed text-ink-muted">
        The link may be out of date. Everything lives on the home page — projects, services,
        about and contact.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[3.5rem] items-center rounded-2xl bg-blueberry px-7 text-[1.1rem] font-semibold text-cream transition hover:bg-blueberry-700"
      >
        Back to home
      </Link>
    </main>
  );
}
