import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
};

/**
 * Subtle magnetic hover: the button drifts toward the cursor while it hovers,
 * powered by a spring so the return is physics-based, not linear.
 */
export function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      data-cursor="magnetic"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      <motion.span
        style={{ x: useSpring(x, { stiffness: 200, damping: 20 }), y: useSpring(y, { stiffness: 200, damping: 20 }) }}
        className="pointer-events-none inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
