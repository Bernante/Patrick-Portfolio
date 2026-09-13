import { process, services } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-8">
      <SectionHeading
        id="services-heading"
        icon="stack"
        eyebrow="What I do"
        title="Services that take work off your plate"
        description="Pick one piece or the whole system. Either way you get something that runs without you standing over it."
      />

      <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => (
          <Reveal
            as="li"
            key={service.title}
            delay={0.05 * (i % 3)}
            className="card card-hover flex flex-col rounded-xl2 p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-blueberry">
                <Icon name={service.icon as IconName} size={30} weight="duotone" />
              </span>
              <span
                className="text-[1.6rem] font-bold text-line-strong"
                aria-hidden="true"
              >
                {service.num}
              </span>
            </div>

            <h3 className="mt-5 text-[1.4rem] font-bold text-ink">{service.title}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-muted">{service.summary}</p>

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
              {service.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[1rem] text-ink">
                  <Icon
                    name="check"
                    size={22}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-blueberry"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>

      {/* ---- How we work together ---- */}
      <Reveal className="mt-14 block">
        <div className="rounded-xl2 bg-blueberry px-7 py-10 text-cream md:px-10">
          <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold text-cream">
            How we work together
          </h2>
          <p className="mt-3 max-w-2xl text-[1.12rem] leading-relaxed text-cream/85">
            Four steps, no mystery. You always know what is happening and what comes next.
          </p>

          <ol className="mt-9 grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
            {process.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-cream/25 bg-cream/10 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-blueberry">
                    <Icon name={step.icon as IconName} size={26} weight="duotone" />
                  </span>
                  <span className="text-[1.5rem] font-bold text-cream/85">{step.step}</span>
                </div>
                <h4 className="mt-4 text-[1.25rem] font-bold text-cream">{step.title}</h4>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-cream/85">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
