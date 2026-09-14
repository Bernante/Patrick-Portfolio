import { asset } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { Reveal } from "../Reveal";

/**
 * About page, rebuilt on the reference (portfolio.brewedops.cloud/about), which
 * is a single screen with every piece in one glass panel:
 *  - Header: eyebrow, title, lede.
 *  - Panel, desktop (1100px+): copy 1.28fr on the left, the desk illustration
 *    1fr on the right pinned to the bottom-right corner and bleeding through
 *    the panel padding. Below 1100px the illustration moves on top (300px).
 *  - Copy column: the owner's intro paragraphs (exact wording), the closing
 *    two-sentence statement in the reference's large "lead" style, four
 *    numbered rows with overlapping tool tiles (titles and tool logos as the
 *    owner chose, copied from the reference's rows), and a two-cell bar
 *    (education, location) that stacks under 720px.
 *  - Hover (desktop): a row's tiles hop up one after another and its number
 *    turns orange, as on the reference.
 */

const ILLUSTRATION = { src: asset("/about/about-illustration.webp"), width: 1100, height: 815 };

type Mark = { logo: string; alt: string } | { icon: IconName; alt: string };

const CAPS: { title: string; marks: Mark[] }[] = [
  {
    // Same tools and order as the reference's "AI Web Dev" row (Codex uses the OpenAI mark).
    title: "AI Web Dev",
    marks: [
      { logo: asset("/logos/claude.svg"), alt: "Claude" },
      { logo: asset("/logos/chatgpt.webp"), alt: "Codex" },
      { logo: asset("/logos/namecheap.svg"), alt: "Namecheap" },
      { logo: asset("/logos/cloudflare.svg"), alt: "Cloudflare" },
      { logo: asset("/logos/github.svg"), alt: "GitHub" },
    ],
  },
  {
    // Same tools and order as the reference's "Aspiring AI Engineer" row (Codex uses the OpenAI mark).
    title: "Aspiring AI Engineer",
    marks: [
      { logo: asset("/logos/claude.svg"), alt: "Claude" },
      { logo: asset("/logos/chatgpt.webp"), alt: "Codex" },
      { logo: asset("/logos/zhipu.svg"), alt: "GLM" },
      { logo: asset("/logos/qwen.svg"), alt: "Qwen" },
      { logo: asset("/logos/hermes.svg"), alt: "Hermes" },
    ],
  },
  {
    // Same tools and order as the reference's "GHL System Architect & AI Automations" row.
    title: "GHL System Architect & AI Automations",
    marks: [
      { logo: asset("/logos/gohighlevel.png"), alt: "GoHighLevel" },
      { logo: asset("/logos/n8n.svg"), alt: "n8n" },
      { logo: asset("/logos/zapier.svg"), alt: "Zapier" },
    ],
  },
  {
    // Same tools and order as the reference's "Operations Manager" row.
    title: "Operations Manager",
    marks: [
      { logo: asset("/logos/googleworkspace.svg"), alt: "Google Workspace" },
      { logo: asset("/logos/slack.svg"), alt: "Slack" },
      { logo: asset("/logos/fireflies.png"), alt: "Fireflies" },
    ],
  },
];

const FACTS: { icon: IconName; title: string; meta: string }[] = [
  { icon: "graduationcap", title: "BS Information Technology", meta: "Holy Name University" },
  { icon: "pin", title: "Based in the Philippines", meta: "GMT+8 · US hours" },
];

/** Staggered hop per tile on row hover (reference: 0, 40, 80, 120, 160ms). */
const HOP_DELAY = ["delay-0", "delay-[40ms]", "delay-[80ms]", "delay-[120ms]", "delay-[160ms]"] as const;

/** Desktop panel height: the screen minus the reference page's spacing and the header. */
const PANEL_H =
  "lg:min-h-[max(480px,calc(100dvh-clamp(28px,5vh,64px)-34px-clamp(30px,3.1vw,60px)*1.06-clamp(14px,1vw,19px)*1.6-clamp(16px,2.6vh,34px)-clamp(16px,3vh,32px)))]";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-8 lg:mx-[calc(min(4vw,64px)-56px)] lg:mt-[calc(clamp(28px,5vh,64px)-3rem)] lg:mb-[calc(clamp(16px,3vh,32px)-3rem)]"
    >
      <header className="flex flex-col gap-[8px] max-lg:pr-[56px]">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">About</p>
        <h1
          id="about-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink max-lg:leading-[1.08] max-lg:tracking-[-0.022em]"
        >
          Hi, I’m Patrick.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted max-lg:leading-[1.5] max-lg:font-medium sm:max-lg:max-w-[60ch]">
          I build the systems that keep businesses running seamlessly behind the scenes.
        </p>
      </header>

      <Reveal className="mt-[clamp(16px,2.6vh,34px)] block">
        <div
          className={`flex flex-col gap-[20px] rounded-[28px] border border-line [background:var(--glass-bg)] px-[14px] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)] max-sm:rounded-[22px] max-sm:p-[12px] lg:grid lg:grid-cols-[minmax(0,1.28fr)_minmax(280px,1fr)] lg:gap-[clamp(16px,2vw,40px)] lg:px-[clamp(14px,1.4vw,24px)] ${PANEL_H}`}
        >
          {/* ---- Copy column ---- */}
          <div className="flex min-w-0 flex-col justify-center gap-[clamp(10px,1.5vh,20px)] py-[clamp(4px,1vh,16px)] lg:pl-[clamp(4px,0.8vw,16px)]">
            <div className="flex max-w-[58ch] flex-col gap-[clamp(8px,1.1vh,12px)] text-[length:clamp(12.5px,min(0.92vw,1.7vh),15.5px)] leading-[1.6] text-ink-muted max-sm:text-[14px]">
              <p>
                I’m a <strong className="font-bold text-ink">BS Information Technology graduate from Holy Name University</strong>, with
                experience in web development, IT operations, and automation. I enjoy turning ideas and repetitive processes into
                simple, useful solutions.
              </p>
              <p>
                I’ve worked as an <strong className="font-bold text-ink">IT Specialist for the Provincial Government of Bohol</strong>,
                while continuing to explore AI, automation, and modern web technologies.
              </p>
            </div>
            <p className="max-w-[26ch] text-[length:clamp(19px,min(1.75vw,3.1vh),32px)] leading-[1.22] font-bold tracking-[-0.022em] text-ink max-lg:max-w-none">
              I build with curiosity. <span className="font-semibold text-ink-muted">I solve with technology.</span>
            </p>

            <ul className="mt-[clamp(2px,0.6vh,8px)] flex flex-col">
              {CAPS.map((cap, i) => (
                <li
                  key={cap.title}
                  className="group grid grid-cols-[calc(5*var(--tile)-3*var(--overlap))_minmax(0,1fr)_auto] items-center gap-[clamp(10px,1vw,16px)] border-t border-line px-[2px] py-[clamp(7px,1.1vh,13px)] [--overlap:5px] [--tile:clamp(28px,2.2vw,36px)] last:border-b max-[560px]:grid-cols-[calc(5*var(--tile)-3*var(--overlap))_minmax(0,1fr)]"
                >
                  <span className="inline-flex items-center pl-[var(--overlap)]">
                    {cap.marks.map((mark, j) => (
                      <span
                        key={mark.alt}
                        className={`-ml-[var(--overlap)] grid h-[var(--tile)] w-[var(--tile)] place-items-center rounded-[9px] bg-white text-blueberry shadow-[inset_0_0_0_1px_var(--color-line-strong),0_2px_6px_-3px_rgba(6,12,26,0.35)] transition-transform duration-[260ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 dark:bg-[#f4f4ed] dark:text-[#6b352a] ${HOP_DELAY[j]}`}
                        style={{ zIndex: j + 1 }}
                      >
                        {"logo" in mark ? (
                          <img src={mark.logo} alt={mark.alt} width={20} height={20} className="h-[58%] w-[58%] object-contain" />
                        ) : (
                          <>
                            <Icon name={mark.icon} size={16} weight="duotone" />
                            <span className="sr-only">{mark.alt}</span>
                          </>
                        )}
                      </span>
                    ))}
                  </span>
                  <span className="text-[length:clamp(13px,min(1vw,1.85vh),17px)] leading-[1.25] font-bold tracking-[-0.012em] text-ink">
                    {cap.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[length:clamp(10.5px,0.68vw,12px)] font-bold tracking-[0.12em] text-line-strong transition-colors duration-[220ms] group-hover:text-[#ff7a1a] max-[560px]:hidden"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-[clamp(4px,0.8vh,10px)] grid grid-cols-1 overflow-hidden rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_var(--color-line-strong),inset_0_1px_0_rgba(255,255,255,0.6),0_14px_34px_-26px_rgba(6,12,26,0.45)] min-[721px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              {FACTS.map((fact, i) => (
                <div
                  key={fact.title}
                  className={`flex min-w-0 items-center gap-[11px] px-[clamp(12px,1vw,18px)] py-[clamp(9px,1.2vh,13px)] lg:max-[1640px]:gap-[9px] lg:max-[1640px]:px-[clamp(10px,0.8vw,14px)] ${
                    i > 0 ? "shadow-[inset_0_1px_0_var(--color-line)] min-[721px]:shadow-[inset_1px_0_0_var(--color-line)]" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-[clamp(30px,2.3vw,38px)] w-[clamp(30px,2.3vw,38px)] flex-none place-items-center rounded-[10px] bg-[rgba(255,122,26,0.1)] text-[#ff7a1a] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)]"
                  >
                    <Icon name={fact.icon} size={17} weight="duotone" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-[2px]">
                    <dt className="text-[length:clamp(12px,0.8vw,14.5px)] leading-[1.2] font-bold tracking-[-0.008em] text-ink lg:max-[1640px]:text-[length:clamp(11.5px,0.78vw,13.5px)]">
                      {fact.title}
                    </dt>
                    <dd className="text-[length:clamp(10px,0.62vw,11.5px)] font-semibold tracking-[0.07em] text-ink-muted uppercase max-sm:text-[11.5px] lg:max-[1640px]:text-[10px] lg:max-[1439px]:text-[length:clamp(10.5px,0.8vw,11.5px)] lg:max-[1439px]:tracking-normal lg:max-[1439px]:normal-case">
                      {fact.meta}
                    </dd>
                  </span>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- Illustration: bottom-right, bleeding through the panel padding (desktop); on top below 1100px ---- */}
          <div className="relative order-first flex h-[min(38vh,300px)] min-h-0 min-w-0 items-end justify-center lg:order-none lg:-mr-[clamp(14px,1.4vw,24px)] lg:-mb-[clamp(14px,2vh,24px)] lg:h-auto lg:justify-end">
            <img
              src={ILLUSTRATION.src}
              alt="Illustration of a person working at a computer desk"
              width={ILLUSTRATION.width}
              height={ILLUSTRATION.height}
              decoding="async"
              className="block h-full w-full max-w-full object-contain object-bottom lg:absolute lg:inset-0 lg:object-right-bottom"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
