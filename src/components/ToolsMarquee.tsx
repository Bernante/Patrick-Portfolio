import { tools } from "@/lib/site";

/**
 * "Tools I work with" strip.
 *
 * Layout: an outer pill that fades to butter yellow on its right edge (dark:
 * espresso), holding a label block, a hairline divider, and an inner track
 * where tools sit as plain logo + name entries separated by thin rules.
 *
 * Motion is pure CSS, like the reference's marquee: the track holds the tools
 * twice and runs `drift-left` (globals.css) — exactly half its width every
 * 45s, linear — so the loop is seamless and the browser can animate it without
 * any JavaScript per frame. Hovering the strip pauses it so a tool can be read.
 *
 * Accessibility:
 *  - The moving strip is aria-hidden; a single visually-hidden list carries
 *    the real content, so screen readers hear each tool once.
 *  - Under `prefers-reduced-motion` the moving strip is not shown and a static
 *    wrapped list of the tools appears instead (also aria-hidden, since the
 *    hidden list already names them).
 *  - No client JavaScript: the same markup renders on the server and client.
 */
export function ToolsMarquee() {
  return (
    <section
      aria-labelledby="tools-heading"
      className="group rounded-[2rem] border border-line [background:var(--glass-bg-tools)] p-2 shadow-card"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="shrink-0 px-5 py-3 lg:py-2 lg:pr-6">
          {/* Clay Brown: ~9.7:1 on white, readable at this small size. */}
          <p className="text-[12px] font-semibold tracking-[0.08em] text-blueberry uppercase">
            Daily drivers
          </p>
          <h2 id="tools-heading" className="mt-0.5 text-[length:clamp(15px,1.15vw,20px)] leading-[1.15] font-bold whitespace-nowrap text-ink">
            Tools I work with
          </h2>
        </div>

        <span aria-hidden="true" className="hidden h-12 w-px shrink-0 bg-line lg:block" />

        <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-2xl border border-line bg-white py-3.5 lg:ml-3">
          {/* Moving strip: CSS only, paused while the strip is hovered. */}
          <div
            aria-hidden="true"
            className="min-w-0 flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] motion-reduce:hidden"
          >
            <div className="flex w-max animate-[drift-left_45s_linear_infinite] group-hover:[animation-play-state:paused]">
              {[0, 1].map((copy) =>
                tools.map((tool) => <ToolItem key={`${copy}-${tool.name}`} name={tool.name} logo={tool.logo} />),
              )}
            </div>
          </div>

          {/* Reduced motion: a plain, fully readable list instead. */}
          <ul aria-hidden="true" className="hidden flex-wrap items-center gap-y-3 motion-reduce:flex">
            {tools.map((tool) => (
              <li key={tool.name}>
                <ToolItem name={tool.name} logo={tool.logo} />
              </li>
            ))}
          </ul>

          {/* The accessible copy of the same content, announced once. */}
          <ul className="sr-only">
            {tools.map((tool) => (
              <li key={tool.name}>{tool.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ToolItem({ name, logo }: { name: string; logo: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3 border-r border-line px-10">
      {/* Decorative: the visible label right beside it already names the tool,
          so an alt here would make screen readers say it twice. */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        loading="lazy"
        decoding="async"
        className="pointer-events-none h-6 w-6 shrink-0 object-contain select-none"
      />
      <span className="text-[13.5px] font-semibold whitespace-nowrap text-ink">{name}</span>
    </span>
  );
}
