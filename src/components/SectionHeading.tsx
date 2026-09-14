import { Icon, type IconName } from "./Icon";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  icon: IconName;
  id: string;
  /**
   * Each section is now its own route, so its heading is that page's <h1>.
   * Override to "h2" if a section is ever nested inside another page.
   */
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  id,
  as: Heading = "h1",
}: Props) {
  return (
    // On phones/tablets the right padding keeps the title clear of the floating
    // theme button, as on the reference.
    <header className="max-w-3xl max-lg:pr-[56px]">
      {/* Sizes copied from the reference's page header (pgrid__eyebrow /
          pgrid__title / pgrid__lede). */}
      <p className="flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blueberry text-cream">
          <Icon name={icon} size={20} weight="fill" />
        </span>
        {eyebrow}
      </p>
      <Heading
        id={id}
        className="mt-2 text-[length:clamp(30px,3.1vw,60px)] leading-[1.06] font-bold tracking-[-0.03em] text-ink"
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-2 text-[length:clamp(14px,1vw,19px)] leading-[1.6] text-ink-muted">{description}</p>
      )}
    </header>
  );
}
