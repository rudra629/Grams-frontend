import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Gift, Sparkles, ArrowRight, Package, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSite, type GiftCategory, type GiftArticle } from "@/lib/site-store";
import { getLenis } from "@/lib/smooth-scroll";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Gifting Stories — Grams" },
      { name: "description", content: "Live stories from the Grams gifting studio — corporate, birthday and festive dry-fruit gift runs, told from the inside." },
      { property: "og:title", content: "Gifting Stories — Grams" },
      { property: "og:description", content: "Behind every Grams gift box: the runs, the deadlines, the hand-numbered cards." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Gifting,
});

const CATEGORIES: { id: GiftCategory | "All"; label: string; sub: string }[] = [
  { id: "All", label: "All stories", sub: "Everything we've shipped" },
  { id: "Corporate", label: "Corporate", sub: "Clients & teams" },
  { id: "Birthday", label: "Birthday", sub: "Better than another candle" },
  { id: "Festive", label: "Festive", sub: "Diwali, Rakhi, Christmas" },
];

function Gifting() {
  const { giftArticles } = useSite();
  const [cat, setCat] = useState<GiftCategory | "All">("All");
  const [open, setOpen] = useState<GiftArticle | null>(null);
  const filtered = cat === "All" ? giftArticles : giftArticles.filter((a) => a.category === cat);

  return (
    <div className="bg-[#050506] text-cream min-h-screen -mx-[calc((100vw-100%)/2)]">
      <div className="mx-auto max-w-[100vw] px-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(212,162,76,0.35) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[140px]" />
          <div className="absolute -bottom-32 -right-16 w-[420px] h-[420px] rounded-full bg-terracotta/10 blur-[120px]" />
          <div className="container-x relative py-20 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5" /> The Gifting Journal
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-8xl leading-[0.9] tracking-tight">
              Stories from the <span className="italic text-gold">gifting studio.</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-cream/70 leading-relaxed">
              Every box has a backstory — the 3am packing lines, the forgotten birthdays we rescued,
              the 500-box Diwali runs. Read them all here.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container-x py-10 md:py-14">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`pill rounded-full px-5 md:px-6 py-3 text-xs md:text-sm font-medium tracking-wide border transition ${cat === c.id ? "bg-gold text-forest-deep border-gold" : "border-white/15 bg-white/[0.03] text-cream/80 hover:border-gold/50"}`}
              >
                {c.label} <span className="opacity-60 hidden md:inline">· {c.sub}</span>
              </button>
            ))}
          </div>

          {/* 2 x 2 article grid */}
          <div className="mt-10 grid sm:grid-cols-2 gap-5 md:gap-8">
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-12 text-center text-cream/60">
                <Gift className="w-8 h-8 mx-auto mb-3 text-gold" />
                No {cat === "All" ? "" : cat.toLowerCase() + " "}stories published yet. Ask an admin to add some.
              </div>
            )}
            {filtered.map((a) => (
              <article
                key={a.id}
                onClick={() => setOpen(a)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0f0f11] to-black hover:border-gold/50 transition"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(500px 240px at 50% 0%, rgba(212,162,76,0.15), transparent 60%)" }} />
                <div className="relative aspect-[16/10] bg-black grid place-items-center border-b border-white/10 overflow-hidden">
                  {a.images[0] ? (
                    <img src={a.images[0]} alt={a.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Gift className="w-16 h-16 text-gold/30" />
                  )}
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase font-semibold text-gold border border-gold/40 rounded-full px-2.5 py-1 bg-black/60 backdrop-blur">
                    {a.category}
                  </span>
                  {a.images.length > 1 && (
                    <span className="absolute bottom-4 right-4 text-[10px] font-mono text-cream/60 border border-white/15 rounded-full px-2 py-0.5 bg-black/50">
                      +{a.images.length - 1} photos
                    </span>
                  )}
                </div>
                <div className="relative p-5 md:p-7">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-cream/40 font-mono">{a.date}{a.author ? ` · ${a.author}` : ""}</p>
                  <h2 className="mt-2 font-display italic text-2xl md:text-3xl leading-tight text-cream group-hover:text-gold transition-colors">{a.title}</h2>
                  <p className="mt-3 text-sm text-cream/60 leading-relaxed line-clamp-3">{a.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold">
                    Read story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bulk banner */}
        <section className="container-x py-16">
          <div className="relative rounded-[2rem] overflow-hidden border border-gold/25 bg-gradient-to-br from-[#0d0d0f] to-black p-8 md:p-16">
            <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-gold/15 blur-[120px]" />
            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Corporate · Bulk</p>
                <h2 className="mt-3 font-display text-4xl md:text-6xl leading-[0.95]">
                  50 boxes. 500 boxes. <span className="italic text-gold">One quote.</span>
                </h2>
                <p className="mt-4 text-cream/70 max-w-md leading-relaxed">
                  White-label, custom branding, personalised notes at scale. Diwali & year-end slots go fast — reserve early.
                </p>
                <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-7 py-4 text-sm font-semibold hover:bg-cream transition">
                  Request a quote <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid place-items-center">
                <div className="relative w-full max-w-xs aspect-square rounded-2xl border border-gold/30 grid place-items-center">
                  <Package className="w-24 h-24 text-gold/40" />
                  <span className="absolute -top-3 -right-3 text-[10px] tracking-[0.25em] uppercase text-forest-deep bg-gold px-3 py-1 rounded-full">Est. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {open && <ArticleReader article={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ArticleReader({ article, onClose }: { article: GiftArticle; onClose: () => void }) {
  const [i, setI] = useState(0);
  const imgs = article.images.length ? article.images : [];
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const lenis = getLenis();
    lenis?.stop();

    // Smooth-scroll libs swallow wheel events globally — drive the panel manually.
    const onWheel = (e: WheelEvent) => {
      const el = bodyRef.current;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);



  return createPortal(
    <div className="fixed inset-0 z-[200] grid place-items-center p-3 md:p-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#101012] to-black text-cream flex flex-col md:grid md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] h-[92vh]">
        <button
          onClick={onClose}
          aria-label="Close story"
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full border border-white/15 bg-black/70 backdrop-blur grid place-items-center hover:border-gold/60 hover:text-gold transition"
        >
          <X className="w-4 h-4" />
        </button>

        {imgs.length > 0 && (
          <div className="relative shrink-0 h-[32vh] md:h-full md:min-h-0 bg-black grid place-items-center p-5 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
            <img src={imgs[i]} alt={`${article.title} — image ${i + 1}`} className="max-h-full max-w-full object-contain drop-shadow-[0_24px_50px_rgba(212,162,76,0.25)]" />
            {imgs.length > 1 && (
              <>
                <button onClick={() => setI((p) => (p - 1 + imgs.length) % imgs.length)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-black/60 grid place-items-center hover:border-gold/60 hover:text-gold transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setI((p) => (p + 1) % imgs.length)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-black/60 grid place-items-center hover:border-gold/60 hover:text-gold transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {imgs.map((_, n) => (
                    <button key={n} onClick={() => setI(n)} aria-label={`Image ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div ref={bodyRef} data-lenis-prevent className={`min-h-0 h-full flex-1 overflow-y-auto overscroll-contain no-scrollbar p-6 md:p-10 ${imgs.length ? "" : "md:col-span-2"}`}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold">{article.category} · {article.date}</p>
          <h2 className="mt-3 font-display italic text-2xl md:text-4xl leading-[1.05]">{article.title}</h2>
          {article.author && <p className="mt-3 text-xs font-mono text-cream/50">By {article.author}</p>}
          <p className="mt-5 text-base md:text-lg text-cream/80 leading-relaxed">{article.excerpt}</p>
          <div className="mt-5 space-y-4 text-sm md:text-base text-cream/70 leading-relaxed">
            {article.body.split("\n").filter((l) => l.trim()).map((para, n) => (
              <p key={n}>{para}</p>
            ))}
          </div>

          {imgs.length > 1 && (
            <div className="mt-8 grid grid-cols-4 gap-2">
              {imgs.map((src, n) => (
                <button key={n} onClick={() => setI(n)} className={`aspect-square rounded-xl border p-1.5 bg-black grid place-items-center transition overflow-hidden ${n === i ? "border-gold" : "border-white/10 hover:border-white/30"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}

          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold text-forest-deep px-6 py-3 text-sm font-semibold hover:bg-cream transition">
            Plan a gifting run <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>,
    document.body
  );
}
