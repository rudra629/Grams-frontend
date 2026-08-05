import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useSite } from "@/lib/site-store";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly-to-cart";
import { HEALTH_ISSUES, matchIssue, type HealthIssue } from "@/lib/health-map";
import type { Product } from "@/lib/products";

type Msg =
  | { role: "bot"; kind: "text"; text: string }
  | { role: "bot"; kind: "picker" }
  | { role: "bot"; kind: "recs"; issue: HealthIssue }
  | { role: "user"; kind: "text"; text: string };

export function HealthChat() {
  const { allProducts, t } = useSite();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", kind: "text", text: t("chat.greeting") },
    { role: "bot", kind: "picker" },
  ]);
  const { add } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("grams:chat-toggle", { detail: { open } }));
  }, [open]);

  const closeChat = () => {
    setClosing(true);
    window.setTimeout(() => { setClosing(false); setOpen(false); }, 220);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);


  const findProducts = (slugs: string[]): Product[] =>
    slugs.map((s) => allProducts.find((p) => p.slug === s)).filter(Boolean) as Product[];

  const handleIssue = (issue: HealthIssue) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", kind: "text", text: issue.label },
      { role: "bot", kind: "text", text: issue.explanation },
      { role: "bot", kind: "recs", issue },
    ]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const match = matchIssue(text);
    if (match) {
      setMessages((prev) => [
        ...prev,
        { role: "user", kind: "text", text },
        { role: "bot", kind: "text", text: match.explanation },
        { role: "bot", kind: "recs", issue: match },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "user", kind: "text", text },
        { role: "bot", kind: "text", text: "Got it. I don't have a strong match for that yet — try picking one of the areas below:" },
        { role: "bot", kind: "picker" },
      ]);
    }
  };

  return (
    <>
      {/* Floating trigger — bottom LEFT so it doesn't collide with ModeToggle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Grams health assistant"
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 group inline-flex items-center gap-0 md:gap-2 rounded-full p-3 md:px-5 md:py-3.5 text-xs md:text-sm font-semibold bg-cream text-forest-deep shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(212,162,76,0.4)] transition-all hover:-translate-y-0.5"
        style={{ display: open ? "none" : undefined }}
      >
        <span className="relative grid place-items-center w-6 h-6 rounded-full bg-forest-deep text-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="absolute inset-0 rounded-full ring-2 ring-gold/50 animate-ping" />
        </span>
        <span className="hidden md:inline">{t("chat.trigger")}</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{ transformOrigin: "bottom left" }}
          className={`fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto z-50 w-full md:w-[380px] max-h-[85vh] md:max-h-[640px] flex flex-col rounded-t-3xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d0f]/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out ${closing ? "opacity-0 translate-y-3 scale-[0.96]" : "animate-[chat-in_260ms_cubic-bezier(0.22,1,0.36,1)]"}`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-forest-deep to-[#141216]">
            <div className="w-10 h-10 rounded-full bg-gold text-forest-deep grid place-items-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-cream text-lg leading-none">{t("chat.name")}</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold/80 mt-1">Grams · Health & Nutrition Guide</p>

            </div>
            <button onClick={closeChat} className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center text-cream/70 transition-transform hover:rotate-90">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 text-sm">
            {messages.map((m, i) => {
              if (m.kind === "text") {
                return (
                  <div key={i} className={m.role === "bot" ? "flex" : "flex justify-end"}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${m.role === "bot" ? "bg-white/[0.06] text-cream/90" : "bg-gold text-forest-deep font-medium"}`}>
                      {m.text}
                    </div>
                  </div>
                );
              }
              if (m.kind === "picker") {
                return (
                  <div key={i} className="flex flex-wrap gap-2">
                    {HEALTH_ISSUES.map((iss) => (
                      <button
                        key={iss.id}
                        onClick={() => handleIssue(iss)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] hover:bg-gold hover:text-forest-deep hover:border-gold px-3 py-1.5 text-xs font-medium text-cream/80 transition"
                      >
                        <span>{iss.emoji}</span> {iss.label}
                      </button>
                    ))}
                  </div>
                );
              }
              // recs
              const list = findProducts(m.issue.recommendedSlugs);
              return (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold">Recommended for you</p>
                  {list.map((p) => (
                    <div key={p.slug} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <img src={p.image} alt={p.name} className="w-12 h-14 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display italic text-cream text-sm leading-tight truncate">{p.name}</p>
                        <p className="text-[11px] font-mono text-gold">₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          add({ slug: p.slug, name: p.name, image: p.image, weight: p.weights[0].label, price: p.weights[0].price, qty: 1 });
                          flyToCart(e.currentTarget as HTMLElement, p.image);
                        }}
                        className="shrink-0 rounded-full bg-gold text-forest-deep text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 hover:bg-cream transition"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="border-t border-white/10 p-3 flex items-center gap-2 bg-[#0a0a0c]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your issue…"
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2.5 text-sm text-cream outline-none focus:border-gold placeholder:text-cream/40"
            />
            <button type="submit" aria-label="Send" className="w-10 h-10 rounded-full bg-gold text-forest-deep grid place-items-center hover:bg-cream transition shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Named alt export for icon-only style
export { MessageCircle };
