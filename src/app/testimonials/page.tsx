import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/sections/Testimonials";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: pages.testimonials.title,
  description: pages.testimonials.description,
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: pages.testimonials.title,
    description: pages.testimonials.description,
    url: "/testimonials",
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Testimonials" href="/testimonials" />
      <Testimonials />
    </>
  );
}
