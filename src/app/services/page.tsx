import type { Metadata } from "next";
import { BreadcrumbJsonLd, ServicesJsonLd } from "@/components/JsonLd";
import { Services } from "@/components/sections/Services";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: pages.services.title,
  description: pages.services.description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: pages.services.title,
    description: pages.services.description,
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Services" href="/services" />
      <ServicesJsonLd />
      <Services />
    </>
  );
}
