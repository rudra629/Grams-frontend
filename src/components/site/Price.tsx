import { cn } from "@/lib/utils";

type Props = {
  price: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  hideDiscountPct?: boolean;
};

const sizeMap = {
  sm: { price: "text-sm", strike: "text-[11px]", pct: "text-[9px] px-1.5 py-0.5" },
  md: { price: "text-base", strike: "text-xs", pct: "text-[10px] px-2 py-0.5" },
  lg: { price: "text-xl", strike: "text-sm", pct: "text-[11px] px-2 py-0.5" },
  xl: { price: "text-3xl md:text-4xl", strike: "text-base", pct: "text-xs px-2.5 py-1" },
};

export function Price({ price, compareAt, size = "md", className, hideDiscountPct }: Props) {
  const pct = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const s = sizeMap[size];
  return (
    <div className={cn("inline-flex items-baseline gap-2 font-mono tracking-tight", className)}>
      <span className={cn("font-bold text-foreground", s.price)}>₹{price.toLocaleString("en-IN")}</span>
      {compareAt && compareAt > price && (
        <span className={cn("text-muted-foreground line-through", s.strike)}>₹{compareAt.toLocaleString("en-IN")}</span>
      )}
      {pct > 0 && !hideDiscountPct && (
        <span className={cn("font-bold uppercase tracking-wider rounded-full bg-gold text-forest-deep", s.pct)}>−{pct}%</span>
      )}
    </div>
  );
}
