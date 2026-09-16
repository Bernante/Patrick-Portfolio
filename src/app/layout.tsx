import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Poppins } from "next/font/google";
import { A11yWidget } from "@/components/A11yWidget";
import { JsonLd } from "@/components/JsonLd";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ParticlesBackdrop } from "@/components/ParticlesBackdrop";
import { PerfTier } from "@/components/PerfTier";
import { Sidebar } from "@/components/Sidebar";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { asset, pages, site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Each route sets its own title; this template appends the name to it.
    default: pages.home.title,
    template: `%s | ${site.name}`,
  },
  description: pages.home.description,
  applicationName: `${site.name} Portfolio`,
  // A plain file, not an icon.tsx route: Next leaves the GitHub Pages
  // sub-folder off the auto-generated icon link, so the favicon would break.
  icons: { icon: [{ url: asset("/icon.png"), type: "image/png", sizes: "512x512" }] },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "AI automation specialist",
    "GoHighLevel expert",
    "GHL automation",
    "web developer",
    "Next.js developer",
    "video editor",
    "AI chatbot developer",
    "workflow automation",
    "Patrick Bernante",
  ],
  category: "technology",
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: pages.home.title,
    description: pages.home.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pages.home.title,
    description: pages.home.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#6B352A",
  width: "device-width",
  initialScale: 1,
  // Lets the floating mobile tab bar clear the iPhone home indicator.
  viewportFit: "cover",
  // Never trap a reader who needs to pinch-zoom.
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning below: the inline script adds the `js` class to
  // <html> before React hydrates, so server and client markup differ there by
  // design. It is scoped to that one element.
  return (
    <html lang="en" data-theme="light" className={poppins.variable} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: flags that JS is alive so the scroll-reveal
            CSS may hide content. Without this flag the page renders fully
            visible — no blank screen if scripts are blocked or slow. */}
        <script
          dangerouslySetInnerHTML={{
            // Also sets the theme before first paint (no light flash for a
            // saved dark choice). Only a saved "dark" gives dark; a first visit
            // or blocked storage is light, like the reference.
            __html: `document.documentElement.classList.add('js');try{document.documentElement.dataset.theme=localStorage.getItem('pb-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}try{var p=sessionStorage.getItem('pb-perf-tier');if(p==='mid'||p==='low')document.documentElement.dataset.perf=p}catch(e){}try{var a=JSON.parse(localStorage.getItem('pb-a11y')||'{}'),r=document.documentElement;if(a.text==='lg'||a.text==='xl')r.dataset.a11yText=a.text;if(a.contrast===true)r.dataset.a11yContrast='true';if(a.motion===true)r.dataset.a11yMotion='true';if(a.links===true)r.dataset.a11yLinks='true'}catch(e){}`,
          }}
        />
      </head>
      <body>
        <JsonLd />

        <a
          href="#main"
          className="skip-link rounded-2xl bg-blueberry px-5 py-3.5 text-[1.05rem] font-semibold text-cream"
        >
          Skip to main content
        </a>

        {/* CustomCursor wraps the app so the follower dot is available on every
            route and CustomCursorTarget can be used anywhere beneath it.
            `select-text` is deliberate: the component's base class is
            `select-none`, which site-wide would stop visitors selecting or
            copying any text. cn() runs twMerge, so this overrides it. */}
        <CustomCursor className="select-text" color="#ff4c24">
          {/* Particle background, desktop only (see ParticlesBackdrop.tsx). */}
          <ParticlesBackdrop />
          {/* Adaptive performance check: lightens effects on slow devices. */}
          <PerfTier />

          {/* The shell lives in the layout so the sidebar keeps its state and
              does not re-mount or re-animate when you move between routes. */}
          <div className="lg:flex">
            <Sidebar />

            {/* Desktop outer layout: [sidebar 24rem, shrink-0] → 56px gap →
                [main flex-1] → 56px right padding. One fixed px value on each
                side, no centring and no max-width, so extra viewport width
                (wider screens, zooming out) widens the content instead of
                piling up as empty space on the right.
                On the one-screen home the vertical padding scales with the
                viewport height (32px on short laptops up to 54px), like the
                reference, so the bento keeps its height; Hero.tsx subtracts the
                same clamp. */}
            {/* Phones/tablets, like the reference: 20px sides, 22px top and
                96px bottom (clears the tab bar), plus the iPhone safe areas. */}
            <main id="main" className="min-w-0 flex-1 px-[20px] pt-[calc(22px+env(safe-area-inset-top,0px))] pb-[calc(96px+env(safe-area-inset-bottom,0px))] [@media(max-height:500px)]:pb-10 lg:px-[56px] lg:py-12 fit:has-[#home]:py-[clamp(32px,5vh,54px)]">
              {/* No page footer: the copyright lives in the sidebar, like the reference. */}
              <div className="flex w-full flex-col gap-20 lg:gap-24">{children}</div>
            </main>
          </div>

          <MobileTabBar />
          <FloatingThemeToggle />
          <A11yWidget />
        </CustomCursor>

        {/* Vercel's pageview counter. It only reports to the Vercel dashboard;
            it cannot be read back for an on-page visit counter. Renders nothing
            and is inert on the static GitHub Pages copy. */}
        <Analytics />
      </body>
    </html>
  );
}
