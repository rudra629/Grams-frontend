import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

import brazil from "@/assets/products/Hazelnuts F.png";
import chia from "@/assets/products/Sunflower F.png";
import kiwi from "@/assets/products/Dried Pineapple F.png";
import prune from "@/assets/products/Pecan F.png";
import raisin from "@/assets/products/Macademia F.png";

const EASE_EXPO = [0.87, 0, 0.13, 1] as const;
const EASE_BACK_IN = [0.7, 0, 0.84, 0] as const;

type IngredientKey = "brazil" | "chia" | "kiwi" | "prune" | "raisin";

const IMAGES: Record<IngredientKey, string> = {
  brazil: brazil,
  chia: chia,
  kiwi: kiwi,
  prune: prune,
  raisin: raisin,
};

/**
 * Layer definitions — normalized 0-1 positions relative to the viewport.
 * `depth` drives parallax intensity: near 1 = extreme foreground (fast,
 * heavily blurred), near 0 = background (slow, sharp).
 */
type Layer = {
  x: string;
  y: string;
  size: number; // vmin
  blur: number;
  depth: number;
  rot: number;
  z: number;
};

const LAYERS: Layer[] = [
  // Extreme foreground — hug the edges, huge, deep blur
  { x: "-18%", y: "12%", size: 55, blur: 22, depth: 1.4, rot: -14, z: 40 },
  { x: "82%", y: "58%", size: 60, blur: 26, depth: 1.5, rot: 18, z: 40 },
  // Mid — smaller, some blur
  { x: "68%", y: "-8%", size: 26, blur: 4, depth: 0.7, rot: 24, z: 8 },
  { x: "5%", y: "70%", size: 22, blur: 3, depth: 0.6, rot: -20, z: 8 },
  // Background — sharp, tiny, slow drift
  { x: "40%", y: "8%", size: 12, blur: 1, depth: 0.25, rot: 40, z: 2 },
  { x: "88%", y: "22%", size: 10, blur: 1, depth: 0.3, rot: -30, z: 2 },
  { x: "12%", y: "42%", size: 14, blur: 2, depth: 0.35, rot: 12, z: 2 },
];

type Props = {
  ingredient: IngredientKey;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  variant?: "front" | "back";
  isMobile?: boolean;
};

/**
 * IngredientHalo — per-product ambient environment. Renders 7 layered
 * ingredient images at various scales/blurs that respond to cursor parallax
 * and scroll velocity. On ingredient change, the outgoing set falls away
 * (gravity + ease-in-back) while the incoming set floats up on a spring.
 */
export function IngredientHalo({
  ingredient,
  mx,
  my,
  variant = "back",
  isMobile = false,
}: Props) {
  const src = IMAGES[ingredient];
  const filtered = LAYERS.filter((l) =>
    variant === "front" ? l.depth > 1 : l.depth <= 1
  );
  // Halve the layer count on mobile to save GPU / battery.
  const layers = isMobile
    ? filtered.filter((_, i) => i % 2 === 0)
    : filtered;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={ingredient}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          {layers.map((layer, i) => (
            <IngredientPiece
              key={i}
              src={src}
              layer={layer}
              index={i}
              mx={mx}
              my={my}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IngredientPiece({
  src,
  layer,
  index,
  mx,
  my,
}: {
  src: string;
  layer: Layer;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Parallax — deeper layers translate more with cursor movement.
  const px = useTransform(mx, (v) => v * layer.depth * 80);
  const py = useTransform(my, (v) => v * layer.depth * 60);

  // Scroll-velocity-driven tilt: as user scrolls fast the pieces skew in
  // the direction of motion, then spring back to rest.
  const velY = useVelocity(my);
  const smoothVel = useSpring(velY, { stiffness: 120, damping: 26 });
  const skewX = useTransform(smoothVel, [-3, 3], [10, -10]);

  const entrance = {
    initial: {
      opacity: 0,
      y: 90 + index * 8,
      scale: 0.6,
      rotate: layer.rot - 40,
      filter: `blur(${layer.blur + 20}px)`,
    },
    animate: {
      opacity: layer.depth > 1 ? 0.55 : 0.9,
      y: 0,
      scale: 1,
      rotate: layer.rot,
      filter: `blur(${layer.blur}px)`,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 18,
        mass: 1.1,
        delay: 0.05 + index * 0.06,
        opacity: { duration: 0.9, ease: EASE_EXPO, delay: 0.05 + index * 0.06 },
        filter: { duration: 1, ease: EASE_EXPO, delay: 0.05 + index * 0.06 },
      },
    },
    exit: {
      opacity: 0,
      y: 260,
      scale: 0.85,
      rotate: layer.rot + 60,
      filter: `blur(${layer.blur + 10}px)`,
      transition: {
        duration: 0.7,
        ease: EASE_BACK_IN,
        delay: index * 0.03,
      },
    },
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: layer.x,
        top: layer.y,
        width: `${layer.size}vmin`,
        height: `${layer.size}vmin`,
        x: px,
        y: py,
        zIndex: layer.z,
        willChange: "transform, filter, opacity",
      }}
      initial={entrance.initial}
      animate={entrance.animate}
      exit={entrance.exit}
    >
      <motion.div
        className="h-full w-full"
        style={{ skewX }}
        animate={{ rotate: [layer.rot, layer.rot + 6, layer.rot] }}
        transition={{
          duration: 14 + index * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          loading="lazy"
          className="h-full w-full select-none object-contain"
          style={{
            filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.45))`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Simple pixel-motion values pair for callers that don't already have them. */
export function useCursorMotion() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const ref = useRef({ mx, my });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const on = (e: MouseEvent) => {
      ref.current.mx.set(e.clientX / window.innerWidth - 0.5);
      ref.current.my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return { smx, smy, ready };
}
