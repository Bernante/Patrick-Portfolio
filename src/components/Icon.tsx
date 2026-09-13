import type { IconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowRight,
  ArrowUpRight,
  Blueprint,
  Browsers,
  ChartLineUp,
  ChatCircleDots,
  Chats,
  CheckCircle,
  Code,
  Compass,
  Drop,
  EnvelopeSimple,
  FacebookLogo,
  FilmSlate,
  Flask,
  FolderOpen,
  Funnel,
  GithubLogo,
  GraduationCap,
  House,
  LinkedinLogo,
  MagnifyingGlass,
  MapPin,
  Minus,
  PaperPlaneTilt,
  PenNib,
  Phone,
  Plugs,
  Plus,
  PuzzlePiece,
  Robot,
  SealCheck,
  Sparkle,
  Stack,
  Star,
  TreeStructure,
  User,
  Wrench,
  YoutubeLogo,
  MagicWand,
} from "@phosphor-icons/react/dist/ssr";

/**
 * A named-icon registry so content files (site.ts) can reference icons as
 * plain strings without importing React components.
 */
const registry = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  blueprint: Blueprint,
  browser: Browsers,
  chart: ChartLineUp,
  chat: ChatCircleDots,
  chats: Chats,
  check: CheckCircle,
  code: Code,
  compass: Compass,
  drop: Drop,
  email: EnvelopeSimple,
  facebook: FacebookLogo,
  film: FilmSlate,
  flask: Flask,
  flow: TreeStructure,
  folder: FolderOpen,
  funnel: Funnel,
  github: GithubLogo,
  graduationcap: GraduationCap,
  house: House,
  linkedin: LinkedinLogo,
  magnifyingglass: MagnifyingGlass,
  minus: Minus,
  pen: PenNib,
  phone: Phone,
  pin: MapPin,
  plugs: Plugs,
  plus: Plus,
  puzzle: PuzzlePiece,
  robot: Robot,
  send: PaperPlaneTilt,
  sparkle: Sparkle,
  stack: Stack,
  star: Star,
  verified: SealCheck,
  user: User,
  wand: MagicWand,
  wrench: Wrench,
  youtube: YoutubeLogo,
} as const;

export type IconName = keyof typeof registry;

type Props = Omit<IconProps, "ref"> & {
  name: IconName;
  weight?: IconWeight;
};

export function Icon({ name, weight = "duotone", ...rest }: Props) {
  const Glyph = registry[name];
  if (!Glyph) return null;
  // Icons here are always decorative — the adjacent text carries the meaning.
  return <Glyph weight={weight} aria-hidden="true" focusable="false" {...rest} />;
}
