import { projects } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-8">
      <SectionHeading
        id="projects-heading"
        icon="folder"
        eyebrow="Selected work"
        title="Projects built to solve a real problem"
        description="Automations, funnels, sites and edits — each one shipped for a client and measured by what changed after it went live."
      />

      <ul className="mt-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal
            as="li"
            key={project.title}
            delay={0.05 * (i % 3)}
            className="card card-hover flex flex-col rounded-xl2 p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blueberry text-cream">
                <Icon name={project.icon as IconName} size={28} weight="duotone" />
              </span>
              <span className="rounded-full border border-line bg-cream-soft px-3.5 py-1.5 text-[0.85rem] font-semibold text-ink-soft">
                {project.category}
              </span>
            </div>

            <h3 className="mt-5 text-[1.4rem] font-bold text-ink">{project.title}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-muted">
              {project.description}
            </p>

            <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-cream px-4 py-3.5 text-[1rem] font-semibold text-ink">
              <Icon name="check" size={22} weight="fill" className="mt-0.5 shrink-0 text-blueberry" />
              {project.result}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2 pt-1">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-lg border border-line px-3 py-1.5 text-[0.88rem] font-medium text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
