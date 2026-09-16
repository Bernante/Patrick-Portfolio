import { asset } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { AutomationFlow } from "./AutomationFlow";

/**
 * Services page, rebuilt from the reference (portfolio.brewedops.cloud/services)
 * at the owner's request:
 *  1. Method strip — three stage cards (Catch, Brew, Pour) with looping icon
 *     hops and, on desktop, dashed connectors with a travelling dot.
 *  2. "What I can do for you." — five service cards with logos, a pill and
 *     three check bullets; hover lifts the card and fans the logos.
 *  3. Live automation — a Mac-style window with the booking workflow diagram
 *     (AutomationFlow.tsx), signals running along its cables.
 * Everything sits in one glass panel under the page header, as on Projects.
 */

const GHL = asset("/logos/gohighlevel.png");
const N8N = asset("/logos/n8n.svg");
const CHATGPT = asset("/logos/chatgpt.webp");
const MAKE = asset("/logos/make.svg");
const BOLT = asset("/logos/bolt.svg");
const CLOUDFLARE = asset("/logos/cloudflare.svg");
const CLAUDE = asset("/logos/claude.svg");
const EXPO = asset("/logos/expo.svg");
const CHROME = asset("/logos/googlechrome.svg");
const REACT = asset("/logos/react.svg");
const TAILWIND = asset("/logos/tailwindcss.svg");

const STAGES: { title: string; icon: IconName; body: string; chips: string[] }[] = [
  {
    title: "Capture.",
    icon: "funnel",
    body: "Every lead gets captured and organized. Nothing slips through.",
    chips: ["Forms", "DMs", "Ads", "Websites", "Referrals"],
  },
  {
    title: "Automate.",
    icon: "lightning",
    body: "Repetitive tasks happen automatically, without the manual work.",
    chips: ["Follow-ups", "Emails", "Messages", "Workflows"],
  },
  {
    title: "Convert.",
    icon: "chart",
    body: "Turn interested leads into booked calls, customers, and sales.",
    chips: ["Calendar", "CRM", "Inbox", "Payments"],
  },
];

const OFFERS: { title: string; desc: string; chip: string; logos: string[]; bullets: string[] }[] = [
  {
    title: "AI-assisted Funnels",
    desc: "Pages that turn visitors into leads.",
    chip: "Built to convert",
    logos: [REACT, TAILWIND, GHL],
    bullets: ["Fast pages people finish", "Checkout that just works", "Lives in GHL or on its own"],
  },
  {
    title: "GHL, N8N Automation",
    desc: "Follow-up that runs on its own.",
    chip: "Runs 24/7",
    logos: [GHL, N8N, CHATGPT],
    bullets: ["Messages send themselves", "Leads move on their own", "AI does the busywork"],
  },
  {
    title: "CRM Setup",
    desc: "A CRM your team will actually use.",
    chip: "Easy to use",
    logos: [GHL, MAKE, N8N],
    bullets: ["Every contact easy to find", "A pipeline that fits how you sell", "New clients set up without you"],
  },
  {
    title: "Website",
    desc: "Fast, custom, and yours to keep.",
    chip: "You own the code",
    logos: [BOLT, CLOUDFLARE, TAILWIND],
    bullets: ["Loads fast on every device", "Connects to your GHL", "Code you can take anywhere"],
  },
  {
    title: "Apps",
    desc: "Small tools that fix real problems.",
    chip: "Ships in days",
    logos: [CLAUDE, EXPO, CHROME],
    bullets: ["Web, mobile and Chrome apps", "AI built in from day one", "Ready in days, not months"],
  },
];

const FLOW_TOOLS: { label: string; icon: IconName }[] = [
  { label: "GHL Automation", icon: "funnel" },
  { label: "n8n Automation", icon: "flow" },
  { label: "Email & SMS", icon: "email" },
  { label: "AI Assistant", icon: "sparkle" },
];

/** Hover motion per logo tile (first tilts left, middle lifts, last tilts right). */
const LOGO_HOVER = [
  "group-hover:[transform:translateY(-2px)_rotate(-4deg)]",
  "group-hover:[transform:translateY(-3px)]",
  "group-hover:[transform:translateY(-2px)_rotate(4deg)]",
] as const;

const EYEBROW = "text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-8">
      <header className="flex flex-col gap-[8px] max-lg:pr-[56px]">
        <p className={EYEBROW}>Services</p>
        <h1
          id="services-heading"
          className="text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.028em] text-ink lg:text-[length:clamp(26px,2vw,40px)]"
        >
          Automation, CRM, funnels, websites, and AI agents.
        </h1>
        <p className="text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted max-lg:font-medium lg:text-[length:clamp(13px,0.9vw,16px)]">
          The systems I build, how they work, and what you get.
        </p>
      </header>

      <div className="mt-[clamp(14px,2vh,24px)] flex flex-col gap-[clamp(26px,3.6vh,48px)] rounded-[2rem] border border-line [background:var(--glass-bg)] px-[clamp(14px,1.4vw,24px)] py-[clamp(14px,2vh,24px)] [box-shadow:var(--glass-shadow)] max-sm:rounded-[28px]">
        <MethodStrip />
        <Offers />
        <LiveAutomation />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 1. Method */

function MethodStrip() {
  return (
    <div className="relative grid gap-[clamp(18px,2vw,36px)] overflow-hidden rounded-[20px] bg-surface px-[clamp(16px,1.6vw,24px)] py-[clamp(14px,1.8vh,20px)] shadow-[inset_0_0_0_1px_var(--color-line),0_30px_60px_-40px_rgba(58,28,22,0.35)] min-[1366px]:grid-cols-[minmax(200px,0.7fr)_minmax(0,2.6fr)]">
      {/* Beside the stages (1366px+) the grid is the reference's 0.7fr / 2.6fr,
          so the three stage cards match its size and position; the heading
          wraps in that narrow column at a size that keeps the card height. */}
      <div className="flex min-w-0 flex-col gap-[8px] self-center">
        <p className={EYEBROW}>The automation method</p>
        <h2 className="text-[length:clamp(22px,1.6vw,30px)] leading-[1.08] font-bold tracking-[-0.025em] text-ink max-[380px]:text-[20px] min-[1366px]:text-[length:clamp(20px,1.45vw,28px)]">
          Capture. Automate. Convert.
          <span className="block font-semibold text-ink-muted">Everything works together.</span>
        </h2>
        <p className="max-w-[34ch] text-[length:clamp(12.5px,0.8vw,14px)] leading-[1.55] text-ink-muted">
          Do the three steps in order and let your systems handle the rest.
        </p>
      </div>

      <ol className="grid min-w-0 gap-[12px] md:grid-cols-3 lg:gap-[32px]">
        {STAGES.map((stage, i) => (
          <li
            key={stage.title}
            className="relative flex min-w-0 flex-col rounded-[16px] bg-surface px-[14px] py-[12px] shadow-[inset_0_0_0_1px_var(--color-line),0_1px_1.5px_rgba(58,28,22,0.04),0_10px_30px_-18px_rgba(58,28,22,0.28)]"
          >
            {i > 0 && (
              <>
                {/* Dashed connector from the previous stage, with a hopping dot (desktop). */}
                <span
                  aria-hidden="true"
                  className="absolute top-[31px] -left-[32px] hidden w-[32px] border-t-2 border-dashed border-[rgba(255,122,26,0.45)] lg:block"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-[27px] -left-[32px] hidden h-[8px] w-[8px] rounded-full bg-[#ff7a1a] opacity-0 shadow-[0_0_10px_rgba(255,122,26,0.9)] animate-[svc-hop_2.4s_ease_infinite] motion-reduce:translate-x-[12px] motion-reduce:animate-none motion-reduce:opacity-100 lg:block"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              </>
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[6px] right-[8px] text-[66px] leading-none font-extrabold tracking-[-0.05em] text-[rgba(58,28,22,0.06)] dark:text-[rgba(255,255,255,0.05)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="relative grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[rgba(255,122,26,0.14)] text-[#ff7a1a] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.28)] animate-[svc-lit_2.4s_ease_infinite] motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.8}s` }}
            >
              <Icon name={stage.icon} size={22} weight="regular" />
            </span>
            <h3 className="mt-[8px] text-[length:clamp(18px,1.2vw,22px)] font-bold tracking-[-0.02em] text-ink min-[1366px]:leading-[1.3]">
              {stage.title}
            </h3>
            <p className="mt-[4px] text-[length:clamp(12px,0.72vw,13px)] leading-[1.5] text-ink-muted min-[1366px]:leading-[1.4]">{stage.body}</p>
            <ul aria-label={`${stage.title.replace(".", "")} touches`} className="mt-auto flex flex-wrap gap-[6px] pt-[10px] min-[1366px]:pt-[6px]">
              {stage.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-[rgba(58,28,22,0.05)] px-[9px] py-[3px] text-[11px] font-medium whitespace-nowrap text-ink shadow-[inset_0_0_0_1px_rgba(58,28,22,0.1)] max-sm:text-[12px] dark:bg-[rgba(255,255,255,0.07)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Offers */

/**
 * Two-tone check mark copied from the reference's service bullets: a faint
 * back layer (32%) and a solid front layer, both in the reference orange.
 */
function SlabCheck() {
  return (
    <svg viewBox="0 0 504 576" width={15} height={15} fill="currentColor" aria-hidden="true" className="mt-[2px] shrink-0 text-[#ff7a1a]">
      <path
        opacity={0.32}
        d="M0 324C0 306 7 287 21 273C49 245 95 245 123 273L180 330L381 129C409 101 455 101 483 129C497 143 504 162 504 180V216C504 234 497 253 483 267L231 519C203 547 157 547 129 519L21 411C7 397 0 379 0 360V324ZM458 155C443 140 421 140 407 155L193 368C186 375 174 375 167 368L98 299C83 284 61 284 47 299C40 306 36 315 36 324C36 333 40 342 47 349L155 457C169 472 192 472 206 457L458 205C472 191 472 169 458 155Z"
      />
      <path d="M381 129 180 330 123 273C95 245 49 245 21 273C7 287 0 306 0 324V360C0 379 7 397 21 411L129 519C157 547 203 547 231 519L483 267C497 253 504 234 504 216V180C504 162 497 143 483 129C455 101 409 101 381 129ZM407 155C421 141 444 141 458 155C472 169 472 192 458 206L206 458C191 472 169 472 155 458L47 350C40 343 36 333 36 324C36 315 40 306 47 299C61 285 84 285 98 299L167 368C174 375 186 375 193 368L407 155Z" />
    </svg>
  );
}

function Offers() {
  return (
    <div className="flex min-w-0 flex-col gap-[clamp(8px,1.2vh,12px)]">
      <div className="flex flex-col gap-[2px] px-[4px] sm:flex-row sm:items-baseline sm:justify-center sm:gap-[12px] sm:text-center">
        <h2 className="text-[length:clamp(16px,1.15vw,20px)] font-bold tracking-[-0.02em] text-ink">What I can do for you.</h2>
        <p className="text-[length:clamp(12px,0.8vw,14px)] text-ink-muted">Pick one or stack a few.</p>
      </div>

      {/* Same grid as the reference (.bento + .sgrid__services): 1 column under 640px, 2 up to 1099px, 5 from 1100px. */}
      <ul className="grid grid-cols-1 gap-[clamp(10px,1vw,16px)] sm:grid-cols-2 lg:grid-cols-5">
        {OFFERS.map((offer, i) => (
          <li
            key={offer.title}
            className="group relative flex min-w-0 flex-col rounded-[22px] border border-line bg-surface px-[clamp(12px,1.1vw,18px)] py-[clamp(12px,1.4vh,18px)] shadow-[0_1px_1.5px_rgba(58,28,22,0.04),0_10px_30px_-18px_rgba(58,28,22,0.28)] transition-[translate,scale,box-shadow,border-color] duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:border-line-strong hover:shadow-[0_1px_1.5px_rgba(58,28,22,0.05),0_18px_40px_-20px_rgba(58,28,22,0.38)] active:scale-[0.97] max-sm:p-[14px] [@media(hover:none)]:hover:translate-y-0"
          >
            <span className="flex items-start justify-between gap-[8px]">
              <span className="mb-[6px] flex items-center">
                {offer.logos.map((logo, j) => (
                  <span
                    key={logo}
                    className={`inline-grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[#fff] shadow-[inset_0_0_0_1px_rgba(58,28,22,0.14),0_6px_14px_-10px_rgba(6,12,26,0.5)] transition-transform duration-[340ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${j > 0 ? "-ml-[8px]" : ""} ${LOGO_HOVER[j % LOGO_HOVER.length]}`}
                  >
                    <img src={logo} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                  </span>
                ))}
              </span>
              <span className="pt-[4px] text-[11px] font-semibold tracking-[0.12em] text-blueberry max-sm:text-[12px]">
                {String(i + 1).padStart(2, "0")} / {String(OFFERS.length).padStart(2, "0")}
              </span>
            </span>
            <h3 className="text-[length:clamp(16px,1.15vw,19px)] leading-[1.15] font-semibold tracking-[-0.012em] text-ink">
              {offer.title}
            </h3>
            <p className="mt-[6px] min-h-[2.8em] text-[length:clamp(11.5px,0.74vw,13px)] leading-[1.45] tracking-[0.004em] text-ink-muted max-sm:min-h-0 max-sm:text-[13px]">
              {offer.desc}
            </p>
            {/* Pill colours copied from the reference (.sgrid__chip): orange ink on a 12% orange wash with a 22% orange inset ring. */}
            <span className="mt-[8px] self-start rounded-full bg-[rgba(255,122,26,0.12)] px-[9px] py-[4px] text-[10.5px] font-bold tracking-[0.08em] text-[#b4490a] uppercase shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] max-sm:text-[12px] dark:text-[#ff9a4d]">
              {offer.chip}
            </span>
            <ul className="mt-[10px] flex flex-col gap-[5px]">
              {offer.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-[7px] text-[length:clamp(11.5px,0.68vw,13px)] leading-[1.35] text-ink"
                >
                  <SlabCheck />
                  {bullet}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------- 3. Live automation */

function LiveAutomation() {
  return (
    <div className="flex min-w-0 flex-col gap-[clamp(12px,1.6vh,18px)]">
      <header className="flex flex-col items-center gap-[12px] px-[4px] text-center">
        <div className="flex flex-col items-center gap-[6px]">
          <p className={EYEBROW}>Automation</p>
          <h2 className="text-[length:clamp(20px,1.5vw,28px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
            One form. The rest runs itself.
          </h2>
          <p className="max-w-[60ch] text-[length:clamp(13px,0.85vw,15px)] leading-[1.5] text-ink-muted">
            Someone fills a form. The system books the call, sends reminders, and sorts what happens next.
          </p>
        </div>
        <ul aria-label="Tools that power this flow" className="flex flex-wrap justify-center gap-[8px]">
          {FLOW_TOOLS.map((tool) => (
            <li
              key={tool.label}
              className="inline-flex items-center gap-[6px] rounded-full bg-surface px-[10px] py-[5px] text-[12px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
            >
              <Icon name={tool.icon} size={14} weight="bold" className="text-blueberry" />
              {tool.label}
            </li>
          ))}
        </ul>
      </header>

      <div className="flex min-h-0 min-w-0 lg:h-[clamp(380px,50vh,540px)]">
        <AutomationFlow />
      </div>
    </div>
  );
}
