import type { Metadata } from "next";
import { ProfileJsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  // `title.absolute` skips the "| Patrick Bernante" template — the home title
  // already carries the name.
  title: { absolute: pages.home.title },
  description: pages.home.description,
  alternates: { canonical: "/" },
  openGraph: { title: pages.home.title, description: pages.home.description, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <ProfileJsonLd />
      <Hero />
    </>
  );
}
