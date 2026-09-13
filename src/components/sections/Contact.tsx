import { faqs, site } from "@/lib/site";
import { ContactForm } from "../ContactForm";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Contact() {
  const channels = [
    { icon: "email", label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: "phone", label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: "pin", label: "Location", value: site.location, href: null },
  ] as const;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-8">
      <SectionHeading
        id="contact-heading"
        icon="chat"
        eyebrow="Get in touch"
        title="Tell me what you want to stop doing by hand"
        description="Send a short note about the project. I read every message myself and reply within one business day."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 2xl:grid-cols-5">
        <Reveal className="card rounded-xl2 p-8 2xl:col-span-3">
          <h2 className="text-[1.35rem] font-bold text-ink">Send a message</h2>
          <p className="mt-2 mb-7 text-[1.05rem] text-ink-muted">
            Fields marked <span className="font-semibold text-blueberry">*</span> are required.
          </p>
          <ContactForm />
        </Reveal>

        <div className="flex min-w-0 flex-col gap-6 2xl:col-span-2">
          <Reveal delay={0.08} className="card rounded-xl2 p-8">
            <h2 className="text-[1.3rem] font-bold text-ink">Reach me directly</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <ChannelRow {...channel} />
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-line pt-6">
              <p className="text-[0.88rem] font-semibold tracking-wide text-ink-muted uppercase">
                Find me on
              </p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[3rem] items-center gap-2 rounded-2xl border border-line bg-cream-soft px-4 text-[1rem] font-semibold text-ink transition hover:border-blueberry hover:bg-cream"
                    >
                      <Icon name={social.icon as IconName} size={22} weight="fill" className="text-blueberry" />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.14} className="rounded-xl2 bg-blueberry p-8 text-cream">
            <Icon name="sparkle" size={34} weight="duotone" className="text-cream" />
            <h2 className="mt-4 text-[1.3rem] font-bold text-cream">Prefer to talk it through?</h2>
            <p className="mt-2.5 text-[1.05rem] leading-relaxed text-cream/85">
              Book a free 20-minute call. No pitch — we map the problem and I tell you
              straight whether I am the right person for it.
            </p>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Book a discovery call")}`}
              className="mt-6 inline-flex min-h-[3.25rem] items-center gap-2.5 rounded-2xl bg-cream px-6 text-[1.05rem] font-semibold text-blueberry transition hover:-translate-y-0.5 hover:bg-white"
            >
              Book a call
              <Icon name="arrow-up-right" size={20} weight="bold" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* ---- FAQ (also feeds FAQPage structured data) ---- */}
      <Reveal className="mt-14 block">
        <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold text-ink">
          Questions people ask first
        </h2>
        <ul className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <li key={faq.q}>
              <details className="card group rounded-xl2 p-0 [&[open]]:border-line-strong">
                <summary className="flex min-h-[4rem] cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 text-[1.15rem] font-semibold text-ink marker:hidden">
                  {faq.q}
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-blueberry transition group-open:rotate-45">
                    <Icon name="plus" size={22} weight="bold" />
                  </span>
                </summary>
                <p className="border-t border-line px-7 py-5 text-[1.05rem] leading-relaxed text-ink-muted">
                  {faq.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function ChannelRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string | null;
}) {
  const inner = (
    <>
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-blueberry">
        <Icon name={icon as IconName} size={24} weight="duotone" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.85rem] font-semibold tracking-wide text-ink-muted uppercase">
          {label}
        </span>
        <span className="block text-[1.05rem] font-medium break-words text-ink">
          {value.includes("@") ? (
            <>
              {value.slice(0, value.indexOf("@") + 1)}
              <wbr />
              {value.slice(value.indexOf("@") + 1)}
            </>
          ) : (
            value
          )}
        </span>
      </span>
    </>
  );

  if (!href) {
    return <span className="flex items-center gap-3.5">{inner}</span>;
  }

  return (
    <a
      href={href}
      className="flex items-center gap-3.5 rounded-2xl transition hover:text-blueberry"
    >
      {inner}
    </a>
  );
}
