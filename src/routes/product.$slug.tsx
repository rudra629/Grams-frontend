import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Minus, Plus, ShieldCheck, Truck, Leaf, Heart, Share2, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getProduct, products, type Product, type ProductSlide } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart, MAX_PER_ITEM } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

import { flyToCart } from "@/lib/fly-to-cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (p) return { product: p };
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("grams:extra-products");
        if (raw) {
          const list = JSON.parse(raw) as Product[];
          const found = list.find((x) => x.slug === params.slug);
          if (found) return { product: found };
        }
      } catch {}
    }
    throw notFound();
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Grams` },
          { name: "description", content: loaderData.product.tagline },
          { property: "og:title", content: `${loaderData.product.name} — Grams` },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [{ title: "Product not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="font-display text-5xl text-forest-deep">Product not found</h1>
      <Link to="/shop" className="mt-6 inline-block underline">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [weight, setWeight] = useState(product.weights[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const wishlist = useWishlist();

  const heroImgRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Build slideshow: admin-defined slides, or fall back to a single slide from the product itself.
  const slides: ProductSlide[] = useMemo(() => {
    if (product.slides && product.slides.length > 0) return product.slides;
    return [{ image: product.image, title: product.name, description: product.tagline }];
  }, [product]);

  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setSlideIdx(0);
  }, [product.slug]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  const current = slides[slideIdx] ?? slides[0];
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const scrollToDetails = () => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div>
      <div className="container-x py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-forest-deep">Home</Link> / <Link to="/shop" className="hover:text-forest-deep">Shop</Link> / <span className="text-forest-deep">{product.name}</span>
      </div>

      {/* FULL-SCREEN HERO — image left, title/description/origin right */}
      <section
        className="container-x pb-6 min-h-[calc(100vh-8rem)] grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Image */}
        <div className="relative rounded-3xl bg-gradient-to-br from-muted to-card border border-border/60 p-6 md:p-12 grid place-items-center min-h-[420px] lg:min-h-[calc(100vh-12rem)] overflow-hidden">
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            {product.bestseller && <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-forest-deep text-gold px-2.5 py-1 rounded-full">Bestseller</span>}
            {product.newArrival && <span className="text-[10px] tracking-[0.18em] uppercase font-semibold bg-terracotta text-cream px-2.5 py-1 rounded-full">New</span>}
          </div>
          <img
            key={`img-${slideIdx}`}
            ref={heroImgRef}
            src={current.image}
            alt={current.title}
            className="max-h-[70vh] lg:max-h-[80vh] drop-shadow-[0_30px_50px_rgba(10,40,24,0.35)] animate-in fade-in zoom-in-95 duration-500"
          />

          {slides.length > 1 && (
            <>
              <button
                onClick={() => setSlideIdx((i) => (i - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-13 md:h-13 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border hover:bg-forest-deep hover:text-gold hover:border-forest-deep transition-all shadow-lg hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSlideIdx((i) => (i + 1) % slides.length)}
                aria-label="Next slide"
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-13 md:h-13 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border hover:bg-forest-deep hover:text-gold hover:border-forest-deep transition-all shadow-lg hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{product.category}</p>

          <div key={`copy-${slideIdx}`} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h1 className="mt-2 font-display italic text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95]">{current.title}</h1>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">{current.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-forest-deep text-gold grid place-items-center shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Origin</p>
              <p className="font-display italic text-xl text-foreground">{product.origin}</p>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "w-10 bg-gold" : "w-4 bg-border hover:bg-muted-foreground/50"}`}
                />
              ))}
              <span className="ml-3 text-xs font-mono text-muted-foreground">{String(slideIdx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
            </div>
          )}

          <button
            onClick={scrollToDetails}
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition self-start group"
          >
            Scroll for price & details
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-gold" />
          </button>
        </div>
      </section>

      {/* DETAILS (below fold) */}
      <section ref={detailsRef} className="container-x py-14 border-t border-border/40">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight">{product.name}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>

            <div className="mt-5 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"}`} />)}
                <span className="ml-1 text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl text-foreground">₹{weight.price}</span>
              {product.compareAt && weight.value === product.weights[0].value && (
                <span className="text-lg text-muted-foreground line-through">₹{product.compareAt}</span>
              )}
              <span className="text-sm text-muted-foreground">/ {weight.label}</span>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose weight</p>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setWeight(w)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold border-2 transition ${weight.value === w.value ? "border-forest-deep bg-forest-deep text-cream" : "border-border hover:border-forest-deep"}`}
                  >
                    {w.label} · ₹{w.price}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center rounded-full border-2 border-border overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 grid place-items-center hover:bg-muted"><Minus className="w-4 h-4" /></button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(MAX_PER_ITEM, qty + 1))} disabled={qty >= MAX_PER_ITEM} className="w-11 h-11 grid place-items-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /></button>
                </div>
                {qty >= MAX_PER_ITEM && <span className="text-[10px] uppercase tracking-widest text-terracotta">Max {MAX_PER_ITEM}</span>}
              </div>
              <button
                onClick={() => {
                  const ok = add({ slug: product.slug, name: product.name, image: product.image, weight: weight.label, price: weight.price, qty });
                  if (!ok) return;
                  setAdded(true);
                  flyToCart(heroImgRef.current, product.image);
                  setTimeout(() => setAdded(false), 1800);
                }}
                className="flex-1 min-w-[180px] rounded-full bg-forest-deep text-cream py-4 text-sm font-semibold hover:bg-forest transition inline-flex items-center justify-center gap-2"
              >
                {added ? (<><Check className="w-4 h-4" /> Added to bag</>) : (<>Add to bag · ₹{weight.price * qty}</>)}
              </button>
              <button
                onClick={() => wishlist.toggle(product.slug)}
                aria-label="Add to wishlist"
                className={`w-12 h-12 grid place-items-center rounded-full border-2 transition ${wishlist.has(product.slug) ? "border-terracotta text-terracotta" : "border-border hover:border-terracotta hover:text-terracotta"}`}
              >
                <Heart className={`w-5 h-5 ${wishlist.has(product.slug) ? "fill-current" : ""}`} />
              </button>

              <button className="w-12 h-12 grid place-items-center rounded-full border-2 border-border hover:border-forest-deep transition"><Share2 className="w-5 h-5" /></button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <span key={b} className="text-xs bg-muted rounded-full px-3 py-1.5 font-medium">✦ {b}</span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><Truck className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Free shipping over ₹899</span></div>
              <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><ShieldCheck className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Nitrogen-flushed freshness</span></div>
              <div className="flex items-start gap-2 p-3 rounded-xl border border-border/60"><Leaf className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Recyclable pouch</span></div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl text-foreground">The Story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We source directly from growers in {product.origin}, cutting the layers of middlemen so you get freshness without the markup. Each batch is small-lot roasted (where applicable), nitrogen-flushed, and vacuum-sealed within hours.
            </p>

            <h2 className="mt-10 font-display text-3xl text-foreground">Nutrition</h2>
            <div className="mt-4 rounded-2xl border border-border overflow-hidden">
              {product.nutrition.map((n, i) => (
                <div key={n.label} className={`flex items-center justify-between px-5 py-4 ${i % 2 ? "bg-muted/50" : ""}`}>
                  <span className="text-sm text-muted-foreground">{n.label}</span>
                  <span className="font-semibold">{n.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">*Values are indicative per 100g serving. Actual values may vary slightly.</p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl text-foreground">You might also love</h2>
          <Link to="/shop" className="text-sm font-semibold hover:text-terracotta">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}
