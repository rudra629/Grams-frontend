import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useSite } from "@/lib/site-store";
import { FruitLoader } from "@/components/site/FruitLoader";

type Search = { cat?: string; q?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Grams" },
      { name: "description", content: "Browse the full Grams collection of premium nuts, seeds and dried fruits." },
    ],
  }),
  component: Shop,
});

const cats = ["All", "Nuts", "Seeds", "Dried Fruits"] as const;
const sorts = ["Featured", "Price: Low → High", "Price: High → Low", "Rating"] as const;

function Shop() {
  const search = Route.useSearch();
  const { allProducts, t } = useSite();
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string>(search.cat ?? "All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    let list: Product[] = allProducts.slice();
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.tagline.toLowerCase().includes(q.toLowerCase()));
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "Price: Low → High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") list.sort((a, b) => b.price - a.price);
    if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, cat, sort, maxPrice, allProducts]);


  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-forest-deep text-cream pt-16 md:pt-24 pb-28 md:pb-36">
        {/* decorative background */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-gold/25 blur-[120px]" />
        <div className="absolute -bottom-40 right-[-80px] w-[520px] h-[520px] rounded-full bg-terracotta/20 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[280px] h-[280px] rounded-full bg-forest/40 blur-[100px]" />
        <svg className="absolute top-8 right-8 w-40 h-40 text-gold/25 hidden md:block" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/40" />

        <div className="relative container-x">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("shop.eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">{t("shop.title")}</h1>
          <p className="mt-4 max-w-xl text-cream/70">{t("shop.subtitle")}</p>


          <div className="mt-10 flex items-center gap-3 bg-cream/10 backdrop-blur border border-cream/20 rounded-full px-5 py-1 max-w-2xl">
            <Search className="w-5 h-5 text-gold" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search walnuts, mango, seeds…"
              className="flex-1 bg-transparent outline-none py-4 text-cream placeholder:text-cream/50"
            />
            {q && (
              <button onClick={() => setQ("")} className="p-1.5 rounded-full hover:bg-cream/10">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className={`container-x py-8 sticky top-16 md:top-20 z-20 border-b border-border/50 -mt-16 md:-mt-20 transition-colors duration-300 ${scrolled ? "bg-cream/85 backdrop-blur" : "bg-cream"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`pill rounded-full px-4 py-2 text-sm font-medium ${cat === c ? "bg-forest-deep text-cream" : "bg-muted hover:bg-border"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Max ₹{maxPrice}</span>
              <input type="range" min={199} max={1500} step={50} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-forest-deep" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-full bg-muted px-4 py-2 text-sm font-medium border border-border">
              {sorts.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-x py-12">
        <p className="text-sm text-muted-foreground mb-6">{loading ? "\u00A0" : `${filtered.length} products`}</p>
        {loading ? (
          <FruitLoader label="Picking the freshest bites…" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-forest-deep">Nothing matches that.</p>
            <p className="text-muted-foreground mt-2">Try clearing filters or searching a friendlier word.</p>
            <button onClick={() => { setQ(""); setCat("All"); setMaxPrice(1500); }} className="mt-6 rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold">Reset</button>
          </div>
        ) : (
          <div key={`${cat}|${sort}|${q}|${maxPrice}`} className="grid-stagger grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div key={p.slug} style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container-x pb-20">
        <div className="rounded-3xl bg-forest-deep text-cream p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl">Can't decide?</h3>
            <p className="mt-2 text-cream/70">Grab our curated Signature Trio — one from each category, hand-picked by us.</p>
          </div>
          <Link to="/product/$slug" params={{ slug: allProducts[0]?.slug ?? "walnut-whole-california" }} className="rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition">
            Explore Signature
          </Link>
        </div>
      </section>
    </div>
  );
}
