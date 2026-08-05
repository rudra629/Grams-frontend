import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  triggerKey: number;
  colors: string[]; // pull colors from active slide theme
  count?: number;
};

type P = {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  blur: number;
  rot: number;
  shape: "circle" | "pill";
  delay: number;
};

/**
 * ParticleBurst — explodes 8–12 blurred CSS shapes outward from center on
 * every triggerKey change. Colors are pulled from the active slide theme so
 * each product transition feels bespoke.
 */
export function ParticleBurst({ triggerKey, colors, count = 12 }: Props) {
  // Avoid SSR hydration mismatch: only render after mount (Math.random differs).
  const [mounted, setMounted] = useState(false);
  const [burstId, setBurstId] = useState(triggerKey);
  useEffect(() => setMounted(true), []);
  useEffect(() => setBurstId(triggerKey), [triggerKey]);

  const particles = useMemo<P[]>(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (360 / count) * i + (Math.random() - 0.5) * 20;
      return {
        id: i,
        angle,
        distance: 220 + Math.random() * 260,
        size: 12 + Math.random() * 26,
        color: colors[i % colors.length],
        blur: 2 + Math.random() * 8,
        rot: (Math.random() - 0.5) * 320,
        shape: Math.random() > 0.55 ? "pill" : "circle",
        delay: Math.random() * 0.08,
      };
    });
  }, [burstId, colors, count]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <AnimatePresence mode="sync">
        <div
          key={burstId}
          className="absolute left-1/2 top-1/2 h-0 w-0"
        >
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            const w = p.shape === "pill" ? p.size * 2.4 : p.size;
            const h = p.size;
            return (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.85],
                  rotate: p.rot,
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: p.delay,
                  opacity: { duration: 0.85, times: [0, 0.35, 1] },
                }}
                style={{
                  width: w,
                  height: h,
                  marginLeft: -w / 2,
                  marginTop: -h / 2,
                  borderRadius: 9999,
                  background: `radial-gradient(circle at 30% 30%, ${p.color}, ${p.color}00 75%)`,
                  filter: `blur(${p.blur}px)`,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
