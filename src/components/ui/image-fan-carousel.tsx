"use client";

import { AnimatePresence, motion, type PanInfo, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * 360° ring carousel (from 21st.dev "image-fan-carousel"), adapted to show
 * websites and funnels instead of photos.
 *
 * Changes from the original — ring geometry, spring rotation, autoplay,
 * crossfade and the nav buttons are kept as they were:
 *  - Takes `items` instead of a hard-coded image list.
 *  - An item with a `link` is a real link that opens in a new tab (ring cards
 *    and the centre card). Without a link the card is not clickable.
 *  - An item without an `image` shows a "Coming Soon" placeholder of the same
 *    size and shape, so real screenshots can be dropped in later with no
 *    layout change.
 *  - Every card is drawn as a browser window, like the Automations frames on
 *    the Projects page: a light title bar with red/yellow/green dots over the
 *    screenshot. The card's outer size is unchanged.
 *  - Screenshots are cropped from the top (`object-top`), so a homepage shows
 *    its header and hero.
 *  - Performance: the whole ring is driven by ONE spring. Each card derives its
 *    transform from that value, so a step starts one animation instead of two
 *    per card and the ring never re-renders mid-animation. The combined
 *    transform — rotateY(a) translateZ(r) rotateX(tilt) rotateY(-a) — is the
 *    same geometry as the original nested pair. Cards are kept on their own
 *    compositor layer (`will-change: transform`).
 *  - The ring's radius is capped so the outer cards stay on screen on narrow
 *    phones.
 *  - No arrow buttons: drag with the mouse or swipe with a finger to turn the
 *    ring (left = next, right = previous), past a 60px / fast-flick threshold.
 *    The area only claims horizontal gestures (`touch-action: pan-y`), so
 *    vertical page scrolling still works when a swipe starts on it. With the
 *    buttons gone, the carousel itself is focusable and turns with ← / →.
 *  - Autoplay stops for readers who prefer reduced motion, skips steps while
 *    the tab is hidden, and pauses while dragging and for a moment after.
 *  - Uses `motion/react` and Phosphor icons, which this project already ships,
 *    instead of adding `framer-motion` and `react-icons` (same APIs).
 */

export interface GalleryItem {
  /** Site or funnel name, used for the caption and alt text. */
  title: string;
  /** Screenshot of the site's homepage. Leave out to show "Coming Soon". */
  image?: string;
  /** Destination opened in a new tab. Leave out to make the card not clickable. */
  link?: string;
}

// ─────────────────────────────────────────────
// Customize here — timing, sizes, geometry
// ─────────────────────────────────────────────

// How often the carousel auto-rotates (ms)
const AUTOPLAY_INTERVAL_MS = 2400;

// Spring physics for the ring rotation
const springTransition = {
  type: "spring",
  stiffness: 60,
  damping: 16,
  mass: 0.7,
} as const;

// Ring depth (radius) bounds and how much of the container width it uses
const RADIUS_MIN = 120;
const RADIUS_MAX = 320;
const RADIUS_WIDTH_RATIO = 0.55;
const PERSPECTIVE_MULTIPLIER = 2.4; // how strong the 3D perspective looks
const RING_TILT_DEG = 38; // tilt angle of ring thumbnails

// Center image crossfade
const CROSSFADE_DURATION_S = 0.45;
const CROSSFADE_EASE = [0.22, 1, 0.36, 1] as const;

// Size classes — thumbnails on the ring
const THUMB_SIZE_CLASSES = "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";
const THUMB_SIZES_ATTR = "(max-width: 640px) 48px, (max-width: 768px) 64px, 96px";

// Size classes — active center image
const CENTER_SIZE_CLASSES = "w-44 h-44 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80";
const CENTER_SIZES_ATTR = "(max-width: 640px) 176px, (max-width: 768px) 192px, 320px";

// Drag / swipe: how far (px) or how fast (px/s, with at least MIN px of
// travel) a gesture must go to turn the ring, and how long autoplay waits
// after a gesture before resuming.
const SWIPE_DISTANCE_PX = 60;
const SWIPE_VELOCITY = 500;
const SWIPE_VELOCITY_MIN_PX = 20;
const AUTOPLAY_RESUME_DELAY_MS = 3000;
// How far the ring visibly follows the pointer before snapping back.
const DRAG_ELASTIC = 0.18;

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

// ─────────────────────────────────────────────

// Small spinner shown while an image is loading
const ImageLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5">
    <div className="aspect-square w-1/4 animate-spin rounded-full border-2 border-black/15 border-t-black/50 dark:border-white/20 dark:border-t-white/60" />
  </div>
);

/** Stand-in for a missing screenshot: a warm gradient with "Coming Soon" centred. */
const ComingSoon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    className={`grid h-full w-full place-items-center bg-[linear-gradient(145deg,var(--color-cream-soft),var(--color-cream-deep))] px-[8%] text-center leading-[1.1] font-bold tracking-[-0.01em] text-ink ${className}`}
  >
    Coming Soon
  </span>
);

/**
 * The browser-window chrome, matching the Automations frames: a light gradient
 * bar with a hairline under it and the red/yellow/green dots. `small` is the
 * scaled-down version for ring cards.
 */
const WindowBar: React.FC<{ small?: boolean }> = ({ small = false }) => (
  <span
    aria-hidden="true"
    className={`flex flex-none items-center border-b border-[rgba(11,30,63,0.12)] bg-[linear-gradient(#f4f4ed,#e9e9e0)] ${
      small ? "gap-[2px] px-[4px] py-[3px] sm:gap-[3px] sm:px-[5px] sm:py-[4px] md:gap-[4px] md:px-[7px] md:py-[5px]" : "gap-[6px] px-[12px] py-[9px]"
    }`}
  >
    {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
      <span
        key={color}
        className={`rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${
          small ? "h-[3px] w-[3px] sm:h-[4px] sm:w-[4px] md:h-[5px] md:w-[5px] lg:h-[6px] lg:w-[6px]" : "h-[9px] w-[9px]"
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </span>
);

/** Gap kept between the outermost ring card and the screen edge. */
const EDGE_GAP_PX = 8;

/**
 * Largest ring radius whose cards stay within `halfWidth` of the centre at any
 * angle. A card at angle θ sits at x = r·sinθ and is drawn larger by
 * perspective as it swings toward the viewer: k = P / (P − r·cosθ). With the
 * perspective tied to the radius (P = PERSPECTIVE_MULTIPLIER·r) that factor
 * depends on θ alone, so each angle gives a direct bound on r. The tilted card
 * projects wider than its flat size, hence the 0.75 × width half-extent
 * (measured: a 48px card is drawn up to 84px wide).
 */
function fitRadius(halfWidth: number, cardWidth: number): number {
  const half = cardWidth * 0.75;
  let best = Infinity;
  for (let deg = 5; deg <= 90; deg += 5) {
    const t = (deg * Math.PI) / 180;
    const k = PERSPECTIVE_MULTIPLIER / (PERSPECTIVE_MULTIPLIER - Math.cos(t));
    best = Math.min(best, (halfWidth / k - half) / Math.sin(t));
  }
  return best;
}

/**
 * One card on the ring. Its whole 3D position comes from the shared rotation
 * spring and the radius, so it animates without re-rendering.
 */
// Memoised: an autoplay step only changes the centre card, so the ring cards
// (whose motion comes from the shared spring, not from props) skip re-rendering.
const RingCard = React.memo(function RingCard({
  item,
  index,
  offset,
  rotation,
  radius,
  loaded,
  onLoaded,
}: {
  item: GalleryItem;
  index: number;
  offset: number;
  rotation: MotionValue<number>;
  radius: MotionValue<number>;
  loaded: boolean;
  onLoaded: (index: number) => void;
}) {
  const transform = useTransform([rotation, radius], ([r, z]: number[]) => {
    const angle = r + offset;
    return `rotateY(${angle}deg) translateZ(${z}px) rotateX(${RING_TILT_DEG}deg) rotateY(${-angle}deg)`;
  });
  const Tag = item.link ? motion.a : motion.div;
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      <Tag
        {...cardProps(item)}
        data-ring-card=""
        // Ring cards sit under the centre card; keep them out of the tab
        // order so keyboard users land on the one they can see clearly.
        tabIndex={item.link ? -1 : undefined}
        className={`relative flex flex-col overflow-hidden rounded-lg border border-[rgba(11,30,63,0.12)] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] will-change-transform sm:rounded-xl ${THUMB_SIZE_CLASSES} ${
          item.link ? "cursor-pointer" : ""
        }`}
        style={{ transformStyle: "preserve-3d", transform }}
      >
        <WindowBar small />
        <span className="relative block min-h-0 flex-1">
          {item.image ? (
            <>
              {!loaded && <ImageLoader />}
              <Image
                src={item.image}
                alt={item.title}
                width={96}
                height={96}
                sizes={THUMB_SIZES_ATTR}
                onLoad={() => onLoaded(index)}
                draggable={false}
                className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
                  loaded ? "opacity-90" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <ComingSoon className="text-[8px] opacity-90 sm:text-[10px] md:text-[12px]" />
          )}
        </span>
      </Tag>
    </div>
  );
});

/** A link when the item has one, otherwise a plain box with the same styling. */
function cardProps(item: GalleryItem) {
  return item.link
    ? ({
        href: item.link,
        target: "_blank",
        rel: "noopener noreferrer",
        // Links would otherwise start a native drag instead of turning the ring.
        draggable: false,
        "aria-label": `${item.title} (opens in a new tab)`,
      } as const)
    : ({ "aria-label": `${item.title}, coming soon` } as const);
}

export const Carousel360: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  // One spring for the whole ring; cards read it through RingCard.
  const rotationTarget = useMotionValue(0);
  const rotationSpring = useSpring(rotationTarget, {
    stiffness: springTransition.stiffness,
    damping: springTransition.damping,
    mass: springTransition.mass,
  });
  const radiusValue = useMotionValue(220);
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => items.map(() => false));

  const numItems = items.length;
  const angleStep = 360 / numItems;

  const steps = Math.round(rotation / angleStep);
  const centerIndex = ((-steps % numItems) + numItems) % numItems;
  const centerItem = items[centerIndex];

  // Reset the center loader whenever we land on a new item. Done during
  // render (not in an effect) so it doesn't trigger an extra render pass.
  const [prevCenterIndex, setPrevCenterIndex] = useState(centerIndex);
  const [centerLoaded, setCenterLoaded] = useState(false);
  if (centerIndex !== prevCenterIndex) {
    setPrevCenterIndex(centerIndex);
    setCenterLoaded(false);
  }

  useEffect(() => {
    rotationTarget.set(rotation);
  }, [rotation, rotationTarget]);

  useEffect(() => {
    const updateRadius = () => {
      const box = containerRef.current;
      if (!box) return;
      const width = box.offsetWidth;
      const cardWidth = box.querySelector<HTMLElement>("[data-ring-card]")?.offsetWidth ?? 48;
      const next = Math.min(
        Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * RADIUS_WIDTH_RATIO)),
        fitRadius(window.innerWidth / 2 - EDGE_GAP_PX, cardWidth),
      );
      setRadius(next);
      radiusValue.set(next);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, [radiusValue]);

  // Autoplay is held while dragging and until this time after a gesture.
  const draggingRef = useRef(false);
  const resumeAtRef = useRef(0);
  // Set when a gesture turned the ring, so the click that ends it is ignored.
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      if (document.hidden || draggingRef.current || Date.now() < resumeAtRef.current) return;
      setRotation((prev) => prev + angleStep);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [angleStep]);

  const rotateCarousel = useCallback(
    (direction: "left" | "right") => {
      setRotation((prev) => prev + (direction === "left" ? -angleStep : angleStep));
    },
    [angleStep],
  );

  const onDragStart = useCallback(() => {
    draggingRef.current = true;
  }, []);

  const onDragEnd = useCallback(
    (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      draggingRef.current = false;
      resumeAtRef.current = Date.now() + AUTOPLAY_RESUME_DELAY_MS;
      const { x } = info.offset;
      const flick = Math.abs(info.velocity.x) > SWIPE_VELOCITY && Math.abs(x) > SWIPE_VELOCITY_MIN_PX;
      if (Math.abs(x) < SWIPE_DISTANCE_PX && !flick) return;
      suppressClickRef.current = true;
      // Drag left = next (same way autoplay turns), drag right = previous.
      rotateCarousel(x < 0 ? "right" : "left");
    },
    [rotateCarousel],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      resumeAtRef.current = Date.now() + AUTOPLAY_RESUME_DELAY_MS;
      rotateCarousel(event.key === "ArrowRight" ? "right" : "left");
    },
    [rotateCarousel],
  );

  const markThumbLoaded = useCallback((index: number) => {
    setLoadedThumbs((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  if (numItems === 0) return null;

  const CenterTag = centerItem.link ? motion.a : motion.div;

  return (
    <div className="relative flex w-full flex-col items-center justify-center py-6 select-none sm:py-10">
      <motion.div
        ref={containerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${centerItem.title}. Drag, swipe or use the arrow keys to browse.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={DRAG_ELASTIC}
        dragSnapToOrigin
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClickCapture={(event) => {
          // A gesture that turned the ring must not also open a card's link.
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onPointerDown={() => {
          suppressClickRef.current = false;
        }}
        style={{ touchAction: "pan-y" }}
        className={`relative flex aspect-5/3 w-[92%] max-w-150 cursor-grab items-center justify-center rounded-2xl active:cursor-grabbing ${FOCUS_RING}`}
      >
        <div className="relative h-full w-full" style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}>
          {items.map((item, index) => (
            <RingCard
              key={item.link ?? `item-${index}`}
              item={item}
              offset={angleStep * index}
              rotation={rotationSpring}
              radius={radiusValue}
              index={index}
              loaded={loadedThumbs[index]}
              onLoaded={markThumbLoaded}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <CenterTag
              key={centerIndex}
              {...cardProps(centerItem)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: CROSSFADE_DURATION_S, ease: CROSSFADE_EASE }}
              className={`pointer-events-auto relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(11,30,63,0.12)] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.18)] ${CENTER_SIZE_CLASSES} ${
                centerItem.link ? `cursor-pointer ${FOCUS_RING}` : ""
              }`}
            >
              <WindowBar />
              <span className="relative block min-h-0 flex-1">
                {centerItem.image ? (
                  <>
                    {!centerLoaded && <ImageLoader />}
                    <Image
                      src={centerItem.image}
                      alt={centerItem.title}
                      width={320}
                      height={320}
                      sizes={CENTER_SIZES_ATTR}
                      loading="lazy"
                      onLoad={() => setCenterLoaded(true)}
                      draggable={false}
                      className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
                        centerLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-2.5 text-left text-sm font-semibold text-white">
                      {centerItem.title}
                    </span>
                  </>
                ) : (
                  <ComingSoon className="text-[22px] md:text-[28px] lg:text-[34px]" />
                )}
              </span>
            </CenterTag>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Carousel360;
