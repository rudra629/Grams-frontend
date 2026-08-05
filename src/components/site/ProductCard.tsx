import { Link } from "@tanstack/react-router";
import { Star, Heart } from "lucide-react";
import { useRef, useCallback } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { flyToCart } from "@/lib/fly-to-cart";
import { Price } from "@/components/site/Price";


export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const wished = wishlist.has(product.slug);
  const imgRef = useRef<HTMLImageElement>(null);

  const zoomRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const img = zoomRef.current;
    if (!img) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(1.75)";
    });
  }, []);

  const handleEnter = useCallback(() => {
    const img = zoomRef.current;
    if (img) img.style.transform = "scale(1.75)";
  }, []);

  const handleLeave = useCallback(() => {
    const img = zoomRef.current;
    if (!img) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
  }, []);

  return (
    <div
      className="group relative flex flex-col rounded-3xl border border-white/10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:border-gold/40 hover:shadow-[0_22px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition duration-500"
      style={{ background: "linear-gradient(160deg, #17151a 0%, #101013 100%)" }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden border-b border-white/10"
        style={{ background: "radial-gradient(circle at 50% 35%, rgba(212,162,76,0.12) 0%, transparent 60%)" }}
      >

        <div
          className="absolute inset-0 flex items-center justify-center p-6 cursor-zoom-in overflow-hidden"
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <img
            ref={(el) => { imgRef.current = el; zoomRef.current = el; }}
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              transformOrigin: "center center",
              transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), transform-origin 0.12s ease-out",
              willChange: "transform, transform-origin",
            }}
            className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_22px_34px_rgba(10,40,24,0.22)] pointer-events-none select-none"
          />
        </div>


        <div className="absolute top-3 left-3 flex flex-col gap-1.5">

          {product.bestseller && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-forest-deep text-gold px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {product.newArrival && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-terracotta text-cream px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-gold text-forest-deep px-2.5 py-1 rounded-full">
              −{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); wishlist.toggle(product.slug); }}
          className={`absolute top-3 right-3 z-20 grid place-items-center w-9 h-9 rounded-full border transition duration-300 hover:scale-110 ${wished ? "bg-terracotta/90 border-terracotta text-cream" : "bg-black/40 border-white/15 text-cream/70 hover:text-terracotta hover:border-terracotta/60"}`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </Link>


      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.2em] uppercase text-cream/50 truncate">{product.category}</p>
          <div className="flex items-center gap-1 text-xs shrink-0 text-cream/80">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-semibold">{product.rating}</span>
          </div>
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mt-1 block font-display italic text-lg sm:text-xl text-cream leading-tight hover:text-gold transition line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs sm:text-sm text-cream/55 mt-1 line-clamp-1">{product.tagline}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <Price price={product.price} compareAt={product.compareAt} size="lg" hideDiscountPct className="min-w-0" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const ok = add({
                slug: product.slug,
                name: product.name,
                image: product.image,
                weight: product.weights[0].label,
                price: product.weights[0].price,
                qty: 1,
              });
              if (ok) flyToCart(imgRef.current, product.image);

            }}
            className="add-btn shrink-0 relative overflow-hidden rounded-full border-2 border-gold text-gold text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 animate-bouncy hover:animate-none"
          >
            <span className="add-btn-fill" />
            <span className="add-btn-label relative z-10">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

