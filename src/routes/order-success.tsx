import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, ArrowRight, Truck, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "@/lib/site-store";

type Search = { id?: string };

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>): Search => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({ meta: [{ title: "Order confirmed — Grams" }, { name: "robots", content: "noindex" }] }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { id } = Route.useSearch();
  const { orders } = useSite();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="container-x py-12 md:py-20">
      <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="mx-auto w-20 h-20 rounded-full bg-forest-deep text-gold grid place-items-center animate-bouncy">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="mt-6 text-xs tracking-[0.3em] uppercase text-gold">Payment successful</p>
        <h1 className="mt-3 font-display text-4xl md:text-6xl text-forest-deep leading-tight">Your snacks are on the way.</h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">Thanks for choosing Grams. We're packing your order fresh — you'll get shipping updates on WhatsApp & email.</p>

        <div className="mt-10 rounded-2xl bg-card border border-border p-6 md:p-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</p>
              <p className="font-display text-2xl text-forest-deep">{order?.id ?? id}</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest bg-forest-deep text-gold px-3 py-1.5 rounded-full">{order?.status ?? "Processing"}</span>
          </div>

          {order?.items && order.items.length > 0 && (
            <div className="mt-6 space-y-2">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="truncate">{i.name} <span className="text-muted-foreground">· {i.weight} × {i.qty}</span></span>
                  <span className="font-semibold">₹{i.price * i.qty}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total paid</span>
                <span className="font-display text-2xl text-forest-deep">₹{order.total}</span>
              </div>
            </div>
          )}

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50"><Package className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Packed fresh today</span></div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50"><Truck className="w-4 h-4 mt-0.5 text-forest-deep" /><span>2–3 day delivery</span></div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50"><MapPin className="w-4 h-4 mt-0.5 text-forest-deep" /><span>Tracked shipment</span></div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/profile" className="rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
            View my orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/shop" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
