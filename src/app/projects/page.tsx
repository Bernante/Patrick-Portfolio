import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { Projects } from "@/components/sections/Projects";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: pages.projects.title,
  description: pages.projects.description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: pages.projects.title,
    description: pages.projects.description,
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd label="Projects" href="/projects" />
      <Projects />
    </>
  );
}
