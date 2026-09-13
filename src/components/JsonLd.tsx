import { faqs, services, site } from "@/lib/site";

const PERSON_ID = `${site.url}/#patrick-bernante`;
const WEBSITE_ID = `${site.url}/#website`;

function Ld({ graph }: { graph: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

/**
 * Site-wide structured data, rendered once from the root layout:
 * the Person behind the site and the WebSite itself.
 *
 * Page-specific schemas (ProfilePage, ProfessionalService, FAQPage) are
 * deliberately NOT here — emitting an FAQPage on all five routes would claim
 * every page is an FAQ. Each lives on the page it actually describes.
 */
export function JsonLd() {
  return (
    <Ld
      graph={[
        {
          "@type": "Person",
          "@id": PERSON_ID,
          name: site.name,
          url: site.url,
          email: `mailto:${site.email}`,
          jobTitle: site.role,
          description: site.intro,
          knowsAbout: [
            "AI Automation",
            "Artificial Intelligence Agents",
            "GoHighLevel",
            "Web Development",
            "Next.js",
            "Search Engine Optimization",
            "Video Editing",
            "Workflow Automation",
          ],
          sameAs: site.socials.map((social) => social.href),
        },
        {
          "@type": "WebSite",
          "@id": WEBSITE_ID,
          url: site.url,
          name: `${site.name} — Portfolio`,
          description: site.intro,
          inLanguage: "en",
          publisher: { "@id": PERSON_ID },
        },
      ]}
    />
  );
}

/** Home page: this is the profile page for the Person above. */
export function ProfileJsonLd() {
  return (
    <Ld
      graph={[
        {
          "@type": "ProfilePage",
          "@id": `${site.url}/#profilepage`,
          url: site.url,
          name: `${site.name} — ${site.role}`,
          isPartOf: { "@id": WEBSITE_ID },
          about: { "@id": PERSON_ID },
          mainEntity: { "@id": PERSON_ID },
        },
      ]}
    />
  );
}

/** Services page: the service catalogue. */
export function ServicesJsonLd() {
  return (
    <Ld
      graph={[
        {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#service`,
          name: `${site.name} — ${site.role}`,
          url: `${site.url}/services`,
          description: site.intro,
          founder: { "@id": PERSON_ID },
          areaServed: "Worldwide",
          availableLanguage: ["English", "Filipino"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: services.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service.title,
                description: service.summary,
              },
            })),
          },
        },
      ]}
    />
  );
}

/** Contact page: the FAQ block lives there, so the FAQPage schema does too. */
export function FaqJsonLd() {
  return (
    <Ld
      graph={[
        {
          "@type": "FAQPage",
          "@id": `${site.url}/contact#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        },
      ]}
    />
  );
}

/** Breadcrumbs for the inner pages, so results show Home › Page. */
export function BreadcrumbJsonLd({ label, href }: { label: string; href: string }) {
  return (
    <Ld
      graph={[
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: label, item: `${site.url}${href}` },
          ],
        },
      ]}
    />
  );
}
