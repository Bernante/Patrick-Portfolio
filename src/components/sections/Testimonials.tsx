import { testimonials } from "@/lib/site";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

/**
 * Testimonials page. Reads the same `testimonials` list as the home card, so a
 * quote added in site.ts shows up in both places. While the list is empty it
 * shows a "coming soon" note instead of invented reviews.
 */
export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-8">
      <SectionHeading
        id="testimonials-heading"
        icon="star"
        eyebrow="Testimonials"
        title="What clients say"
        description="Words from the coaches, agencies and small teams I build for."
      />

      {testimonials.length ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              as="li"
              key={t.name}
              delay={0.05 * (i % 3)}
              className="card flex flex-col rounded-xl2 p-7"
            >
              <Icon name="chats" size={28} weight="duotone" className="text-blueberry" />
              <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="mt-5 font-semibold text-ink">{t.name}</p>
              <p className="text-[0.95rem] text-ink-muted">{t.role}</p>
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal className="mt-10 block rounded-xl2 border border-dashed border-line-strong bg-white p-8">
          <p className="text-[1.2rem] font-semibold text-ink">Testimonials coming soon</p>
          <p className="mt-2 leading-relaxed text-ink-muted">
            Real words from real clients will appear here.
          </p>
        </Reveal>
      )}
    </section>
  );
}
