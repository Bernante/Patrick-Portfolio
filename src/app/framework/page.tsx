import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { Icon, type IconName } from "@/components/Icon";
import { asset, site } from "@/lib/site";
import { profilePhoto } from "@/lib/site";

/**
 * /framework — the Agentic Framework page, opened from the "How I build with
 * AI" card on Projects inside a mac-style browser window (see Projects.tsx).
 *
 * It is a standalone page, like the reference's: its own small header with a
 * link back to the portfolio, and no sidebar or tab bar (globals.css hides the
 * shell whenever #framework-page is on the page).
 *
 * The method, its wording and the credits below are Kenneth Villar's, copied at
 * the owner's request from portfolio.brewedops.cloud's framework page. The
 * tools named here (Obsidian, opensrc, code-structure, greploop, scanloop) are
 * that framework's, so keep them accurate to whatever the owner actually runs.
 */

export const metadata: Metadata = {
  title: `${site.firstName}'s AI Agentic Framework`,
  description:
    "The tools, the rules, and the loop I use to build apps with AI. The AI does the typing and the busywork. I do the thinking and make the calls.",
};

/* ------------------------------------------------------------------ pieces */

/** The same marks the reference uses, in public/logos/framework/. */
const LOGO = {
  claude: asset("/logos/framework/claude.svg"),
  codex: asset("/logos/framework/codex.svg"),
  cursor: asset("/logos/framework/cursor.svg"),
  antigravity: asset("/logos/framework/antigravity.png"),
  gemini: asset("/logos/framework/gemini.svg"),
  obsidian: asset("/logos/framework/obsidian.png"),
  markdown: asset("/logos/framework/markdown.png"),
  folder: asset("/logos/framework/folderblue.webp"),
  you: asset("/logos/framework/youavatar.png"),
} as const;

/** The AI tools named in "The helper", shown as a logo row like the reference. */
const HELPERS = [
  { name: "Claude", src: LOGO.claude },
  { name: "Codex", src: LOGO.codex },
  { name: "Cursor", src: LOGO.cursor },
  { name: "Antigravity", src: LOGO.antigravity },
  { name: "Gemini", src: LOGO.gemini },
] as const;

/*
 * Type scale copied from the reference's framework page, measured at 390, 520,
 * 620, 760, 900, 1100 and 1415px wide. The finding that matters: almost all of
 * its type is a FIXED size at every width — only the h1, the two hero lines,
 * the part name and the closing heading scale — so these are plain px, not
 * clamps. (Sizing them fluidly made the page read much smaller than the
 * reference inside the ~620px pop-up, even though both matched at 1415px.)
 *   fixed  card h3 21/1.05 w600 · card body 16/1.55 · part body 15.5/1.6
 *          analogy 14.5/1.5 italic · badge 11 w600 .08em · credits 15/1.5
 *          band pill 12.5 w600 .18em · group kicker 14 w600 .1em · chip 14 w500
 *          habit title 15/1.6 w700 accent · habit body 14/1.5 · callout 15/1.55
 *          step title 12/1.2 w700 · step note 10.5/1.3 · setup 16.5/1.05 w600
 *          code 13/1.65 · closing body 17/1.6 · footer 13/1.6 · box title 21
 *   fluid  h1 33→76 · hero sub 17→21 · hero bold 16→19 · part name 18→19
 *          closing h2 24→40
 * Colours, font and logo files are the reference's own (see globals.css
 * #framework-page and public/logos/framework/), so this page matches it rather
 * than the rest of this site.
 */
const CARD =
  "rounded-[var(--r)] border border-line bg-[var(--card)] p-[36px] shadow-[0_20px_50px_-34px_rgba(11,30,63,0.4)] [backdrop-filter:blur(12px)_saturate(120%)] max-sm:p-[22px]";
const H3 = "text-[21px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink";
const BODY = "mt-[8px] max-w-[74ch] text-[16px] leading-[1.55] text-ink-muted";
const MONO = "font-mono text-[15px] leading-[1.95]";

/** A rule across the page with a centred pill label, like the reference. */
function Band({ label }: { label: string }) {
  return (
    <div className="my-[clamp(28px,4vh,46px)] flex items-center gap-[16px]">
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
      <span className="rounded-full border border-line bg-white px-[16px] py-[8px] text-[12.5px] leading-[1.6] font-semibold tracking-[0.18em] whitespace-nowrap text-ink-muted uppercase">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

/** One row in "The five parts": logo tile, name, orange badge, copy, analogy. */
function Part({
  logo,
  icon,
  name,
  badge,
  children,
  analogy,
}: {
  logo?: string;
  icon?: IconName;
  name: string;
  badge: string;
  children: React.ReactNode;
  analogy: string;
}) {
  // .part { display:flex; gap:16px; align-items:flex-start; padding:20px 0;
  // border-top:1px solid var(--line) } — on every row, including the first: the
  // reference's .part:first-child rule never matches, because the phase heading
  // and its lede come before the rows inside the card.
  // The 50px chip carries no plate; the mark itself is the artwork.
  return (
    <div className="flex items-start gap-[16px] border-t border-line py-[20px]">
      <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[13px]">
        {logo ? (
          <img src={logo} alt="" width={50} height={50} className="h-[50px] w-[50px] rounded-[12px] object-contain" />
        ) : (
          <Icon name={icon ?? "sparkle"} size={34} weight="regular" className="text-[#ff7a1a]" />
        )}
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-[10px]">
          <span className="text-[19px] leading-[1.6] font-semibold text-ink max-sm:text-[18px]">{name}</span>
          <span className="rounded-full bg-[rgba(255,122,26,0.12)] px-[8px] py-[3px] text-[11px] leading-normal font-semibold tracking-[0.08em] text-[#b4490a] uppercase shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] dark:text-[#ff9a4d]">
            {badge}
          </span>
        </p>
        <p className="mt-[7px] text-[15.5px] leading-[1.6] text-ink-soft">{children}</p>
        <p className="mt-[7px] text-[14.5px] leading-[1.5] text-ink-muted italic">{analogy}</p>
      </div>
    </div>
  );
}

/** A group of parts under an orange kicker ("Before you build", …). */
function PartGroup({ kicker, lede, children }: { kicker: string; lede: string; children: React.ReactNode }) {
  return (
    <section className={`${CARD} mt-[18px]`}>
      <p className="text-[14px] leading-[1.6] font-semibold tracking-[0.1em] text-[#ff7a1a] uppercase">{kicker}</p>
      {/* No rule under the lede: the line comes from the first .part's border-top. */}
      <p className="mt-[4px] text-[14.5px] leading-[1.5] text-ink-muted">{lede}</p>
      {children}
    </section>
  );
}

/**
 * A copyable terminal block, matching the reference's .codeblock: the same dark
 * navy as the build-loop canvas, a bar with a mono label and a Copy button, and
 * 13px/1.65 mono type that scrolls sideways rather than wrapping.
 */
function Code({ label, children }: { label: string; children: string }) {
  return (
    <div className="mt-[10px] overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#0e1626]">
      <div className="flex items-center justify-between gap-[12px] border-b border-[rgba(255,255,255,0.08)] px-[13px] py-[9px]">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#ff9a5a] uppercase">{label}</span>
        <CopyButton text={children} />
      </div>
      <pre className="m-0 overflow-x-auto px-[15px] py-[14px]">
        <code className="font-mono text-[13px] leading-[1.65] whitespace-pre text-[#dce8f6]">{children}</code>
      </pre>
    </div>
  );
}

/** One node in the build-loop canvas: icon box, handles, number, two labels. */
function Node({
  icon,
  n,
  title,
  note,
  trigger,
  loop,
}: {
  icon: React.ReactNode;
  n?: string;
  title: string;
  note: string;
  trigger?: boolean;
  loop?: boolean;
}) {
  return (
    <div className={`relative flex w-[96px] flex-none flex-col items-center ${trigger ? "lg:mt-[30px]" : ""}`}>
      <div
        className={`relative grid h-[56px] w-[56px] place-items-center border-[1.5px] shadow-[0_10px_22px_-12px_rgba(0,0,0,0.6)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/node:-translate-y-[3px] ${
          trigger
            ? "rounded-[28px_12px_12px_28px] border-[rgba(255,255,255,0.14)] [background:linear-gradient(135deg,rgba(255,122,26,0.28),#1b2740)] text-[#ff7a1a]"
            : loop
              ? "rounded-[13px] border-[#ff7a1a] bg-[#1b2740] text-[#ff7a1a] shadow-[0_12px_24px_-10px_rgba(255,122,26,0.55)]"
              : "rounded-[13px] border-[rgba(255,255,255,0.14)] bg-[#1b2740] text-[#cdd9ec]"
        }`}
      >
        {!trigger && <span aria-hidden="true" className="absolute top-1/2 -left-[5px] z-[3] h-[9px] w-[9px] -translate-y-1/2 rounded-full border-2 border-[#ff7a1a] bg-[#0e1626]" />}
        {icon}
        <span aria-hidden="true" className="absolute top-1/2 -right-[5px] z-[3] h-[9px] w-[9px] -translate-y-1/2 rounded-full border-2 border-[#ff7a1a] bg-[#0e1626]" />
        {n && (
          <span
            className={`absolute -top-[8px] -left-[8px] z-[4] grid h-[20px] w-[20px] place-items-center rounded-full border-[1.5px] text-[10.5px] font-bold text-white ${
              loop ? "border-[#ff7a1a] bg-[#ff7a1a]" : "border-[rgba(255,255,255,0.2)] bg-[#0e1626]"
            }`}
          >
            {n}
          </span>
        )}
      </div>
      <span className="mt-[11px] block w-[96px] text-center">
        <span className="block text-[12px] leading-[1.2] font-bold text-[#eef3fb]">{title}</span>
        <span className="mt-[3px] block text-[10.5px] leading-[1.3] text-[#8294ae]">{note}</span>
      </span>
    </div>
  );
}

/** A connector wire with a spark travelling along it. `big` is the wider one. */
function Wire({ delay, big }: { delay: number; big?: boolean }) {
  const w = big ? 30 : 22;
  return (
    <div
      aria-hidden="true"
      className={`relative hidden h-[56px] flex-none self-start lg:block ${big ? "mt-[30px] basis-[30px]" : "basis-[22px]"}`}
      style={{ width: w, ["--w" as string]: `${w}px` }}
    >
      <svg viewBox="0 0 40 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path d="M0 28 C 16 28 24 28 40 28" fill="none" strokeWidth={2} className={big ? "stroke-[#ff7a1a] opacity-70" : "stroke-[rgba(255,255,255,0.32)]"} />
      </svg>
      <span
        className="absolute top-[28px] left-0 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#ffb877] shadow-[0_0_8px_2px_rgba(255,122,26,0.85)] [animation:fw-spark_1.4s_linear_infinite] motion-reduce:hidden"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

/** The bordered group that holds one or more nodes under a small title. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex w-full max-w-[300px] flex-col items-center gap-[18px] rounded-[14px] border border-[rgba(150,170,255,0.22)] bg-[rgba(124,140,255,0.06)] px-[12px] pt-[30px] pb-[14px] lg:w-auto lg:max-w-none lg:flex-row lg:items-start lg:gap-0">
      <span className="absolute top-[10px] left-[14px] text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#aeb9d6] uppercase">
        {title}
      </span>
      {children}
    </div>
  );
}

/** 24px stroke icons for the nodes, drawn like the reference's. */
const ICON = {
  bolt: <path d="M13 2 4.5 13.5a.6.6 0 0 0 .5 1H11l-1 7.5 8.5-11.5a.6.6 0 0 0-.5-1H12l1-7.5Z" />,
  person: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c.4-3.6 3.3-6 7-6s6.6 2.4 7 6" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-2-1.5-5-1.5-7 0v12c2-1.5 5-1.5 7 0 2-1.5 5-1.5 7 0V6c-2-1.5-5-1.5-7 0z" />
      <path d="M12 6v12" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2.2" />
      <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
    </>
  ),
  squares: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
  loupe: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 20 20" />
    </>
  ),
  arrow: <path d="M5 12h12M13 7l5 5-5 5" />,
} as const;

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-[26px] w-[26px]">
      {children}
    </svg>
  );
}

/** A numbered sub-step inside the setup guide. */
function SetupStep({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-[18px] border-t border-line pt-[16px]">
      <p className="flex items-center gap-[9px]">
        <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-[rgba(255,122,26,0.14)] text-[11px] font-bold text-[#b4490a] shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] dark:text-[#ff9a4d]">
          {n}
        </span>
        <span className="text-[16.5px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">{title}</span>
      </p>
      <div className="mt-[10px] text-[14.5px] leading-[1.55] text-ink-muted">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- page */

export default function FrameworkPage() {
  return (
    <div id="framework-page" className="relative mx-auto w-full max-w-[1080px] px-[24px] pt-[30px] pb-[60px]">
      {/* ---- header ---- */}
      <header className="mb-[54px] flex flex-wrap items-center justify-between gap-[12px]">
        <span className="flex items-center gap-[10px]">
          <img
            src={profilePhoto}
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] flex-none rounded-full border-[1.5px] border-line-strong bg-[var(--card-solid)] object-cover p-[3px] shadow-[0_4px_12px_-6px_rgba(11,30,63,0.35)]"
          />
          <span className="text-[18px] font-semibold text-ink">{site.name}</span>
        </span>
        <span className="flex items-center gap-[14px]">
          <Link
            href="/"
            className="rounded-full border border-line bg-white px-[16px] py-[8px] text-[13px] font-semibold text-ink shadow-[0_1px_2px_rgba(58,28,22,0.06)] transition-[translate,box-shadow] duration-200 hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a]"
          >
            Portfolio
          </Link>
          <span className="text-[11.5px] font-semibold tracking-[0.16em] text-ink-muted uppercase max-sm:hidden">
            Agentic Engineering
          </span>
        </span>
      </header>

      {/* ---- hero ---- */}
      <section className="mx-auto mb-[18px] max-w-[860px] text-center">
        <h1 className="text-[length:clamp(33px,6.6vw,76px)] leading-[1.02] font-bold tracking-[-0.02em] text-ink">
          {site.firstName}&rsquo;s AI <span className="text-[#ff7a1a]">Agentic</span> Framework
        </h1>
        <p className="mx-auto mt-[clamp(14px,2vh,22px)] max-w-[62ch] text-[length:clamp(17px,2.1vw,21px)] leading-[1.55] text-ink-muted">
          The tools, the rules, and the loop I use to build apps with AI. The AI does the typing and the busywork. I do
          the thinking and make the calls.
        </p>
        <p className="mx-auto mt-[clamp(12px,2vh,18px)] max-w-[60ch] text-[length:clamp(16px,2vw,19px)] leading-[1.6] font-medium text-ink">
          You stay in charge. The AI does the heavy lifting.{" "}
          <span className="font-bold text-[#ff7a1a]">That is the deal.</span>
        </p>
        <p className="mt-[clamp(14px,2vh,20px)] text-[15px] leading-[1.5] text-ink-muted">
          Credits to{" "}
          <a
            href="https://www.youtube.com/@mickeywithai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#ff7a1a] underline-offset-2 hover:underline"
          >
            Mickey
          </a>
          <span aria-hidden="true" className="px-[8px] opacity-50">
            ·
          </span>
          <a
            href="https://www.youtube.com/@nicksaraev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#ff7a1a] underline-offset-2 hover:underline"
          >
            Nick Saraev
          </a>
        </p>
        <ul className="mt-[14px] flex items-center justify-center gap-[12px]">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on ${social.label}`}
                className="grid h-[42px] w-[42px] place-items-center rounded-full border border-line bg-[var(--card-solid)] text-ink shadow-[0_6px_18px_-10px_rgba(11,30,63,0.4)] transition-[transform,border-color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.2,0.9,0.25,1.1)] hover:-translate-y-[4px] hover:scale-[1.06] hover:border-[var(--accent)] hover:shadow-[0_14px_26px_-10px_rgba(255,122,26,0.5)] active:-translate-y-[1px] active:scale-[0.96] active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a1a]"
              >
                <Icon name={social.icon as IconName} size={18} weight="fill" />
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- the core idea ---- */}
      <Band label="The core idea" />
      <section className={CARD}>
        <h2 className={H3}>Two jobs, never mixed up</h2>
        <p className={BODY}>
          If you let the AI decide, it will confidently walk the wrong way and sound sure doing it. The system works
          because each side does only its own job.
        </p>
        <div className="mt-[22px] grid gap-[18px] sm:grid-cols-2">
          <div className="rounded-[16px] border border-[var(--accent-line)] [background:linear-gradient(180deg,rgba(255,122,26,0.07),var(--card-solid)_70%)] p-[24px] max-sm:p-[18px]">
            {/* .job .ico, with .job.boss .ico's accent fill: the :has(img) rule
                that strips the plate loses to it on specificity, so the tile
                keeps its tint and only the border goes. 16px sits on the tile. */}
            <span className="mb-[16px] grid h-[50px] w-[50px] place-items-center overflow-hidden rounded-[13px] bg-[rgba(255,122,26,0.1)]">
              <img src={LOGO.you} alt="" width={50} height={50} className="h-[50px] w-[50px] rounded-[13px] object-cover" />
            </span>
            <p className="mb-[5px] text-[11.5px] font-semibold tracking-[0.14em] text-ink-muted uppercase">Your job</p>
            <p className="mb-[9px] text-[21px] font-semibold text-ink">The boss</p>
            <p className="text-[15.5px] leading-[1.55] text-ink-muted">
              Decide what to build, break it small, steer when it drifts, and call what is good enough to ship.
            </p>
          </div>
          <div className="rounded-[16px] border border-line bg-[var(--card-solid)] p-[24px] max-sm:p-[18px]">
            {/* The reference leads this side with the tool marks, above the kicker. */}
            <ul className="flex flex-wrap gap-[7px]">
              {HELPERS.map((tool) => (
                <li
                  key={tool.name}
                  title={tool.name}
                  className="grid h-[44px] w-[44px] place-items-center rounded-[12px] border border-line-strong bg-cream text-ink transition-[transform,border-color,color] duration-300 ease-[var(--ease-spring)] hover:-translate-y-[2px] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <img src={tool.src} alt={tool.name} width={25} height={25} className="h-[25px] w-[25px] object-contain" />
                </li>
              ))}
            </ul>
            <p className="mb-[5px] text-[11.5px] font-semibold tracking-[0.14em] text-ink-muted uppercase">The AI&rsquo;s job</p>
            <p className="mb-[9px] text-[21px] font-semibold text-ink">The helper</p>
            <p className="text-[15.5px] leading-[1.55] text-ink-muted">
              Claude, Codex, Cursor, Antigravity, Gemini &mdash; whichever you use. It does the typing, searching, and
              fixing. Fast and tireless, but it follows your lead. It never decides what matters.
            </p>
          </div>
        </div>
      </section>

      {/* ---- where everything lives ---- */}
      <Band label="Where everything lives" />
      <section className={CARD}>
        <h2 className={H3}>The whole setup on your computer</h2>
        <p className={BODY}>
          Five parts, in two places: a home folder the AI reads from, plus one tool installed for the whole machine. This
          is the map.
        </p>
        <div className={`${MONO} mt-[14px] overflow-x-auto text-ink`}>
          <pre>
            <code>
              {`~/.claude/            `}
              <span className="text-ink-muted italic">← Your AI&apos;s home folder on this computer</span>
              {`
├── `}
              <span className="font-semibold text-[#ff7a1a]">CLAUDE.md</span>
              {`      `}
              <span className="text-ink-muted italic">← The rulebook. Read first, every time.</span>
              {`
└── skills/           `}
              <span className="text-ink-muted italic">← Your installed skills live here</span>
              {`
      ├── `}
              <span className="font-semibold text-[#ff7a1a]">code-structure/</span>
              {`  `}
              <span className="text-ink-muted italic">← Keeps your code tidy</span>
              {`
      └── `}
              <span className="font-semibold text-[#ff7a1a]">greploop/</span>
              {`        `}
              <span className="text-ink-muted italic">← The inspector loop, until 5 / 5</span>
              {`

`}
              <span className="font-semibold text-[#ff7a1a]">opensrc</span>
              {`               `}
              <span className="text-ink-muted italic">← Installed once. Hands the AI real source code on demand.</span>
              {`
your-obsidian-vault/  `}
              <span className="text-ink-muted italic">← Your long-term memory, kept wherever you like</span>
            </code>
          </pre>
        </div>
      </section>

      {/* ---- the idea in a nutshell ---- */}
      <Band label="The idea, in a nutshell" />
      <section className={CARD}>
        <h2 className={H3}>How it all works, in plain words</h2>
        <p className={BODY}>
          The AI does not really think. It is a fast helper that has read everything but has no common sense.{" "}
          <strong className="font-semibold text-ink">
            You are the boss who decides; the AI does the typing and the busywork.
          </strong>{" "}
          You stay in charge, it does the heavy lifting.
        </p>
        <div className="mt-[18px] grid gap-[14px] sm:grid-cols-3">
          {[
            { name: "opensrc", text: "Gives the AI the real code so it stops guessing. Fewer wrong moves, fewer bugs." },
            {
              name: "code-structure",
              text: "Keeps one clean version of each thing, so the project never turns into a messy drawer.",
            },
            {
              name: "greploop",
              text: "A second AI scores the work out of 5 and loops fixes until it is a perfect 5 out of 5.",
            },
          ].map((item) => (
            <div key={item.name} className="rounded-[13px] border border-line bg-surface p-[14px]">
              <p className={`${MONO} font-semibold text-[#ff7a1a]`}>{item.name}</p>
              <p className="mt-[6px] text-[14.5px] leading-[1.5] text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-[18px] rounded-[14px] border border-[var(--accent-line)] bg-[rgba(255,122,26,0.08)] px-[18px] py-[15px] text-[15px] leading-[1.55] text-ink-soft">
          <strong className="font-bold text-[#b4490a] dark:text-[#ff9a4d]">The secret:</strong> Build in{" "}
          <strong className="font-semibold text-ink">small pieces</strong>. The AI has a small desk of memory &mdash; a
          small task fits and reaches a perfect score, a giant one overflows and never gets clean. One small clean piece
          to 5/5, then the next.
        </p>
        <ul className="mt-[20px] flex flex-wrap gap-[10px]">
          {["Fewer bugs", "Cleaner projects", "Less babysitting", "Faster shipping", "You stay in control"].map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center gap-[8px] rounded-[100px] border border-line bg-[var(--card-solid)] px-[14px] py-[7px] text-[14px] font-medium text-ink-soft"
            >
              <Icon name="check-plain" size={14} weight="bold" className="text-[#ff7a1a]" />
              {chip}
            </li>
          ))}
        </ul>
      </section>

      {/* ---- the five parts ---- */}
      <Band label="The five parts, in plain words" />
      <PartGroup kicker="Before you build" lede="The AI learns who you are and how you work before it touches anything.">
        <Part logo={LOGO.obsidian} name="Obsidian" badge="Long-term memory" analogy="Like a notebook that hands back every lesson the moment you need it.">
          Your notebook that never forgets. Past work and lessons get written down, so the AI picks up where you left off
          instead of starting from zero.
        </Part>
        <Part logo={LOGO.markdown} name="Global CLAUDE.md" badge="The rulebook" analogy="Like handing a new worker your handbook before day one.">
          One page of standing rules the AI reads at the start of every project: who you are, your taste, what to never
          do, and your tools. You do not repeat yourself.
        </Part>
      </PartGroup>

      <PartGroup kicker="While you build" lede="The AI reads real code instead of guessing from memory.">
        <Part logo={LOGO.folder} name="opensrc" badge="Stops the guessing" analogy="Like reading the real manual instead of guessing how the microwave works.">
          When your app uses someone else&rsquo;s code, the AI often half-remembers it and gets it wrong. opensrc grabs
          the real code so it reads instead of guesses. Fewer bugs.
        </Part>
        <Part logo={LOGO.you} name="You, steering" badge="Stay in control" analogy="Like coaching a player who is fast but needs direction.">
          Watch the build as it happens. The AI is agreeable and will confidently go the wrong way, so you correct course
          like a coach before it goes too far.
        </Part>
      </PartGroup>

      <PartGroup kicker="After each piece" lede="The work gets cleaned and inspected before you move on.">
        <Part logo={LOGO.markdown} name="code-structure" badge="Keeps it tidy" analogy="Like one tidy drawer instead of five half-broken copies.">
          Left alone, the AI makes a new copy of things every time, and bugs hide in the mess. This keeps one clean
          version of each thing, so the project stays safe to work in.
        </Part>
        <Part logo={LOGO.markdown} name="greploop" badge="The inspector" analogy="Like a tireless inspector that sends work back until it is perfect.">
          A second AI checks the work, scores it out of 5, and lists what is wrong. The first AI fixes it, then it is
          checked again, looping until a perfect 5 out of 5. You walk away.
        </Part>
      </PartGroup>

      {/* ---- how a real build goes ---- */}
      <Band label="How a real build goes" />
      <section className={CARD}>
        <h2 className={H3}>One small feature, start to finish</h2>
        <p className={BODY}>
          You build in small clean pieces. Each piece runs through the same six steps before you start the next.
        </p>
        {/* The workflow canvas: dotted dark board, nodes wired left to right with
            travelling sparks, and a dashed loop back from greploop to step 2.
            Below 1100px it stacks into a column, like the reference. */}
        <div className="mt-[16px] overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.1)] bg-[#0e1626] bg-[radial-gradient(rgba(255,255,255,0.1)_1.2px,transparent_1.2px)] [background-position:-1px_-1px] [background-size:19px_19px] px-[14px] py-[24px] max-lg:overflow-visible lg:px-[20px] lg:py-[34px]">
          <div className="relative mx-auto flex w-full flex-col items-center gap-[18px] lg:w-max lg:min-w-max lg:flex-row lg:items-start lg:gap-0 lg:pb-[34px]">
            {/* The loop-back wire, desktop only (the column has no room for it). */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden overflow-visible lg:block" preserveAspectRatio="none">
              <path
                d="M 1005 170 L 1005 188 L 208 188 L 208 169"
                fill="none"
                stroke="#ff7a1a"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="7 9"
                className="opacity-85 [animation:fw-loopdash_1s_linear_infinite] motion-reduce:animate-none"
              />
              <path d="M 203 176 L 208 169 L 213 176" fill="none" stroke="#ff7a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="group/node">
              <Node icon={<Glyph>{ICON.bolt}</Glyph>} title="Run a feature" note="start the build" trigger />
            </div>
            <Wire delay={0} big />

            <Group title="Plan it">
              <div className="group/node">
                <Node icon={<Glyph>{ICON.person}</Glyph>} n="1" title="You decide" note="one small thing" />
              </div>
            </Group>
            <Wire delay={0.26} big />

            <Group title="Build it">
              <div className="group/node">
                <Node icon={<Glyph>{ICON.book}</Glyph>} n="2" title="Get real code" note="via opensrc" />
              </div>
              <Wire delay={0.52} />
              <div className="group/node">
                <Node icon={<Glyph>{ICON.chip}</Glyph>} n="3" title="Build the piece" note="AI types, you steer" />
              </div>
              <Wire delay={0.78} />
              <div className="group/node">
                <Node icon={<Glyph>{ICON.squares}</Glyph>} n="4" title="Tidy up" note="code-structure" />
              </div>
            </Group>
            <Wire delay={1.04} big />

            <Group title="Check &amp; repeat">
              <div className="group/node">
                <Node icon={<Glyph>{ICON.loupe}</Glyph>} n="5" title="Inspect &amp; loop" note="greploop to 5/5" loop />
              </div>
              <Wire delay={1.3} />
              <div className="group/node">
                <Node icon={<Glyph>{ICON.arrow}</Glyph>} n="6" title="Next piece" note="one clean chunk" />
              </div>
            </Group>
          </div>
        </div>
        <p className="mt-[14px] text-[14px] leading-[1.5] text-ink-muted">
          The greploop node re-runs on its own until the score is 5 out of 5. Keep each piece small &mdash; the AI has a
          small &ldquo;desk&rdquo; of memory; a huge task overflows it and never reaches a perfect score.
        </p>
      </section>

      {/* ---- setup ---- */}
      <Band label="How to set it up and use it" />
      <p className="mx-auto mb-[22px] max-w-[74ch] text-center text-[16px] leading-[1.6] text-ink-muted">
        Set these up once and they work as one system. CLAUDE.md is the control center every session reads &mdash; it
        tells Claude when to reach for the others, so start at the top and wire each tool back into it.
      </p>

      <section className={CARD}>
        <p className="flex flex-wrap items-center gap-[10px]">
          <span className="text-[12px] font-bold text-[#ff7a1a]">01</span>
          <span className="grid h-[48px] w-[48px] flex-none place-items-center overflow-hidden rounded-[13px] border border-line-strong bg-[var(--card-solid)]">
            <img src={LOGO.markdown} alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-[9px] object-contain" />
          </span>
          <span className="text-[21px] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
            Global CLAUDE.md
          </span>
          <span className="rounded-full bg-[rgba(255,122,26,0.12)] px-[8px] py-[3px] text-[11px] leading-[1.6] font-semibold tracking-[0.08em] text-[#b4490a] uppercase shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] dark:text-[#ff9a4d]">
            Control center
          </span>
        </p>
        <p className={BODY}>
          The one file that wires everything together. Claude reads it first, every session, on any machine &mdash; it
          tells Claude who you are and when to reach for the other tools. Set this up first.
        </p>

        <SetupStep n="01" title="Create the file">
          <p>Make it in your home config folder. Same place on every project &mdash; Claude Code finds it automatically.</p>
          <Code label="Create the file">{`# macOS / Linux
mkdir -p ~/.claude && touch ~/.claude/CLAUDE.md

# Windows (PowerShell)
New-Item -ItemType File -Force "$HOME\\.claude\\CLAUDE.md"`}</Code>
        </SetupStep>

        <SetupStep n="02" title="Paste this starter — it connects every tool">
          <p>
            This is the hub. Each line below tells Claude when to use Obsidian, opensrc, code-structure, and greploop.
            Edit the names and paths to yours.
          </p>
          <Code label="CLAUDE.md starter">{`# <Your Name> - Global Rules

## Who I am
One line: your role and what you build.

## Stack & tools
- Default stack: React + Vite + TypeScript
- opensrc: run \`opensrc path <pkg>\` and read the real
  source before using any third-party package
- code-structure: keep ONE clean version of each thing,
  never duplicate; extract repeated logic to a service
- greploop: after each small feature, run /greploop
  and loop until the review scores 5/5

## Knowledge (Obsidian = long-term memory)
- Vault: ~/Notes/MyVault (mac) | D:\\Notes\\MyVault (win)
- Check the vault FIRST for past decisions before web search
- On "save progress", write a session note into the vault

## House rules
- <your design taste, tone, and what to never do>`}</Code>
        </SetupStep>

        <SetupStep n="03" title="Keep it lean (most important rule)">
          <p>
            CLAUDE.md is read on every single message, so every line costs the AI memory. A bloated rulebook makes Claude
            dumber, not smarter.
          </p>
          <ul className="mt-[10px] flex flex-col gap-[6px]">
            {[
              "One page max. If a topic needs depth, put it in the Obsidian vault and link to it — never inline long docs here.",
              "Rules only. No session logs, no history, no pasted code.",
              "Short bullets over paragraphs.",
              "Prune often. This is the live rulebook, not an archive — move stale rules out.",
            ].map((rule) => (
              <li key={rule} className="flex gap-[8px] text-[14.5px] leading-[1.5]">
                <Icon name="check-plain" size={14} weight="bold" className="mt-[3px] flex-none text-[#ff7a1a]" />
                {rule}
              </li>
            ))}
          </ul>
        </SetupStep>

        <SetupStep n="04" title="Confirm it loaded">
          <p>Nothing to run &mdash; Claude Code reads it automatically. To check, start a project and ask:</p>
          <Code label="Type to Claude">What house rules are you following on this project?</Code>
          <p className="mt-[12px] rounded-[12px] border border-line bg-surface p-[14px] text-[15px] leading-[1.55]">
            <strong className="font-bold tracking-[0.06em] text-ink uppercase">Outcome</strong>
            <br />
            One lean file silently steers every project: your stack, your taste, and exactly when Claude should pull in
            Obsidian, opensrc, code-structure, and greploop.
          </p>
        </SetupStep>
      </section>

      <div className="mt-[16px] grid gap-[16px] sm:grid-cols-2">
        {[
          { n: "02", name: "Obsidian", logo: LOGO.obsidian, badge: "Long-term memory", text: "Wire Claude into a vault so it can read, write, and search your notes. Connected to the hub through CLAUDE.md." },
          { n: "03", name: "opensrc", logo: null, badge: "Real code", text: "Hands Claude the real source code of any package, so it reads the truth instead of guessing. Triggered by a rule in CLAUDE.md." },
          { n: "04", name: "code-structure", logo: LOGO.markdown, badge: "Tidy", text: "A skill that keeps one clean version of each thing instead of scattered duplicate copies. Triggered by a rule in CLAUDE.md." },
          { n: "05", name: "greploop", logo: LOGO.markdown, badge: "Inspector", text: "A review loop that scores the work out of 5 and fixes until perfect. Your own free version, triggered by a rule in CLAUDE.md." },
        ].map((item) => (
          <section key={item.n} className="rounded-[18px] border border-line bg-[var(--card)] px-[24px] py-[22px] shadow-[0_18px_48px_-30px_rgba(11,30,63,0.45)] [backdrop-filter:blur(10px)_saturate(120%)]">
            <p className="flex flex-wrap items-center gap-[16px]">
              <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[13px] bg-[var(--accent)] text-[18px] font-bold text-white">{item.n}</span>
              <span className="grid h-[48px] w-[48px] flex-none place-items-center overflow-hidden rounded-[13px] border border-line-strong bg-[var(--card-solid)]">
                <img src={item.logo ?? LOGO.folder} alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-[9px] object-contain" />
              </span>
              <span className="text-[21px] font-semibold text-ink">{item.name}</span>
              <span className="rounded-full bg-[rgba(255,122,26,0.12)] px-[8px] py-[3px] text-[11px] leading-[1.6] font-semibold tracking-[0.08em] text-[#b4490a] uppercase shadow-[inset_0_0_0_1px_rgba(255,122,26,0.22)] dark:text-[#ff9a4d]">
                {item.badge}
              </span>
            </p>
            <p className="mt-[6px] text-[14.5px] leading-[1.5] text-ink-muted">{item.text}</p>
          </section>
        ))}
      </div>

      <section className={`rounded-[18px] border border-line bg-[var(--card)] px-[24px] py-[22px] shadow-[0_18px_48px_-30px_rgba(11,30,63,0.45)] [backdrop-filter:blur(10px)_saturate(120%)] mt-[16px]`}>
        <p className="flex flex-wrap items-center gap-[16px]">
          <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[13px] bg-[var(--accent)] text-[18px] font-bold text-white">06</span>
          <span className="text-[21px] font-semibold text-ink">scanloop</span>
          <span className="rounded-full border border-line px-[8px] py-[3px] text-[11px] leading-[1.6] font-semibold tracking-[0.08em] text-ink-muted uppercase">
            Optional extra
          </span>
        </p>
        <p className="mt-[6px] text-[14.5px] leading-[1.5] text-ink-muted">
          Optional, but good to have. A free local security scan of your changes &mdash; leaked secrets, injection
          patterns, vulnerable dependencies &mdash; run right before greploop. Everything stays on your machine: no paid
          service, no account, no code leaves. It is the deterministic catch the AI reviewer can eyeball past.
        </p>
      </section>

      {/* ---- habits ---- */}
      <Band label="The habits that keep it sharp" />
      <section className={CARD}>
        <h2 className={H3}>Four habits behind the loop</h2>
        <p className={BODY}>
          The tools do the work; these habits are what make the work trustworthy. They are the difference between
          directing the AI and just hoping it lands.
        </p>
        <div className="mt-[22px] grid gap-[18px] sm:grid-cols-2">
          {[
            {
              title: "Plan before you build",
              text: 'Write the plan first — the goal, what "done" looks like, which files get touched, and how you will check it. Fixing a plan is cheap; fixing a finished build is not.',
            },
            {
              title: "Keep the AI sharp",
              text: 'A stuffed memory makes the AI dumber, not smarter — it has a "dumb zone" once the chat runs long. Work in small pieces and start fresh often instead of dumping everything in at once.',
            },
            {
              title: "Make it prove the work",
              text: 'Never trust the first try. Give the AI a way to check itself — look at the screenshot, run the test — then reason, act, check, and repeat until it passes a clear bar. "Until the score is 5/5", never "until it feels done".',
            },
            {
              title: "Every bug is an upgrade",
              text: "When something breaks, do not just fix it — add a rule or a note so it cannot happen again. Each fix teaches the system, so the floor keeps rising week after week.",
            },
          ].map((habit) => (
            <div key={habit.title} className="rounded-[13px] border border-line bg-surface p-[16px]">
              {/* The reference sets these titles in the accent, not the ink colour. */}
              <p className="text-[15px] leading-[1.6] font-bold text-[#ff7a1a]">{habit.title}</p>
              <p className="mt-[6px] text-[14px] leading-[1.5] text-ink-muted">{habit.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-[18px] rounded-[14px] border border-[var(--accent-line)] bg-[rgba(255,122,26,0.08)] px-[18px] py-[15px] text-[15px] leading-[1.55] text-ink-soft">
          <strong className="font-bold text-[#b4490a] dark:text-[#ff9a4d]">One safety rule:</strong> Assume the AI will
          act on anything it can reach &mdash; even unasked. One misread task can send a real email or delete real files.
          Gate the dangerous things with real limits and backups, not just by telling it &ldquo;do not&rdquo;.
        </p>
      </section>

      {/* ---- closing ---- */}
      <Band label="The mindset that matters most" />
      <section className={`${CARD} text-center`}>
        <h2 className="text-[length:clamp(24px,3.6vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
          Do not polish forever. Ship early.
        </h2>
        <p className="mx-auto mt-[12px] max-w-[64ch] text-[17px] leading-[1.6] text-ink-muted">
          The people who win launch something a bit rough, learn from real users, and improve in the open. The framework
          gives you fewer bugs, a tidy project, less babysitting, and faster shipping, while you stay the one in control.
        </p>
      </section>

      <footer className="mt-[clamp(24px,4vh,44px)] border-t border-line pt-[18px] text-center">
        <p className="text-[13px] leading-[1.6] font-semibold text-ink">{site.firstName}&rsquo;s AI Agentic Framework</p>
        <p className="mt-[4px] text-[13px] leading-[1.6] text-ink-muted">You think. The AI builds. The loop makes it perfect.</p>
      </footer>
    </div>
  );
}
