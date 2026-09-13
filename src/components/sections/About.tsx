import { asset, site } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const skills = [
  { label: "AI agents & chatbots", icon: "robot" },
  { label: "GoHighLevel systems", icon: "funnel" },
  { label: "Next.js & React", icon: "code" },
  { label: "Workflow automation", icon: "flow" },
  { label: "Premiere Pro & After Effects", icon: "film" },
  { label: "API & webhook integration", icon: "plugs" },
] as const;

const values = [
  {
    icon: "check",
    title: "Plain language, always",
    text: "No jargon walls. If you cannot explain what a system does, you cannot trust it.",
  },
  {
    icon: "wrench",
    title: "Built to be handed over",
    text: "Every build ships with documentation and a walkthrough so your team owns it.",
  },
  {
    icon: "compass",
    title: "Honest scope",
    text: "If something is not worth automating yet, I will tell you before you pay for it.",
  },
] as const;

/**
 * The large picture in the intro card. `about-illustration.webp` is the
 * illustration from portfolio.brewedops.cloud (the same artwork as the home
 * About card), used at the owner's request; replace it with your own artwork if
 * its licence is unclear. Real pixel size, so it is never distorted.
 */
const ILLUSTRATION = { src: asset("/about/about-illustration.webp"), width: 1100, height: 815 };

/**
 * About page, laid out like the reference About page:
 *  - Desktop (xl): one tall card, copy on the left (1.28fr) and the
 *    illustration on the right (1fr). The picture is contained and pinned to
 *    the card's bottom-right corner, bleeding through the card padding, and the
 *    card is roughly one viewport tall so the picture is big.
 *  - Below xl: the picture sits above the copy at min(38vh, 300px) tall.
 * "What I work with" and "How I work" follow as two cards underneath.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-8">
      <SectionHeading
        id="about-heading"
        icon="user"
        eyebrow="About me"
        title={`Hi, I'm ${site.firstName}`}
        description="I sit between three jobs that used to be separate — automation, web development and video — because most clients need all three to work as one thing."
      />

      <Reveal className="card mt-5 grid grid-cols-1 gap-5 overflow-hidden rounded-[28px] bg-[linear-gradient(100deg,#ffffff_0%,#ffffff_55%,#f5e08a_100%)] px-[clamp(14px,1.4vw,24px)] py-[clamp(14px,2vh,24px)] xl:min-h-[max(30rem,calc(100dvh-13rem))] xl:grid-cols-[minmax(0,1.28fr)_minmax(280px,1fr)] xl:gap-[clamp(16px,2vw,40px)]">
        <div className="flex min-w-0 flex-col justify-center gap-[clamp(10px,1.5vh,20px)] xl:py-[clamp(4px,1vh,16px)] xl:pl-[clamp(4px,0.8vw,16px)]">
          <div className="flex max-w-[58ch] flex-col gap-4 text-[length:clamp(12.5px,min(0.92vw,1.7vh),15.5px)] leading-[1.6] text-ink-muted">
            <p>
              I started out editing video, picked up web development because clients kept
              asking where the video should live, and moved into AI automation when it
              became obvious that most of the work around a project was repetitive.
            </p>
            <p>
              These days I build systems for coaches, agencies and small teams: an AI agent
              that answers leads at 2am, a GoHighLevel pipeline that never drops a follow-up,
              a website that loads fast and actually ranks, and the video content that feeds
              all of it.
            </p>
            <p>
              I care a lot about the parts people usually skip — readable type, keyboard
              access, sensible contrast, pages that work on a five-year-old phone. Good work
              should be usable by everyone who lands on it.
            </p>
          </div>

          <dl className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Icon name="pin" size={26} weight="duotone" className="mt-0.5 shrink-0 text-blueberry" />
              <div>
                <dt className="text-[0.88rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Based in
                </dt>
                <dd className="text-[1.05rem] font-medium text-ink">{site.location}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="sparkle" size={26} weight="duotone" className="mt-0.5 shrink-0 text-blueberry" />
              <div>
                <dt className="text-[0.88rem] font-semibold tracking-wide text-ink-muted uppercase">
                  Currently
                </dt>
                <dd className="text-[1.05rem] font-medium text-ink">{site.availability}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="relative order-first flex h-[min(38vh,300px)] min-h-0 min-w-0 items-end justify-center xl:order-none xl:-mr-[clamp(14px,1.4vw,24px)] xl:-mb-[clamp(14px,2vh,24px)] xl:h-auto xl:justify-end">
          <img
            src={ILLUSTRATION.src}
            alt=""
            width={ILLUSTRATION.width}
            height={ILLUSTRATION.height}
            decoding="async"
            className="block h-full w-full max-w-full object-contain object-bottom xl:absolute xl:inset-0 xl:object-right-bottom"
          />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={0.08} className="card rounded-xl2 p-8">
          <h2 className="text-[1.3rem] font-bold text-ink">What I work with</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {skills.map((skill) => (
              <li key={skill.label} className="flex items-center gap-3 text-[1.05rem] text-ink">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-blueberry">
                  <Icon name={skill.icon as IconName} size={22} weight="duotone" />
                </span>
                {skill.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14} className="card rounded-xl2 p-8">
          <h2 className="text-[1.3rem] font-bold text-ink">How I work</h2>
          <ul className="mt-5 flex flex-col gap-5">
            {values.map((value) => (
              <li key={value.title}>
                <h3 className="flex items-center gap-2.5 text-[1.1rem] font-semibold text-ink">
                  <Icon
                    name={value.icon as IconName}
                    size={22}
                    weight="fill"
                    className="shrink-0 text-blueberry"
                  />
                  {value.title}
                </h3>
                <p className="mt-1.5 pl-8 text-[1rem] leading-relaxed text-ink-muted">
                  {value.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
