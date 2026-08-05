import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { useCart, MAX_PER_ITEM } from "@/lib/cart-store";


export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — Grams" }, { name: "description", content: "Your Grams shopping bag." }] }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const discount = applied ? Math.round(total * 0.1) : 0;
  const shipping = total > 899 ? 0 : 49;
  const grand = total - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gold" />
        <h1 className="mt-6 font-display text-5xl text-forest-deep">Your bag is empty.</h1>
        <p className="mt-3 text-muted-foreground">Give it something to hold — we recommend the mango.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold hover:bg-forest transition">
          Shop now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <p className="text-xs tracking-[0.3em] uppercase text-gold">Checkout</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl text-forest-deep">Your Bag</h1>

      <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.slug + i.weight} className="flex gap-4 md:gap-6 p-4 md:p-6 rounded-2xl border border-border bg-card">
              <div className="w-24 h-32 md:w-32 md:h-40 shrink-0 rounded-xl bg-muted grid place-items-center overflow-hidden">
                <img src={i.image} alt={i.name} className="max-h-full max-w-full object-contain p-2" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl text-forest-deep">{i.name}</h3>
                    <p className="text-sm text-muted-foreground">{i.weight}</p>
                  </div>
                  <button onClick={() => remove(i.slug, i.weight)} className="p-2 text-muted-foreground hover:text-terracotta">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center rounded-full border border-border overflow-hidden">
                      <button onClick={() => setQty(i.slug, i.weight, i.qty - 1)} className="w-9 h-9 grid place-items-center hover:bg-muted"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-9 text-center text-sm font-semibold">{i.qty}</span>
                      <button onClick={() => setQty(i.slug, i.weight, i.qty + 1)} disabled={i.qty >= MAX_PER_ITEM} className="w-9 h-9 grid place-items-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    {i.qty >= MAX_PER_ITEM && <span className="text-[10px] uppercase tracking-widest text-terracotta">Max {MAX_PER_ITEM} per product</span>}
                  </div>
                  <p className="font-display text-2xl text-forest-deep">₹{i.price * i.qty}</p>
                </div>

              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <button onClick={clear} className="text-muted-foreground hover:text-terracotta">Clear bag</button>
            <Link to="/shop" className="text-forest-deep font-semibold hover:text-terracotta">Continue shopping →</Link>
          </div>
        </div>

        <aside className="rounded-2xl bg-forest-deep text-cream p-6 md:p-8 h-fit sticky top-24">
          <h2 className="font-display text-2xl">Order Summary</h2>

          <div className="mt-6 space-y-3 text-sm">
            <Row l="Subtotal" v={`₹${total}`} />
            {discount > 0 && <Row l="Discount (WELCOME10)" v={`−₹${discount}`} accent />}
            <Row l="Shipping" v={shipping === 0 ? "Free" : `₹${shipping}`} />
          </div>

          <div className="mt-5 flex gap-2">
            <div className="flex items-center gap-2 flex-1 bg-cream/10 border border-cream/20 rounded-full px-4">
              <Tag className="w-4 h-4 text-gold" />
              <input value={promo} onChange={(e) => setPromo(e.target.value.toUpperCase())} placeholder="Promo code" className="bg-transparent outline-none py-2.5 w-full text-sm placeholder:text-cream/40" />
            </div>
            <button onClick={() => setApplied(promo === "WELCOME10")} className="rounded-full bg-gold text-forest-deep px-4 text-xs font-semibold">Apply</button>
          </div>
          {applied && <p className="text-xs text-gold mt-2">✓ WELCOME10 applied</p>}
          {promo && !applied && <p className="text-xs text-terracotta mt-2">Try: WELCOME10</p>}

          <div className="mt-6 pt-5 border-t border-cream/15 flex items-center justify-between">
            <span className="text-cream/70 text-sm">Total</span>
            <span className="font-display text-4xl text-gold">₹{grand}</span>
          </div>

          <Link to="/checkout" className="mt-6 w-full rounded-full bg-gold text-forest-deep py-4 text-sm font-bold hover:bg-cream transition inline-flex items-center justify-center gap-2">
            Checkout securely <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-cream/50">Secure checkout · COD available · 100% freshness guarantee</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ l, v, accent }: { l: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-cream/70">{l}</span>
      <span className={accent ? "text-gold font-semibold" : "font-semibold"}>{v}</span>
    </div>
  );
}
