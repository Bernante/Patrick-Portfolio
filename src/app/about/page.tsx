import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { About } from "@/components/sections/About";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: pages.about.title,
  description: pages.about.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: pages.about.title,
    description: pages.about.description,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd label="About" href="/about" />
      <About />
    </>
  );
}
