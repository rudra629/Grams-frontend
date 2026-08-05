import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Instagram } from "lucide-react";

export const Route = createFileRoute("/crunch")({
  head: () => ({
    meta: [
      { title: "Crunch Mode — Coming Soon | Grams" },
      { name: "description", content: "Something bold is cracking open. Crunch Mode drops soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CrunchPage,
});

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function CrunchPage() {
  const target = new Date();
  target.setDate(target.getDate() + 42);
  const { d, h, m, s } = useCountdown(target);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div className="crunch-scope relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Layered background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(1200px 700px at 20% 20%, rgba(255,122,61,0.25), transparent 60%), radial-gradient(900px 600px at 85% 85%, rgba(255,209,102,0.18), transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.14]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 60%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      {/* Vertical side rails */}
      <div className="hidden lg:flex absolute top-0 bottom-0 left-6 items-center pointer-events-none">
        <div className="rotate-180 [writing-mode:vertical-rl] text-[10px] tracking-[0.5em] uppercase text-cream/40">
          Grams · SS26 · Crunch Series · No. 001
        </div>
      </div>
      <div className="hidden lg:flex absolute top-0 bottom-0 right-6 items-center pointer-events-none">
        <div className="[writing-mode:vertical-rl] text-[10px] tracking-[0.5em] uppercase text-cream/40">
          Dropping soon · Stay hungry · Stay loud
        </div>
      </div>

      <div className="container-x relative pt-14 md:pt-20 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between text-cream/60 text-[11px] tracking-[0.35em] uppercase">
          <span>Grams / Lab</span>
          <span className="hidden sm:inline">Vol. 001 — The Crunch Files</span>
          <span>SS26</span>
        </div>

        {/* Massive editorial headline */}
        <div className="mt-16 md:mt-24 relative">
          <div className="absolute -top-6 md:-top-10 left-0 text-[#ffb26b] text-xs md:text-sm tracking-[0.4em] uppercase">
            ✦ Coming Soon
          </div>
          <h1 className="font-display font-semibold text-cream leading-[0.82] tracking-[-0.045em]"
              style={{ fontSize: "clamp(3.2rem, 15vw, 14rem)" }}>
            <span className="block">Louder.</span>
            <span className="block italic text-[#ffb26b]">Bolder.</span>
            <span className="block">Crunchier.</span>
          </h1>
          <div className="mt-6 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="max-w-md text-cream/70 text-base md:text-lg leading-relaxed">
              A louder, spicier, snappier side of Grams. Chili-lime cashews.
              Smoked almonds. Wasabi peas. Coming for your taste buds — buckle up.
            </p>
            <div className="text-cream/40 text-xs tracking-[0.35em] uppercase md:text-right">
              <div>Directed by</div>
              <div className="text-cream/80 mt-1">Grams Studio</div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-20 md:mt-28 border-y border-cream/15 py-6 overflow-hidden">
          <div className="flex gap-12 marquee-track whitespace-nowrap font-display italic text-3xl md:text-5xl text-cream/80">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-12 shrink-0">
                <span>Chili · Lime</span>
                <span className="text-[#ffb26b]">✦</span>
                <span>Smoked · Almond</span>
                <span className="text-[#ffb26b]">✦</span>
                <span>Wasabi · Pea</span>
                <span className="text-[#ffb26b]">✦</span>
                <span>Peri · Cashew</span>
                <span className="text-[#ffb26b]">✦</span>
                <span>Honey · Chipotle</span>
                <span className="text-[#ffb26b]">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown + signup grid */}
        <div className="mt-16 md:mt-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <div className="text-[#ffb26b] text-xs tracking-[0.4em] uppercase">The drop lands in</div>
            <div className="mt-6 grid grid-cols-4 gap-3 md:gap-5">
              {[
                { l: "Days", v: d },
                { l: "Hours", v: h },
                { l: "Mins", v: m },
                { l: "Secs", v: s },
              ].map((u) => (
                <div key={u.l} className="rounded-2xl border border-cream/15 bg-cream/[0.04] backdrop-blur-sm p-4 md:p-6 text-center">
                  <div className="font-display text-4xl md:text-6xl text-cream tabular-nums leading-none">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="mt-2 md:mt-3 text-[10px] tracking-[0.35em] uppercase text-cream/50">
                    {u.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-6 lg:border-l lg:border-cream/15">
            <div className="text-[#ffb26b] text-xs tracking-[0.4em] uppercase">First in line</div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-cream leading-tight">
              Get early access + a<br />secret discount code.
            </h2>
            {joined ? (
              <div className="mt-6 p-5 rounded-2xl border border-[#ffb26b]/40 bg-[#ffb26b]/10 text-cream">
                You're on the list. We'll holler when it drops. ✦
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-cream/[0.06] border border-cream/15 rounded-full px-5 py-3.5 text-cream placeholder:text-cream/40 focus:outline-none focus:border-[#ffb26b] transition"
                />
                <button
                  type="submit"
                  className="group relative overflow-hidden rounded-full px-6 py-3.5 bg-[#ffb26b] text-[#1a0f08] font-semibold text-sm tracking-wide hover:bg-[#ffd166] transition-colors inline-flex items-center justify-center gap-2"
                >
                  Notify me
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}
            <div className="mt-8 flex items-center gap-4 text-cream/50 text-sm">
              <span>Or follow along</span>
              <a href="#" className="inline-flex items-center gap-1.5 text-cream hover:text-[#ffb26b] transition">
                <Instagram className="w-4 h-4" /> @grams.crunch
              </a>
            </div>
          </div>
        </div>

        {/* Flavor tags */}
        <div className="mt-20 md:mt-28">
          <div className="text-cream/40 text-xs tracking-[0.4em] uppercase mb-6">On the menu</div>
          <div className="flex flex-wrap gap-3">
            {["Chili-Lime Cashew", "Smoked Almond", "Wasabi Pea", "Peri Peri Cashew", "Honey Chipotle", "Salt & Vinegar", "Truffle Pecan", "Black Pepper Walnut"].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full border border-cream/15 text-cream/80 text-sm hover:border-[#ffb26b] hover:text-[#ffb26b] transition cursor-default">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom credit */}
        <div className="mt-24 pt-8 border-t border-cream/10 flex flex-wrap items-center justify-between gap-4 text-cream/40 text-xs tracking-[0.3em] uppercase">
          <span>© Grams Studio</span>
          <span className="text-[#ffb26b]">✦ Stay tuned ✦</span>
          <span>Tap the button to head back to cozy</span>
        </div>
      </div>
    </div>
  );
}
