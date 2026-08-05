import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import brazilAsset from "@/assets/products/Hazelnuts F.png";
import chiaAsset from "@/assets/products/Pumpkin Seeds F.png";
import kiwiAsset from "@/assets/products/Dried Kiwi F.png";
import prunesAsset from "@/assets/products/Dreid Mango F.png";
import raisinsAsset from "@/assets/products/Dried Cranberry F.png";
import { ParticleBurst } from "./ParticleBurst";
import { IngredientHalo } from "./IngredientHalo";
import { getLenis } from "@/lib/smooth-scroll";

type Slide = {
  image: string;
  ingredient: "brazil" | "chia" | "kiwi" | "prune" | "raisin";
  title: string;
  eyebrow: string;
  description: string;
  bg: string;
  accent: string;
  ink: string;
  soft: string;
};

const SLIDES: Slide[] = [
  {
    image: brazilAsset,
    ingredient: "brazil",
    eyebrow: "Hand-picked · Turkish groves",
    title: "Roasted Hazelnuts",
    description:
      "Deeply roasted, buttery and vitamin-E rich — the crunch that starts every Grams ritual.",
    bg: "#2a1b3d",
    accent: "#e9d8b4",
    ink: "#f6ecd8",
    soft: "#8b6fb0",
  },
  {
    image: chiaAsset,
    ingredient: "chia",
    eyebrow: "Cold-pressed superfood",
    title: "Pumpkin Seeds",
    description:
      "Magnesium, zinc and clean plant protein. Small green engines for a long working day.",
    bg: "#3d2817",
    accent: "#f0d9a8",
    ink: "#f7ead0",
    soft: "#c48a5a",
  },
  {
    image: kiwiAsset,
    ingredient: "kiwi",
    eyebrow: "Sun-dried · No preservatives",
    title: "Dried Kiwi Slices",
    description:
      "Tangy, sweet, and perfectly chewy. A vibrant burst of Vitamin C with zero artificial preservatives.",
    bg: "#1e3d2f",
    accent: "#d4e8b8",
    ink: "#eaf5d8",
    soft: "#6ea86a",
  },
  {
    image: prunesAsset,
    ingredient: "prune",
    eyebrow: "Orchard-sourced · Ratnagiri",
    title: "Dried Mango Strips",
    description:
      "Slow sun-dried at peak ripeness. Naturally sweet, undeniably rich, nothing added.",
    bg: "#4a1d3e",
    accent: "#f2c8dc",
    ink: "#f8dfea",
    soft: "#b56592",
  },
  {
    image: raisinsAsset,
    ingredient: "raisin",
    eyebrow: "Antioxidant-rich · Small batch",
    title: "Dried Cranberries",
    description:
      "Tart, jewel-bright and packed with antioxidants — the finish to your daily handful.",
    bg: "#1a1b3d",
    accent: "#d8cff0",
    ink: "#ece7f8",
    soft: "#6a5fa8",
  },
];

const N = SLIDES.length;
const EASE = [0.16, 1, 0.3, 1] as const;

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

export function GramsSlider() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const slide = SLIDES[index];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  // Scroll-driven sequence: a tall track with a sticky stage. Every visual is
  // a continuous function of scroll progress, so the sequence scrubs both ways
  // instead of jump-cutting between slides.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // Position along the slide sequence, 0 → N.
  const t = useTransform(sp, (v) => v * N);

  const lastIndex = useRef(0);
  useEffect(() => {
    const apply = (v: number) => {
      const next = Math.min(N - 1, Math.max(0, Math.floor(v)));
      if (next === lastIndex.current) return;
      lastIndex.current = next;
      setIndex(next);
    };
    apply(t.get());
    return t.on("change", apply);
  }, [t]);

  const goTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(1, el.offsetHeight - window.innerHeight);
    const target = top + (travel * (i + 0.5)) / N;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Keyboard navigation scrolls the track (still fully native).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(Math.min(N - 1, index + 1));
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // Mouse parallax (rAF-throttled, desktop only)
  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      mx.set(nx);
      my.set(ny);
    };
    const onMove = (e: MouseEvent) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile, mx, my]);

  const floaters = useMemo(
    () => [
      { size: 140, x: "10%", y: "18%", depth: 40, blur: 8, rot: -12 },
      { size: 90, x: "42%", y: "72%", depth: 60, blur: 4, rot: 22 },
      { size: 180, x: "55%", y: "12%", depth: 25, blur: 14, rot: 8 },
      { size: 70, x: "8%", y: "78%", depth: 80, blur: 2, rot: -30 },
    ],
    [],
  );

  const imgParallaxX = useTransform(smx, (v) => v * -45);
  const imgParallaxY = useTransform(smy, (v) => v * -25);
  const textParallaxX = useTransform(smx, (v) => v * 18);
  const textParallaxY = useTransform(smy, (v) => v * 12);

  // Mobile gets a longer track so each product needs a deliberate swipe.
  const trackHeight = isMobile ? `${N * 135}svh` : `${N * 100}svh`;

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: trackHeight }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#12101a]">
        {/* Morphing backgrounds — one layer per slide, crossfaded by progress */}
        {SLIDES.map((s, i) => (
          <BgLayer key={`bg-${i}`} s={s} i={i} t={t} />
        ))}

        {/* Grain / vignette */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Subtle noise grain (desktop only — expensive on mobile GPUs) */}
        {!isMobile && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          >
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="grams-slider-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grams-slider-noise)" />
            </svg>
          </div>
        )}

        {/* Ingredient halo — mid/background layers (behind product) */}
        {!isMobile && (
          <div className="pointer-events-none absolute inset-0 z-[2]">
            <IngredientHalo
              ingredient={slide.ingredient}
              mx={smx}
              my={smy}
              variant="back"
              isMobile={false}
            />
          </div>
        )}

        {/* Dynamic spotlights — tinted per slide, crossfaded by progress */}
        {SLIDES.map((s, i) => (
          <SpotLayer key={`spot-${i}`} s={s} i={i} t={t} />
        ))}

        {!isMobile && (
          <ParticleBurst triggerKey={index} colors={[slide.accent, slide.soft, slide.ink]} />
        )}

        {/* Ingredient halo — extreme foreground (over product edges) */}
        {!isMobile && (
          <div className="pointer-events-none absolute inset-0 z-[45]">
            <IngredientHalo
              ingredient={slide.ingredient}
              mx={smx}
              my={smy}
              variant="front"
              isMobile={false}
            />
          </div>
        )}

        {/* Top nav */}
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-14 md:py-8">
          <div className="flex items-center gap-2" style={{ color: slide.ink }}>
            <span className="font-display text-2xl font-semibold tracking-tight">Grams</span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] opacity-70 md:inline">
              Beyond snack, it's a lifestyle
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto grid h-full max-w-[1400px] grid-cols-1 grid-rows-[1fr_auto] items-center gap-2 px-5 pb-24 pt-20 md:grid-cols-2 md:grid-rows-1 md:gap-4 md:px-14 md:pb-0 md:pt-0">
          {/* Product */}
          <div className="relative flex min-h-0 items-center justify-center md:h-full">
            {!isMobile &&
              floaters.map((f, i) => (
                <Floater
                  key={`f-${i}`}
                  f={f}
                  i={i}
                  mx={smx}
                  my={smy}
                  accent={slide.accent}
                  soft={slide.soft}
                />
              ))}

            {/* Giant word backdrop (desktop only) */}
            {!isMobile &&
              SLIDES.map((s, i) => <WordLayer key={`word-${i}`} s={s} i={i} t={t} />)}

            {/* Product images — stacked, scrubbed */}
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              {SLIDES.map((s, i) => (
                <ImageLayer
                  key={`img-${i}`}
                  s={s}
                  i={i}
                  t={t}
                  px={imgParallaxX}
                  py={imgParallaxY}
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <motion.div
            className="relative flex flex-col justify-center"
            style={{ x: textParallaxX, y: textParallaxY }}
          >
            <div className="relative h-[34svh] w-full max-w-xl md:h-[44vh]">
              {SLIDES.map((s, i) => (
                <TextLayer key={`text-${i}`} s={s} i={i} t={t} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Progress ticks */}
        <div
          className="absolute bottom-6 right-5 z-30 flex items-center gap-1 md:bottom-10 md:right-14 md:gap-2"
          style={{ color: slide.ink }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="group relative h-8 w-8"
            >
              <span
                className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  width: i === index ? 24 : 12,
                  background: slide.ink,
                  opacity: i === index ? 1 : 0.35,
                }}
              />
            </button>
          ))}
        </div>

        {/* Hint */}
        <div
          className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-60 md:block"
          style={{ color: slide.ink }}
        >
          Scroll to explore
        </div>
      </div>
    </section>
  );
}

export default GramsSlider;

/** Opacity window for slide `i`: fully on across its own step, crossfading
 *  symmetrically into its neighbours. */
function useSlideOpacity(t: MotionValue<number>, i: number) {
  return useTransform(t, [i - 0.55, i + 0.12, i + 0.88, i + 1.55], [0, 1, 1, 0]);
}

/** Tight window for legible content (headlines, giant word): the outgoing slide
 *  is fully gone before the incoming one starts, so text never overlaps. */
function useCrispOpacity(t: MotionValue<number>, i: number) {
  return useTransform(
    t,
    [i - 0.22, i - 0.02, i + 0.9, i + 1.1],
    [0, 1, 1, 0],
  );
}

function BgLayer({ s, i, t }: { s: Slide; i: number; t: MotionValue<number> }) {
  const opacity = useSlideOpacity(t, i);
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 transform-gpu"
      style={{
        opacity,
        background: `radial-gradient(120% 80% at 20% 30%, ${s.soft}55 0%, ${s.bg} 55%, ${s.bg} 100%)`,
      }}
    />
  );
}

function SpotLayer({ s, i, t }: { s: Slide; i: number; t: MotionValue<number> }) {
  const opacity = useSlideOpacity(t, i);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] transform-gpu mix-blend-screen"
      style={{
        opacity,
        background: `radial-gradient(38% 46% at 30% 55%, ${s.soft}55, ${s.soft}11 45%, transparent 72%)`,
      }}
    />
  );
}

function WordLayer({ s, i, t }: { s: Slide; i: number; t: MotionValue<number> }) {
  const base = useCrispOpacity(t, i);
  const opacity = useTransform(base, (v) => v * 0.08);
  const x = useTransform(t, [i - 0.6, i + 1.6], [80, -80]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex transform-gpu items-center justify-center overflow-hidden"
      style={{ opacity, x }}
    >
      <span
        className="font-display whitespace-nowrap text-[28vw] font-bold leading-none tracking-tighter md:text-[16vw]"
        style={{ color: s.ink }}
      >
        {s.title.split(" ").slice(-1)[0]}
      </span>
    </motion.div>
  );
}

function ImageLayer({
  s,
  i,
  t,
  px,
  py,
}: {
  s: Slide;
  i: number;
  t: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const opacity = useSlideOpacity(t, i);
  const scale = useTransform(t, [i - 0.6, i + 0.5, i + 1.6], [0.82, 1, 0.82]);
  const rotate = useTransform(t, [i - 0.6, i + 0.5, i + 1.6], [10, 0, -10]);
  const shiftY = useTransform(t, [i - 0.6, i + 0.5, i + 1.6], [90, 0, -90]);
  const y = useTransform([py, shiftY] as const, ([a, b]: number[]) => a + b);
  return (
    <motion.div
      className="absolute inset-0 flex transform-gpu items-center justify-center"
      style={{ opacity, scale, rotate, x: px, y, willChange: "transform, opacity" }}
      data-cursor="lens"
    >
      <img
        src={s.image}
        alt={s.title}
        loading={i === 0 ? "eager" : "lazy"}
        className="h-[40svh] w-auto max-w-none select-none object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)] md:h-[74vh]"
        draggable={false}
      />
    </motion.div>
  );
}

function TextLayer({ s, i, t }: { s: Slide; i: number; t: MotionValue<number> }) {
  const opacity = useCrispOpacity(t, i);
  const y = useTransform(t, [i - 0.3, i + 0.5, i + 1.3], [40, 0, -40]);
  return (
    <motion.div
      className="absolute inset-0 flex transform-gpu flex-col justify-center"
      style={{ opacity, y, color: s.ink, willChange: "transform, opacity" }}
    >
      <p
        className="mb-3 text-[10px] uppercase tracking-[0.3em] md:mb-6 md:text-[11px] md:tracking-[0.35em]"
        style={{ color: s.accent }}
      >
        — {s.eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
        {s.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed opacity-85 md:mt-6 md:text-lg">
        {s.description}
      </p>
    </motion.div>
  );
}

type FloaterProps = {
  f: { size: number; x: string; y: string; depth: number; blur: number; rot: number };
  i: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  accent: string;
  soft: string;
};

function Floater({ f, i, mx, my, accent, soft }: FloaterProps) {
  const tx = useTransform(mx, (v) => v * f.depth);
  const ty = useTransform(my, (v) => v * f.depth);
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: f.x,
        top: f.y,
        width: f.size,
        height: f.size,
        x: tx,
        y: ty,
        filter: `blur(${f.blur}px)`,
        background: `radial-gradient(circle at 30% 30%, ${accent}cc, ${soft}44 60%, transparent 75%)`,
      }}
      initial={{ opacity: 0, scale: 0.6, rotate: f.rot - 20 }}
      animate={{ opacity: 0.9, scale: 1, rotate: f.rot }}
      transition={{ duration: 1.4, ease: EASE, delay: 0.1 + i * 0.08 }}
    />
  );
}
