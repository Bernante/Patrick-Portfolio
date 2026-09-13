import type { Metadata } from "next";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { Contact } from "@/components/sections/Contact";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: pages.contact.title,
  description: pages.contact.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: pages.contact.title,
    description: pages.contact.description,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Contact" href="/contact" />
      <FaqJsonLd />
      <Contact />
    </>
  );
}
