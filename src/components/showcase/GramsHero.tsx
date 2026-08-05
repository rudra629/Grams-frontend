import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useVelocity,
  type MotionValue,
} from "framer-motion";

import brazilAsset from "@/assets/products/Hazelnuts F.png";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE_EXPO = [0.87, 0, 0.13, 1] as const;

/**
 * Sticky scroll sequence hero — 300vh track with a pinned 100vh stage.
 * All internal motion is driven by scrollYProgress (0 → 1) so scrubs stay
 * frame-perfect in both directions.
 *
 * Phases:
 *   0.00 – 0.30  Intro: headline + centered pouch
 *   0.30 – 0.60  Value-prop glass cards float in around the pouch
 *   0.60 – 0.90  Ingredient explosion — parallax elements burst outward
 *   0.90 – 1.00  Handoff: pouch fades + scales down before the slider
 */
export function GramsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const disable = prefersReducedMotion ? 0 : 1;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 30,
  });
  const seedTilt = useTransform(smoothVelocity, [-2, 2], [-24 * disable, 24 * disable]);

  // Velocity-driven skew + tilt for the central pouch — feels like weight.
  const pouchSkewX = useTransform(smoothVelocity, [-3, 3], [8 * disable, -8 * disable]);
  const pouchVelTilt = useTransform(smoothVelocity, [-3, 3], [-14 * disable, 14 * disable]);

  // Extreme foreground DoF layers move faster than scroll for parallax depth.
  const fgLeftY = useTransform(p, [0, 1], [0, -520 * disable]);
  const fgLeftX = useTransform(p, [0, 1], [0, -80 * disable]);
  const fgLeftRot = useTransform(p, [0, 1], [-8, 14]);
  const fgRightY = useTransform(p, [0, 1], [0, 620 * disable]);
  const fgRightX = useTransform(p, [0, 1], [0, 120 * disable]);
  const fgRightRot = useTransform(p, [0, 1], [12, -20]);
  const fgBottomY = useTransform(p, [0, 1], [0, -380 * disable]);

  // ── Pouch (persistent star of the sequence) ────────────────────────────
  // Continuous slow rotation + scale-up across the whole track, layered
  // over an infinite gentle sway so the pouch never sits perfectly still.
  const pouchScrollRotate = useTransform(p, [0, 1], [0, 8 * disable]);
  const pouchScale = useTransform(
    p,
    [0, 0.3, 0.5, 0.9, 1],
    [0.58, 0.92, 1.08, 1.04, 0.86]
  );
  const pouchOpacity = useTransform(p, [0, 0.88, 1], [1, 1, 0]);
  const pouchY = useTransform(p, [0, 1], [0, -30 * disable]);

  // Shadow grows with the pouch — softer at rest, deeper as it pushes in.
  const pouchShadowBlur = useTransform(p, [0, 0.5, 1], [24, 60, 70]);
  const pouchShadowSpread = useTransform(p, [0, 0.5, 1], [18, 55, 65]);
  const pouchShadowAlpha = useTransform(p, [0, 0.5, 1], [0.28, 0.5, 0.55]);
  const pouchFilter = useTransform(
    [pouchShadowBlur, pouchShadowSpread, pouchShadowAlpha] as const,
    ([b, s, a]) => `drop-shadow(0 ${s}px ${b}px rgba(0,0,0,${a}))`,
  );

  // Ambient background drift — a slow radial position sweep gives the mesh
  // gradient a living, expensive quality without competing with content.
  const meshX = useTransform(p, [0, 1], ["50%", "58%"]);
  const meshY = useTransform(p, [0, 1], ["20%", "32%"]);

  // Background marquee track — moves horizontally as the user scrolls down.
  const marqueeX = useTransform(p, [0, 1], ["0%", "-42%"]);
  const marqueeXAlt = useTransform(p, [0, 1], ["-20%", "18%"]);

  // ── Phase 1: Headline ──────────────────────────────────────────────────
  const headlineOpacity = useTransform(p, [0, 0.22, 0.3], [1, 0.5, 0]);
  const headlineY = useTransform(p, [0, 0.3], [0, -120 * disable]);
  const headlineScale = useTransform(p, [0, 0.3], [1, 0.82]);

  const subOpacity = useTransform(p, [0, 0.18, 0.26], [1, 0.4, 0]);
  const subY = useTransform(p, [0, 0.3], [0, -70 * disable]);

  // ── Phase 4: Handoff vignette ──────────────────────────────────────────
  const handoffOpacity = useTransform(p, [0.85, 1], [0, 1]);

  // Implosion — background contracts into the pouch's exit point.
  const implodeScale = useTransform(p, [0.85, 1], [1, 0.05]);
  const implodeOpacity = useTransform(p, [0.82, 0.94, 1], [0, 1, 0]);

  // ── Ambient layers ─────────────────────────────────────────────────────
  const haloScale = useTransform(p, [0, 1], [1, 1.35]);
  const haloOpacity = useTransform(p, [0, 0.7, 1], [0.9, 1, 0.3]);

  // Spotlight tracks the pouch as it drifts up.
  const spotY = useTransform(p, [0, 1], ["50%", `${50 - 6}%`]);

  const travel = isMobile ? 140 : 260;

  // Haptic snap — a tiny 0.98 → 1 "bump" as the sequence locks into the
  // slider below. Mimics a mechanism clicking into place.
  const snapScale = useTransform(
    p,
    [0.96, 0.985, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.98, 1],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Grams hero"
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      <motion.div
        data-cursor="scroll"
        style={{ scale: snapScale, willChange: "transform" }}
        className="sticky top-0 h-screen w-full origin-center overflow-hidden transform-gpu"
      >
        {/* Dynamic mesh background — twin radial gradients slowly drift with scroll */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(120% 80% at var(--mx) var(--my), #1f3d2d 0%, #0f2119 48%, #050b08 100%),
              radial-gradient(60% 50% at 80% 90%, rgba(120, 90, 55, 0.35), transparent 70%)
            `,
            // @ts-expect-error CSS variables driven by motion values
            "--mx": meshX,
            "--my": meshY,
            backgroundBlendMode: "screen",
          }}
        />

        {/* Tracking spotlight — a soft radial that follows the pouch as it moves. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: `radial-gradient(38% 46% at 50% var(--sy), rgba(233,216,180,0.28), rgba(233,216,180,0.08) 45%, transparent 72%)`,
            // @ts-expect-error CSS var driven by motion value
            "--sy": spotY,
          }}
        />

        {/* Grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="grams-hero-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grams-hero-noise)" />
          </svg>
        </div>

        {/* Background marquee — huge whispered text drifting horizontally */}
        <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col justify-between overflow-hidden py-[18vh]">
          <motion.div
            style={{ x: marqueeX }}
            className="font-display whitespace-nowrap text-[18vw] font-bold uppercase leading-none tracking-tighter text-[#f6ecd8]"
            aria-hidden
          >
            <span style={{ opacity: 0.025 }}>
              Nature's Finest · Obsessively Sourced · Nature's Finest · Obsessively Sourced ·
            </span>
          </motion.div>
          <motion.div
            style={{ x: marqueeXAlt }}
            className="font-display whitespace-nowrap text-right text-[14vw] font-bold uppercase leading-none tracking-tighter text-[#e9d8b4]"
            aria-hidden
          >
            <span style={{ opacity: 0.02 }}>
              Wild-Harvested · Sun-Dried · Zero Preservatives · Wild-Harvested ·
            </span>
          </motion.div>
        </div>

        {/* Warm halo behind pouch */}
        <motion.div
          aria-hidden
          style={{ scale: haloScale, opacity: haloOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          <div
            className="h-full w-full rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(233,216,180,0.4), rgba(233,216,180,0.08) 55%, transparent 72%)",
            }}
          />
        </motion.div>

        {/* Ingredient explosion (Phase 3) */}
        <IngredientExplosion progress={p} travel={travel} />

        {/* ── Cinematic depth of field ─────────────────────────────────── */}
        {/* Foreground: massive out-of-focus blobs that outrun the scroll. */}
        <motion.div
          aria-hidden
          style={{
            x: fgLeftX,
            y: fgLeftY,
            rotate: fgLeftRot,
            filter: "blur(28px)",
            willChange: "transform",
          }}
          className="pointer-events-none absolute -left-[18vw] top-[8vh] z-[6] h-[62vmin] w-[62vmin]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(139,176,138,0.55), rgba(46,88,60,0.25) 55%, transparent 78%)",
            }}
          />
        </motion.div>

        <motion.div
          aria-hidden
          style={{
            x: fgRightX,
            y: fgRightY,
            rotate: fgRightRot,
            filter: "blur(34px)",
            willChange: "transform",
          }}
          className="pointer-events-none absolute -right-[14vw] top-[38vh] z-[6] h-[48vmin] w-[48vmin]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,179,129,0.55), rgba(120,90,55,0.22) 60%, transparent 80%)",
            }}
          />
        </motion.div>

        <motion.div
          aria-hidden
          style={{
            y: fgBottomY,
            filter: "blur(40px)",
            willChange: "transform",
          }}
          className="pointer-events-none absolute -bottom-[20vh] left-1/3 z-[6] h-[38vmin] w-[38vmin]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(233,216,180,0.4), transparent 78%)",
            }}
          />
        </motion.div>

        {/* Headline (Phase 1) */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY, scale: headlineScale }}
          className="pointer-events-none absolute inset-x-0 top-[14%] z-20 flex justify-center px-6 sm:top-[16%]"
        >
          <h1 className="font-display max-w-[14ch] text-center text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-[#f6ecd8]">
            Snack like <span className="italic text-[#e9d8b4]">nature</span>{" "}
            intended.
          </h1>
        </motion.div>

        {/* Value-prop cards (Phase 2) */}
        <ValueCards progress={p} isMobile={isMobile} />

        {/* Floating quality seals (Phase 2/3) */}
        <QualitySeals progress={p} isMobile={isMobile} seedTilt={seedTilt} />

        {/* Central pouch — inside the sticky stage, never overflows */}
        <motion.div
          data-cursor="lens"
          style={{
            scale: pouchScale,
            opacity: pouchOpacity,
            y: pouchY,
            skewX: pouchSkewX,
            rotate: pouchVelTilt,
            filter: pouchFilter,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
        >
          {/* Inner rotation wraps a scroll-driven tilt + an infinite gentle sway. */}
          <motion.div style={{ rotate: pouchScrollRotate }}>
            <motion.img
              src={brazilAsset}
              alt="Grams premium pouch"
              draggable={false}
              className="pointer-events-none block h-auto w-[min(52vmin,480px)] select-none"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { rotate: [-5, 5, -5], scale: [1, 1.02, 1] }
              }
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Subtext (Phase 1) */}
        <motion.div
          style={{ opacity: subOpacity, y: subY }}
          className="absolute inset-x-0 bottom-[14%] z-20 flex flex-col items-center gap-4 px-6 text-center sm:bottom-[12%]"
        >
          <p className="font-sans max-w-[42ch] text-sm leading-relaxed text-[#f6ecd8]/70 sm:text-base">
            Wild-harvested nuts, organic seeds, and sun-dried fruit —
            crafted for people who take pleasure seriously.
          </p>
          <div className="mt-2 flex flex-col items-center gap-2 text-[#e9d8b4]/60">
            <span className="font-sans text-[0.62rem] uppercase tracking-[0.4em]">
              Scroll
            </span>
            <span className="relative block h-8 w-px overflow-hidden bg-[#e9d8b4]/20">
              <motion.span
                className="absolute inset-x-0 top-0 block h-3 bg-[#e9d8b4]"
                animate={{ y: [-12, 32] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
          </div>
        </motion.div>

        {/* Handoff vignette (Phase 4) — fades stage into slider below */}
        <motion.div
          aria-hidden
          style={{ opacity: handoffOpacity }}
          className="pointer-events-none absolute inset-0 z-40"
        >
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-black/40 to-black" />
        </motion.div>

        {/* Implosion — contracts the vignette into the pouch's exit point. */}
        <motion.div
          aria-hidden
          style={{ scale: implodeScale, opacity: implodeOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[45] -ml-[50vmax] -mt-[50vmax] h-[100vmax] w-[100vmax] origin-center rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 70%, #000 100%)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Value cards ─────────────────────────────────────────────────────────

type CardDef = {
  label: string;
  detail: string;
  side: "left" | "right";
  offsetY: string; // e.g. "top-[22%]"
};

const CARDS: CardDef[] = [
  {
    label: "100% Organic",
    detail: "Certified single-origin harvest",
    side: "left",
    offsetY: "top-[22%]",
  },
  {
    label: "Sun-Dried & Vacuum Sealed",
    detail: "Locked at peak freshness",
    side: "right",
    offsetY: "top-[42%]",
  },
  {
    label: "Zero Preservatives",
    detail: "Nothing added. Nothing hidden.",
    side: "left",
    offsetY: "top-[62%]",
  },
];

function ValueCards({
  progress,
  isMobile,
}: {
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {CARDS.map((card, i) => (
        <ValueCard
          key={card.label}
          card={card}
          index={i}
          progress={progress}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

// ─── Quality seals ───────────────────────────────────────────────────────

type Seal = {
  label: string;
  sub: string;
  side: "left" | "right";
  offsetY: string;
  hue: string;
};

const SEALS: Seal[] = [
  {
    label: "100%",
    sub: "Organic",
    side: "right",
    offsetY: "top-[24%]",
    hue: "#c9b381",
  },
  {
    label: "Non",
    sub: "GMO",
    side: "left",
    offsetY: "top-[52%]",
    hue: "#8bb08a",
  },
  {
    label: "Est.",
    sub: "Nature",
    side: "right",
    offsetY: "top-[68%]",
    hue: "#e9d8b4",
  },
];

function QualitySeals({
  progress,
  isMobile,
  seedTilt,
}: {
  progress: MotionValue<number>;
  isMobile: boolean;
  seedTilt: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {SEALS.map((seal, i) => (
        <QualitySeal
          key={seal.label + seal.sub}
          seal={seal}
          index={i}
          progress={progress}
          isMobile={isMobile}
          seedTilt={seedTilt}
        />
      ))}
    </div>
  );
}

function QualitySeal({
  seal,
  index,
  progress,
  isMobile,
  seedTilt,
}: {
  seal: Seal;
  index: number;
  progress: MotionValue<number>;
  isMobile: boolean;
  seedTilt: MotionValue<number>;
}) {
  const start = 0.34 + index * 0.05;
  const settle = start + 0.06;
  const linger = 0.6;
  const exit = 0.72 + index * 0.02;

  const opacity = useTransform(
    progress,
    [start, settle, linger, exit],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [start, settle, exit],
    [0.4, 1, 0.6]
  );
  const y = useTransform(
    progress,
    [start, settle, linger, exit],
    [30, 0, -14, -60]
  );

  const sideClass =
    seal.side === "left"
      ? isMobile
        ? "left-3"
        : "left-[14%] md:left-[18%]"
      : isMobile
        ? "right-3"
        : "right-[14%] md:right-[18%]";

  return (
    <motion.div
      style={{ opacity, scale, y, rotate: seedTilt }}
      className={`absolute ${seal.offsetY} ${sideClass}`}
    >
      <div
        className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full border text-center backdrop-blur-md"
        style={{
          borderColor: `${seal.hue}66`,
          background: `radial-gradient(circle at 30% 30%, ${seal.hue}33, ${seal.hue}0a 70%)`,
          boxShadow: `0 10px 30px -10px ${seal.hue}55, inset 0 0 0 1px ${seal.hue}22`,
        }}
      >
        <span className="font-display text-lg font-semibold leading-none text-[#f6ecd8]">
          {seal.label}
        </span>
        <span className="mt-1 font-sans text-[9px] uppercase tracking-[0.25em] text-[#f6ecd8]/70">
          {seal.sub}
        </span>
      </div>
    </motion.div>
  );
}

function ValueCard({
  card,
  index,
  progress,
  isMobile,
}: {
  card: CardDef;
  index: number;
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  // Stagger each card slightly within the 0.30 → 0.60 window.
  const start = 0.3 + index * 0.04;
  const settle = start + 0.08;
  const linger = 0.55;
  const exit = 0.62 + index * 0.02;

  const opacity = useTransform(
    progress,
    [start, settle, linger, exit],
    [0, 1, 1, 0]
  );
  const xFrom = card.side === "left" ? -120 : 120;
  const x = useTransform(
    progress,
    [start, settle, linger, exit],
    [xFrom, 0, 0, xFrom * 0.4]
  );
  const y = useTransform(
    progress,
    [start, settle, linger, exit],
    [40, 0, -10, -80]
  );
  const scale = useTransform(
    progress,
    [start, settle, exit],
    [0.9, 1, 0.94]
  );

  const sideClass =
    card.side === "left"
      ? isMobile
        ? "left-4"
        : "left-[6%] md:left-[10%]"
      : isMobile
        ? "right-4"
        : "right-[6%] md:right-[10%]";

  return (
    <motion.div
      style={{ opacity, x, y, scale }}
      className={`absolute ${card.offsetY} ${sideClass} w-[min(80vw,300px)] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-1 inline-block h-2 w-2 rounded-full bg-[#e9d8b4] shadow-[0_0_12px_rgba(233,216,180,0.8)]"
        />
        <div>
          <p className="font-display text-lg font-semibold leading-tight text-[#f6ecd8]">
            {card.label}
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-[#f6ecd8]/70">
            {card.detail}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Ingredient explosion (Phase 3) ──────────────────────────────────────

type Particle = {
  angle: number; // degrees
  distance: number; // px at full progress
  size: number; // px
  hue: string;
  blur: number;
  rotate: number;
};

const PARTICLES: Particle[] = [
  { angle: -30, distance: 320, size: 60, hue: "#c9b381", blur: 2, rotate: 140 },
  { angle: 20, distance: 380, size: 44, hue: "#8bb08a", blur: 4, rotate: -180 },
  { angle: 90, distance: 300, size: 70, hue: "#a58558", blur: 6, rotate: 200 },
  { angle: 150, distance: 360, size: 36, hue: "#dcc79a", blur: 3, rotate: -120 },
  { angle: 200, distance: 420, size: 54, hue: "#6f8f6c", blur: 8, rotate: 260 },
  { angle: 250, distance: 300, size: 40, hue: "#b89464", blur: 2, rotate: -220 },
  { angle: 310, distance: 400, size: 66, hue: "#e9d8b4", blur: 10, rotate: 180 },
  { angle: 340, distance: 260, size: 32, hue: "#96b48f", blur: 4, rotate: -160 },
];

function IngredientExplosion({
  progress,
  travel,
}: {
  progress: MotionValue<number>;
  travel: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {PARTICLES.map((particle, i) => (
        <Particle key={i} particle={particle} progress={progress} travel={travel} />
      ))}
    </div>
  );
}

function Particle({
  particle,
  progress,
  travel,
}: {
  particle: Particle;
  progress: MotionValue<number>;
  travel: number;
}) {
  const rad = (particle.angle * Math.PI) / 180;
  const scale = travel / 260; // scale distance on mobile
  const targetX = Math.cos(rad) * particle.distance * scale;
  const targetY = Math.sin(rad) * particle.distance * scale;

  const x = useTransform(progress, [0.6, 0.95], [0, targetX]);
  const y = useTransform(progress, [0.6, 0.95], [0, targetY]);
  const opacity = useTransform(
    progress,
    [0.58, 0.7, 0.88, 0.98],
    [0, 1, 1, 0]
  );
  const rotate = useTransform(progress, [0.6, 1], [0, particle.rotate]);
  const s = useTransform(progress, [0.6, 0.8, 1], [0.4, 1, 0.85]);

  return (
    <motion.span
      style={{
        x,
        y,
        opacity,
        rotate,
        scale: s,
        width: particle.size,
        height: particle.size,
        background: `radial-gradient(circle at 30% 30%, ${particle.hue}, ${particle.hue}00 70%)`,
        filter: `blur(${particle.blur}px)`,
      }}
      className="absolute left-1/2 top-1/2 -ml-[1px] -mt-[1px] block rounded-full"
    />
  );
}
