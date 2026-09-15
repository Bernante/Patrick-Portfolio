/**
 * Single source of truth for site content + SEO.
 * Edit this file to update the portfolio — components read from here.
 */

import { basePath } from "./base-path";

/**
 * Prefixes a public/ file path with the GitHub Pages sub-folder (see
 * base-path.ts). next/link adds it to links automatically, but plain <img>
 * paths do not, so every file from public/ goes through `asset()`.
 */
export { basePath };
export const asset = (path: string) => `${basePath}${path}`;

export const site = {
  name: "Patrick Bernante",
  firstName: "Patrick",
  role: "AI Automation Specialist, Web Developer & Video Editor",
  shortRole: "AI Automation · Web Dev · Video",
  tagline: "Create once. Run endlessly.",
  // One-line description under the home headline. Separate from `intro`, which
  // still feeds the SEO description and structured data.
  heroDescription: "I help coaches and agencies turn every lead into a booked call, on autopilot.",
  intro:
    "I build AI automations, fast websites and scroll-stopping video for coaches, agencies and small teams — so the work keeps running after you log off.",
  // The live address (GitHub Pages). Change this if you move to your own domain.
  // Public address for SEO links: NEXT_PUBLIC_SITE_URL if set, else Vercel's
  // production domain (exposed automatically on Vercel builds), else GitHub Pages.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://bernante.github.io/Patrick-Portfolio"),
  locale: "en_PH",
  email: "patrickbernante44@gmail.com",
  phone: "+63 900 000 0000",
  location: "Philippines · Working with clients worldwide",
  availability: "Available for new projects",
  // Sidebar social buttons, in this order (the theme toggle sits after them).
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/patrick.bernante", icon: "facebook" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/patrick-bernante-a608b6374/", icon: "linkedin" },
    { label: "Telegram", href: "https://t.me/patrickbernante", icon: "telegram" },
  ],
} as const;

/** Primary navigation. Each entry is a real route, not an anchor. */
export const nav = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Projects", icon: "folder" },
  { href: "/services", label: "Services", icon: "stack" },
  { href: "/testimonials", label: "Testimonials", icon: "star" },
  { href: "/about", label: "About", icon: "user" },
  { href: "/contact", label: "FAQs / Contact", icon: "chat" },
] as const;

export type NavHref = (typeof nav)[number]["href"];

/**
 * Per-route SEO copy. Giving every page its own title and description is the
 * main reason to split the site into routes at all — one shared title across
 * five pages wastes the ranking signal.
 */
export const pages = {
  home: {
    title: `${site.name} — AI Automation, Web Dev & Video`,
    description:
      "I build AI automations, fast websites and scroll-stopping video for coaches, agencies and small teams — so the work keeps running after you log off.",
  },
  projects: {
    title: "Projects",
    description:
      "Selected AI automations, GoHighLevel funnels, websites and video systems built for coaches and agencies — each measured by what changed after it went live.",
  },
  services: {
    title: "Services",
    description:
      "AI automation, GoHighLevel builds, web development and video editing for coaches, agencies and small teams.",
  },
  about: {
    title: "About",
    description:
      "Patrick Bernante — BS Information Technology graduate from Holy Name University and former IT Specialist for the Provincial Government of Bohol, working in web development, IT operations and automation.",
  },
  testimonials: {
    title: "Testimonials",
    description:
      "What coaches, agencies and small teams say about working with Patrick Bernante on AI automation, web development and video.",
  },
  contact: {
    title: "FAQs / Contact",
    description:
      "Quick answers about what Patrick Bernante builds — web development, automation and AI — and how to reach him.",
  },
} as const;

/**
 * Marquee — "Tools I work with".
 *
 * `logo` points at a real brand mark in public/logos/. The SVGs for Claude,
 * n8n, Make, Next.js and Figma are generated from the `simple-icons` package
 * (`node scripts/gen-logos.mjs`); VS Code, ChatGPT and GoHighLevel are the
 * vendors' own published icons; Premiere Pro and After Effects are Adobe's
 * letterform tiles. `icon` is the Phosphor fallback used if a logo is missing.
 */
export const tools = [
  { name: "GoHighLevel", icon: "funnel", logo: asset("/logos/gohighlevel.png") },
  { name: "Claude", icon: "sparkle", logo: asset("/logos/claude.svg") },
  { name: "VS Code", icon: "code", logo: asset("/logos/vscode.png") },
  { name: "n8n", icon: "flow", logo: asset("/logos/n8n.svg") },
  { name: "Make", icon: "puzzle", logo: asset("/logos/make.svg") },
  { name: "Next.js", icon: "browser", logo: asset("/logos/nextjs.svg") },
  { name: "Premiere Pro", icon: "film", logo: asset("/logos/premiere-pro.svg") },
  { name: "After Effects", icon: "wand", logo: asset("/logos/after-effects.svg") },
  { name: "Figma", icon: "pen", logo: asset("/logos/figma.svg") },
  { name: "ChatGPT", icon: "robot", logo: asset("/logos/chatgpt.webp") },
] as const;

/**
 * Client testimonials for the home page. Empty on purpose: add real quotes from
 * real clients (with their permission) and the Testimonials card shows them.
 * Until then the card shows a "coming soon" note instead of invented reviews.
 */
export const testimonials: { quote: string; name: string; role: string }[] = [];

/**
 * Screenshots for the scrolling preview in the home Projects card. Files live in
 * public/projects/. Add an entry here to add a frame to the reel; `width` and
 * `height` are the image's real pixel size, so it is never cropped.
 */
export const projectShots = [
  { src: asset("/projects/agaspay.webp"), alt: "AGASPAY — water billing and usage management platform", width: 1280, height: 585 },
  { src: asset("/projects/salestrack.webp"), alt: "SalesTrack — sales admin dashboard", width: 1280, height: 632 },
] as const;

/**
 * Chips in the home AI Builds card: one sideways-drifting row per entry (the
 * first drifts left, the second right, and so on). `status` "Live" shows a
 * green dot, anything else a grey one.
 */
export const aiBuilds: { name: string; icon: "drop" | "chart"; status: "Live" | "Internal" }[] = [
  { name: "AGASPAY", icon: "drop", status: "Live" },
  { name: "SalesTrack", icon: "chart", status: "Live" },
];

/**
 * Sidebar profile photo: a transparent cut-out (background removed), 900x900,
 * shown like the reference avatar. File in public/about/.
 */
export const profilePhoto = asset("/about/patrick-portrait.webp");

/**
 * Photos for the fanned cards in the home About card (files in public/about/,
 * uncropped; CSS frames them with object-position 50% 20%, like the reference). Order is left card, middle card, then
 * the front card on the right, which sits on top. Empty = the three role icons
 * are shown; one photo is reused on all three cards.
 *
 * `cartoon.webp` is an illustration taken from portfolio.brewedops.cloud at the
 * owner's request; replace it with your own artwork if its licence is unclear.
 */
export const aboutPhotos: { src: string }[] = [
  { src: asset("/about/patrick-1.webp") },
  { src: asset("/about/patrick-2.webp") },
  { src: asset("/about/cartoon.webp") },
];

export const stats = [
  { value: "60+", label: "Automations shipped" },
  { value: "40+", label: "Sites & funnels built" },
  { value: "300+", label: "Videos edited" },
  { value: "5 yrs", label: "Building for clients" },
] as const;

export const services = [
  {
    num: "01",
    title: "AI Automation",
    icon: "robot",
    summary:
      "Agents, chatbots and workflows that answer leads, book calls and follow up while you sleep.",
    points: ["AI chat & voice agents", "Lead capture to booked call", "CRM + email/SMS follow-up"],
  },
  {
    num: "02",
    title: "GoHighLevel Builds",
    icon: "funnel",
    summary:
      "Full GHL setup — pipelines, funnels, calendars and automations wired into one system that actually runs.",
    points: ["Funnels & landing pages", "Pipelines & calendars", "Snapshots & onboarding"],
  },
  {
    num: "03",
    title: "Web Development",
    icon: "code",
    summary:
      "Fast, accessible, SEO-ready websites built with modern tooling — not bloated page builders.",
    points: ["Next.js & React builds", "Core Web Vitals tuning", "On-page SEO baked in"],
  },
  {
    num: "04",
    title: "Video Editing",
    icon: "film",
    summary:
      "Short-form and long-form edits with clean pacing, captions and motion that hold attention.",
    points: ["Reels, Shorts & TikTok", "YouTube long-form", "Captions & motion graphics"],
  },
] as const;

/**
 * Facts row under the home headline on phones (like the reference's stats).
 * Only facts already stated on the site: the services count, the time zone,
 * and the one-business-day reply promised on the Contact page.
 */
export const homeFacts = [
  // 5 = the service cards on the Services page (Services.tsx OFFERS), not the older `services` list below.
  { value: "5", label: "Services" },
  { value: "GMT+8", label: "PH time" },
  { value: "1 day", label: "Reply time" },
] as const;

/**
 * FAQs on the Contact page (also the FAQPage structured data). Only facts the
 * owner has given: the services on the Services page, his degree and IT
 * Specialist role, the Philippines / GMT+8, and the one-business-day reply.
 */
export const faqs = [
  {
    q: "What do you actually build?",
    a: "Web development, GoHighLevel and n8n automations, CRM setup, funnels, custom websites and small apps. I turn ideas and repetitive processes into simple, useful solutions.",
  },
  {
    q: "What is your background?",
    a: "I’m a BS Information Technology graduate from Holy Name University, and I’ve worked as an IT Specialist for the Provincial Government of Bohol.",
  },
  {
    q: "Do I have to be on GoHighLevel?",
    a: "Not at all. I build around your workflow, not a specific platform. Whether you’re using GoHighLevel, Zapier, n8n, a custom CRM, or a combination of tools, I’ll work with what makes the most sense. If your current stack is a poor fit, I’ll say so upfront.",
  },
  {
    q: "How much do you charge?",
    a: "It depends on the build. Tell me what you need below and I will reply with what it would take.",
  },
  {
    q: "What happens after I write?",
    a: "I read it myself and reply within one business day. I’m based in the Philippines, on GMT+8.",
  },
];
