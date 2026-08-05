import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Leaf, ShieldCheck, Sparkles, Star, Quote, Award, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { useSite, type ValuePropIcon } from "@/lib/site-store";
import heroBg from "@/assets/hero-bg.jpg";
import story1 from "@/assets/story-1.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import texture1 from "@/assets/texture-1.jpg";
import fruitCollage from "@/assets/hero-fruit-collage.png";
import { IntroSequence, HOME_START_ID, hasSeenIntro, scrollToHomeStart } from "@/components/site/IntroSequence";


const VALUE_PROP_ICON_MAP: Record<ValuePropIcon, typeof Leaf> = {
  leaf: Leaf,
  shield: ShieldCheck,
  truck: Truck,
  sparkles: Sparkles,
  award: Award,
  heart: Heart,
};

const heroRotation = [0, 3, 6, 5, 1, 2, 4, 7]
  .filter((i) => i < products.length)
  .map((i) => products[i]);

function HeroSlices({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "md"
    ? "w-[420px] md:w-[520px] -bottom-16 md:-bottom-20 -left-12 md:-left-28"
    : "w-[260px] -bottom-10 -left-6";
  return (
    <div className={`pointer-events-none absolute z-0 animate-collage-wave ${cls}`}>
      {/* soft amber halo, like the crunch-mode button glow */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-[45%] blur-3xl opacity-60 animate-collage-glow"
        style={{ background: "radial-gradient(circle at 35% 40%, rgba(255,178,107,0.35), rgba(255,90,60,0.16) 45%, transparent 72%)" }}
      />
      <img
        src={fruitCollage}
        alt="Assorted dry fruits and nuts"
        className="relative w-full opacity-[0.85] saturate-[1.05] contrast-[1.02] brightness-110 drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
        style={{ maskImage: "radial-gradient(ellipse at 45% 55%, #000 55%, rgba(0,0,0,0.7) 78%, transparent 96%)", WebkitMaskImage: "radial-gradient(ellipse at 45% 55%, #000 55%, rgba(0,0,0,0.7) 78%, transparent 96%)" }}
      />
    </div>
  );
}

function SideRails() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <>
      <div aria-hidden className="site-chrome hidden lg:flex fixed left-4 top-0 h-screen z-30 pointer-events-none items-center transition-all duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-cream/50 [writing-mode:vertical-rl] rotate-180">Est · 2025 · India</span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>
      </div>
      <div aria-hidden className="site-chrome hidden lg:flex fixed right-4 top-0 h-screen z-30 pointer-events-none items-center transition-all duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-cream/50 [writing-mode:vertical-rl]">Farm · Roast · Pack · Ship</span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
        </div>
      </div>
    </>,
    document.body,
  );
}

function RotatingHeroProduct({ className }: { className?: string }) {

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroRotation.length), 1500);
    return () => clearInterval(t);
  }, []);
  const p = heroRotation[idx];
  return (
    <img
      key={p.slug}
      src={p.image}
      alt={p.name}
      className={`relative z-10 animate-hero-swap drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)] ${className ?? ""}`}
    />
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grams — Beyond snack, it's a lifestyle" },
      { name: "description", content: "Farm-fresh dry fruits, nuts and seeds. Small-batch, freshly packed and delivered to your doorstep across India." },
    ],
  }),
  component: Home,
});

function Home() {
  const { allProducts, bannerWords, stats, monthPicks, valueProps, t } = useSite();
  const shown = allProducts;
  const bestsellers = shown.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = shown.filter((p) => p.newArrival);

  // On repeat visits within the session, land straight on the home hero —
  // the intro stays above so scrolling up replays it.
  useEffect(() => {
    if (!hasSeenIntro()) return;
    let stop = false;
    const started = performance.now();
    // Retry until layout (and Lenis) settle: the anchor measures 0 on mount.
    const jump = () => {
      if (stop) return;
      scrollToHomeStart(true);
      if (performance.now() - started < 900) requestAnimationFrame(jump);
    };
    requestAnimationFrame(jump);
    return () => {
      stop = true;
    };
  }, []);


  return (
    <div className="relative">
      <IntroSequence />
      <div id={HOME_START_ID} className="relative" />

      {/* Decorative fixed side rails (portalled so page transforms don't trap them) */}
      <SideRails />



      {/* HERO */}
      <section className="relative overflow-visible md:overflow-hidden text-cream flex flex-col justify-start items-start md:justify-center md:items-center" style={{ background: "linear-gradient(180deg, #0a0a0c 0%, #131114 55%, #0c0b0e 100%)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, filter: "brightness(0.85) contrast(1.05) saturate(0.95)", opacity: 0.75 }}
        />
        {/* Warm vignette + directional darkening for text legibility */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, transparent 0%, rgba(8,7,10,0.35) 45%, rgba(8,7,10,0.85) 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />

        {/* Warm amber glow orbs */}
        <div className="absolute -top-24 -left-16 w-[380px] h-[380px] rounded-full bg-gold/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[420px] h-[420px] rounded-full bg-terracotta/12 blur-[140px] pointer-events-none" />

        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />


        <div className="container-x relative px-4 pt-6 pb-4 md:px-12 md:pt-10 md:pb-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-start md:items-center">
          <div className="relative z-10 w-full">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[1.05] md:leading-[1.02] font-normal tracking-tight w-full break-words [text-wrap:balance]">
              <span className="italic text-cream/95 block">Crunch</span>
              <span className="italic block">
                {"chill".split("").map((ch, i) => (
                  <span key={i} className="inline-block animate-letter-wave" style={{ animationDelay: `${i * 0.14}s` }}>
                    <span className="animate-hue-cycle inline-block" style={{ animationDelay: `${i * -0.55}s` }}>{ch}</span>
                  </span>
                ))}
              </span>
              <span className="italic text-cream/95 block">repeat.</span>

            </h1>
            <p className="mt-5 md:mt-6 max-w-lg text-base md:text-lg text-cream/80 leading-relaxed">
              Small-batch dry fruits, obsessively-sourced nuts, and seeds that actually taste
              like the farm they came from. No fillers. No BS.
            </p>

            <div className="mt-8 md:mt-9 flex flex-wrap items-center gap-3 md:gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-6 md:px-7 py-3.5 md:py-4 text-sm font-semibold hover:bg-cream transition"
              >
                Shop the collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 md:px-7 py-3.5 md:py-4 text-sm font-medium hover:bg-cream/10 transition"
              >
                Our sourcing story
              </Link>
            </div>

            <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-lg">
              {stats.map((s) => <Stat key={s.l} n={s.n} l={s.l} />)}
            </div>

          </div>

          {/* Hero rotating product — desktop */}
          <div className="relative h-[560px] md:h-[640px] hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[560px] h-[620px] flex items-center justify-center">
                <RotatingHeroProduct className="max-w-full max-h-full w-auto h-auto object-contain" />
                <HeroSlices size="md" />
              </div>
            </div>
          </div>

        </div>

        {/* Hero mobile — single rotating product */}
        <div className="lg:hidden container-x relative px-4 pb-6 mt-2 w-full">
          <div className="relative mx-auto w-full max-w-sm h-[380px] sm:h-[440px] flex items-center justify-center">
            <RotatingHeroProduct className="max-w-[95%] max-h-full w-auto h-auto object-contain" />
            <HeroSlices size="sm" />
          </div>

        </div>

        {/* Promo strip — bottom of hero */}
        <div className="relative w-full border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="container-x py-3 md:py-4 flex items-center gap-4 md:gap-8 overflow-x-auto text-[11px] md:text-xs">
            <span className="inline-flex items-center gap-2 text-gold font-mono tracking-[0.2em] uppercase shrink-0">
              <Sparkles className="w-3 h-3" /> Flat 20% off · Code CRUNCH20
            </span>
            <span className="text-cream/60 shrink-0 hidden sm:inline">Free shipping over ₹899</span>
            <span className="text-cream/60 shrink-0 hidden md:inline">Cash on delivery available</span>
            <span className="text-cream/60 shrink-0 hidden md:inline">Small-batch craft</span>
          </div>
        </div>


      </section>

      {/* Marquee */}
      <section className="bg-gold text-forest-deep py-4 overflow-hidden border-y border-forest-deep/20">
        <div className="flex whitespace-nowrap marquee-track font-display text-xl md:text-2xl italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {bannerWords.map((w, j) => (
                <span key={j} className="flex items-center gap-10">
                  {w} <span className="text-forest-deep/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>



      {/* Value props */}
      <section className="relative py-16 md:py-20" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(20,18,22,0.85) 20%, rgba(20,18,22,0.85) 80%, transparent 100%)" }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container-x">
          <div className="grid md:grid-cols-4 gap-6">
            {valueProps.map((v) => {
              const Icon = VALUE_PROP_ICON_MAP[v.icon] ?? Leaf;
              return (
              <div key={v.title} className="group relative rounded-2xl border border-white/[0.08] p-6 hover:-translate-y-1 hover:border-gold/40 transition overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1719 0%, #131114 100%)" }}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/30 text-gold grid place-items-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="relative mt-4 font-display text-xl text-cream">{v.title}</h3>
                <p className="relative mt-1 text-sm text-cream/60 leading-relaxed">{v.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Ornamental divider */}
      <Ornament />

      {/* Bestsellers */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("home.bestsellers.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">{t("home.bestsellers.title")}</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:text-terracotta transition">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Numbers strip */}
      <section className="container-x py-10 md:py-14">
        <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: "linear-gradient(90deg, #101012 0%, #17141a 50%, #101012 100%)" }}>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(rgba(212,162,76,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
            {stats.map((s) => (
              <div key={s.l} className="p-6 md:p-8 text-center">
                <p className="font-display text-4xl md:text-5xl text-gold">{s.n}</p>
                <p className="mt-1 text-[11px] tracking-[0.3em] uppercase text-cream/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Product of the month — Nuts · Seeds · Dry fruits (one frame) */}
      <section className="container-x px-4 py-12 md:px-0 md:py-20">
        <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-forest-deep text-cream grain grain-after">
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.28]" style={{ backgroundImage: `url(${story1})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/95 via-forest-deep/90 to-forest-deep/95" />
          <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="absolute -top-24 -left-16 w-[360px] h-[360px] rounded-full bg-gold/25 blur-[110px]" />
          <div className="absolute -bottom-32 right-1/4 w-[420px] h-[420px] rounded-full bg-terracotta/20 blur-[130px]" />

          <div className="relative p-6 sm:p-10 md:p-14">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold">Product of the month</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-2">
                Three picks. <span className="italic text-gold">One month.</span>
              </h2>
            </div>

            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              {monthPicks.map((pick) => {
                const prod = shown.find((p) => p.slug === pick.slug) ?? shown[0];
                if (!prod) return null;
                return (
                  <div key={pick.key} className="flex flex-row md:flex-col items-center gap-4 md:gap-5 py-6 md:py-0 md:px-6 text-left md:text-center">
                    <div className="relative shrink-0 md:shrink w-[38%] md:w-full flex justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full max-w-[130px] md:max-w-[220px] drop-shadow-[0_24px_44px_rgba(0,0,0,0.55)] hover:-translate-y-1.5 transition duration-500"
                      />
                    </div>
                    <div className="min-w-0 flex-1 md:flex-none">
                      <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-gold">{pick.eyebrow}</p>
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl mt-1.5 leading-[1.05]">
                        {pick.title} <span className="italic text-gold">{pick.italic}</span>
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-cream/70 leading-relaxed md:max-w-[260px] md:mx-auto line-clamp-3">{pick.desc}</p>
                      <div className="mt-3 md:mt-5 flex items-center md:justify-center gap-3">
                        <p className="font-mono text-lg sm:text-xl text-gold">₹{prod.price}</p>
                        {prod.compareAt && <p className="font-mono text-xs sm:text-sm text-cream/45 line-through">₹{prod.compareAt}</p>}
                      </div>
                      <Link
                        to="/product/$slug"
                        params={{ slug: prod.slug }}
                        className="mt-3 md:mt-4 rounded-full bg-gold text-forest-deep px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-cream transition inline-flex items-center gap-2 whitespace-nowrap"
                      >
                        Shop <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Categories */}
      <section className="container-x py-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("home.categories.eyebrow")}</p>
          <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">{t("home.categories.title")}<br /><span className="italic">{t("home.categories.titleItalic")}</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
            { name: "Nuts", desc: "Crunchy, protein-dense, brain fuel.", img: products[0].image, tint: "text-cream", bg: "linear-gradient(150deg, #14301f 0%, #0d1b13 100%)" },
            { name: "Seeds", desc: "Tiny things, giant nutrition.", img: products[5].image, tint: "text-cream", bg: "linear-gradient(150deg, #2b2036 0%, #14101c 100%)" },
            { name: "Dried Fruits", desc: "Nature's original candy.", img: products[6].image, tint: "text-cream", bg: "linear-gradient(150deg, #3a2016 0%, #1b0f0a 100%)" },
          ].map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ cat: c.name } as never}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 ${c.tint} min-h-[380px] flex flex-col justify-end p-8 hover:-translate-y-1 hover:border-gold/40 transition`}
              style={{ background: c.bg }}
            >
              <img src={c.img} alt={c.name} className="absolute -top-6 -right-6 w-56 rotate-6 group-hover:scale-110 group-hover:rotate-3 transition duration-500 drop-shadow-2xl" />
              <div className="relative">
                <h3 className="font-display text-4xl">{c.name}</h3>
                <p className="mt-2 opacity-80 max-w-[220px]">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* New arrivals */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("home.new.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">{t("home.new.title")}</h2>

          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Lifestyle editorial */}
      <section className="container-x py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={lifestyle1} alt="Snack life" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            <div className="absolute bottom-6 left-6 right-6 bg-cream/95 backdrop-blur rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-deep grid place-items-center text-gold">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">"My 4pm slump officially has a solution."</p>
                <p className="text-xs text-muted-foreground mt-1">Aanya · Bengaluru</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("home.ritual.eyebrow")}</p>
            <h2 className="font-display text-5xl md:text-6xl text-forest-deep mt-3 leading-[0.95]">
              {t("home.ritual.title")} <br /><span className="italic">{t("home.ritual.titleItalic")}</span>
            </h2>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We built Grams for the in-between moments — the 4pm slumps, the pre-workout
              scrambles, the "I forgot to eat lunch" saves. Snacks that don't cost you your
              afternoon.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Zero refined sugar", "Zero preservatives", "100% traceable", "Recyclable pouches"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/story" className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold hover:bg-forest transition">
              Meet the farmers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("home.testimonials.eyebrow")}</p>
          <h2 className="font-display text-4xl md:text-6xl text-forest-deep mt-2">{t("home.testimonials.title")}</h2>

        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "The mango slices are dangerous. I finished a pouch in one Netflix episode.", a: "Kabir S.", loc: "Delhi" },
            { q: "Genuinely the freshest walnuts I've had in years. Zero staleness.", a: "Meera P.", loc: "Pune" },
            { q: "Packaging feels premium, product delivers. My gym bag essential.", a: "Ishaan R.", loc: "Bangalore" },
          ].map((t) => (
            <div key={t.a} className="rounded-2xl border border-border bg-card p-7 hover:shadow-card transition">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-gold" />))}
              </div>
              <p className="mt-4 font-display text-xl leading-snug text-forest-deep">"{t.q}"</p>
              <p className="mt-6 text-sm font-semibold">{t.a}</p>
              <p className="text-xs text-muted-foreground">{t.loc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-x py-20">
        <div className="relative rounded-[2rem] overflow-hidden bg-gold text-forest-deep p-10 md:p-16 text-center">
          <img src={texture1} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-30" />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase">{t("home.newsletter.eyebrow")}</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3 leading-tight">
              Get <span className="italic">10% off</span> your<br /> first bag of goodness.
            </h2>
            <p className="mt-4 opacity-80">Recipes, restock alerts, and early access to seasonal drops.</p>
            <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="you@snacker.club" className="flex-1 bg-cream rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-forest-deep" />
              <button className="rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold hover:bg-forest transition">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-gold">{n}</p>
      <p className="text-xs uppercase tracking-widest text-cream/60 mt-1">{l}</p>
    </div>
  );
}

function Ornament() {
  return (
    <div aria-hidden className="container-x py-6 md:py-8">
      <div className="flex items-center gap-4 md:gap-6 opacity-70">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" opacity="0.9" />
        </svg>
        <span className="text-[10px] tracking-[0.5em] uppercase text-cream/50">Grams</span>
        <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" opacity="0.9" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
      </div>
    </div>
  );
}

