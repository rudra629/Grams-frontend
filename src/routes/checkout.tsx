import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, CreditCard, Wallet, Truck, Check, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useSite, type Address } from "@/lib/site-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Grams" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const { addresses, addAddress, addOrder } = useSite();
  const [selected, setSelected] = useState<string | null>(addresses[0]?.id ?? null);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [pay, setPay] = useState<"card" | "upi" | "cod">("card");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState<Omit<Address, "id">>({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", label: "Home" });

  const shipping = total > 899 ? 0 : 49;
  const grand = total + shipping;

  const saveAddress = () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) return;
    const a = addAddress(form);
    setSelected(a.id);
    setShowForm(false);
    setForm({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", label: "Home" });
  };

  const placeOrder = () => {
    if (!selected || items.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      const id = `GRM-${Math.floor(10000 + Math.random() * 89999)}`;
      const addr = addresses.find((a) => a.id === selected);
      addOrder({
        id,
        customer: addr?.name ?? "Guest",
        email: "you@grams.snack",
        total: grand,
        status: "Processing",
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        items: items.map((i) => ({ name: i.name, qty: i.qty, weight: i.weight, price: i.price })),
      });
      clear();
      navigate({ to: "/order-success", search: { id } });
    }, 1400);
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-forest-deep">Your bag is empty</h1>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-7 py-4 text-sm font-semibold">Shop now <ArrowRight className="w-4 h-4" /></Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8 md:py-12">
      <p className="text-xs tracking-[0.3em] uppercase text-gold">Checkout</p>
      <h1 className="mt-2 font-display text-4xl md:text-6xl text-forest-deep">Almost yours.</h1>

      <div className="mt-8 md:mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10">
        <div className="space-y-6">
          {/* Address */}
          <section className="rounded-2xl bg-card border border-border p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-deep" />
                <h2 className="font-display text-2xl text-forest-deep">Delivery address</h2>
              </div>
              <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-forest-deep hover:text-terracotta">
                <Plus className="w-4 h-4" /> New
              </button>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className={`text-left rounded-xl border-2 p-4 transition ${selected === a.id ? "border-forest-deep bg-forest-deep/5" : "border-border hover:border-forest-deep/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-gold text-forest-deep px-2 py-0.5 rounded-full">{a.label}</span>
                    {selected === a.id && <Check className="w-4 h-4 text-forest-deep" />}
                  </div>
                  <p className="mt-2 font-semibold text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.phone}</p>
                </button>
              ))}
            </div>

            {showForm && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up">
                <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Input label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} span2 />
                <Input label="Address line 2 (optional)" value={form.line2 ?? ""} onChange={(v) => setForm({ ...form, line2: v })} span2 />
                <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                <Input label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                <Input label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Label</label>
                  <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="rounded-xl border border-border bg-cream px-4 py-3 text-sm">
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <button onClick={saveAddress} className="rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold">Save address</button>
                  <button onClick={() => setShowForm(false)} className="rounded-full border border-border px-6 py-3 text-sm">Cancel</button>
                </div>
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-2xl bg-card border border-border p-5 md:p-7">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-forest-deep" />
              <h2 className="font-display text-2xl text-forest-deep">Payment</h2>
            </div>
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              <PayOpt icon={CreditCard} label="Card" active={pay === "card"} onClick={() => setPay("card")} />
              <PayOpt icon={Wallet} label="UPI" active={pay === "upi"} onClick={() => setPay("upi")} />
              <PayOpt icon={Truck} label="Cash on delivery" active={pay === "cod"} onClick={() => setPay("cod")} />
            </div>

            {pay === "card" && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up">
                <Input label="Card number" value="" onChange={() => {}} span2 placeholder="4242 4242 4242 4242" />
                <Input label="Expiry" value="" onChange={() => {}} placeholder="MM/YY" />
                <Input label="CVC" value="" onChange={() => {}} placeholder="123" />
              </div>
            )}
            {pay === "upi" && (
              <div className="mt-5 animate-fade-up">
                <Input label="UPI ID" value="" onChange={() => {}} placeholder="you@upi" />
              </div>
            )}
            {pay === "cod" && (
              <p className="mt-5 text-sm text-muted-foreground animate-fade-up">Pay with cash when your order arrives. Available for orders under ₹5,000.</p>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="rounded-2xl bg-forest-deep text-cream p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Your order</h2>
          <div className="mt-5 space-y-3 max-h-72 overflow-auto pr-1">
            {items.map((i) => (
              <div key={i.slug + i.weight} className="flex items-center gap-3">
                <div className="w-12 h-14 bg-cream/10 rounded-lg grid place-items-center overflow-hidden shrink-0">
                  <img src={i.image} alt="" className="max-h-full max-w-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{i.name}</p>
                  <p className="text-xs text-cream/60">{i.weight} · × {i.qty}</p>
                </div>
                <p className="text-sm font-semibold shrink-0">₹{i.price * i.qty}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-cream/15 space-y-2 text-sm">
            <Row l="Subtotal" v={`₹${total}`} />
            <Row l="Shipping" v={shipping === 0 ? "Free" : `₹${shipping}`} />
          </div>
          <div className="mt-4 pt-4 border-t border-cream/15 flex items-center justify-between">
            <span className="text-cream/70 text-sm">Total</span>
            <span className="font-display text-4xl text-gold">₹{grand}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={!selected || processing}
            className="mt-6 w-full rounded-full bg-gold text-forest-deep py-4 text-sm font-bold hover:bg-cream transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {processing ? (<><Loader2 className="w-4 h-4 animate-spin" /> Processing payment…</>) : (<>Pay ₹{grand} <ArrowRight className="w-4 h-4" /></>)}
          </button>
          <p className="mt-3 text-center text-xs text-cream/50">Secure · Encrypted · 100% freshness guarantee</p>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, span2, placeholder }: { label: string; value: string; onChange: (v: string) => void; span2?: boolean; placeholder?: string }) {
  return (
    <div className={`flex flex-col ${span2 ? "sm:col-span-2" : ""}`}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-forest-deep" />
    </div>
  );
}

function PayOpt({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition ${active ? "border-forest-deep bg-forest-deep/5" : "border-border hover:border-forest-deep/40"}`}>
      <Icon className="w-5 h-5 text-forest-deep" />
      <p className="mt-2 font-semibold text-sm">{label}</p>
    </button>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between"><span className="text-cream/70">{l}</span><span className="font-semibold">{v}</span></div>;
}
