import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Package, MapPin, Settings, Heart, LogOut, Edit3, Plus, Check, Clock, Truck, X, Star } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/lib/products";
import { useSite } from "@/lib/site-store";
import { useAuth } from "@/lib/auth-store";
import { useWishlist } from "@/lib/wishlist-store";


export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account — Grams" }, { name: "description", content: "Manage your Grams account, orders, addresses and preferences." }] }),
  component: Profile,
});


type Tab = "overview" | "orders" | "addresses" | "wishlist" | "settings";

function Profile() {
  const [tab, setTab] = useState<Tab>("overview");
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { redirect: "/profile" }, replace: true });
  }, [ready, user, navigate]);

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!user) return <div className="container-x py-24 text-center text-muted-foreground">Redirecting to sign in…</div>;

  return (
    <div className="container-x py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold">My Account</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-forest-deep">Hey, {user.name.split(" ")[0]} 👋</h1>
          <p className="mt-2 text-muted-foreground">{user.email} · Silver Snacker</p>
        </div>
        <button
          onClick={() => { signOut(); toast("Signed out"); navigate({ to: "/", replace: true }); }}
          className="rounded-full border-2 border-border px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:border-terracotta hover:text-terracotta transition"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>


      <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="rounded-2xl bg-card border border-border p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${tab === t.id ? "bg-forest-deep text-cream" : "hover:bg-muted"}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </aside>

        <div>
          {tab === "overview" && <Overview onGo={setTab} />}
          {tab === "orders" && <Orders />}
          {tab === "addresses" && <Addresses />}
          {tab === "wishlist" && <Wishlist />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat n="12" l="Total orders" />
        <Stat n="₹8,240" l="Lifetime spend" />
        <Stat n="240" l="Loyalty points" accent />
      </div>

      <div className="rounded-2xl bg-forest-deep text-cream p-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Next reward</p>
          <p className="font-display text-3xl mt-2">60 pts to Free Shipping</p>
          <div className="mt-4 w-64 h-2 bg-cream/15 rounded-full overflow-hidden">
            <div className="h-full bg-gold" style={{ width: "80%" }} />
          </div>
        </div>
        <button onClick={() => onGo("orders")} className="rounded-full bg-gold text-forest-deep px-6 py-3 text-sm font-semibold">View orders</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => onGo("addresses")} className="text-left rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
          <MapPin className="w-6 h-6 text-gold" />
          <p className="mt-3 font-display text-xl">Delivery addresses</p>
          <p className="text-sm text-muted-foreground">2 saved</p>
        </button>
        <button onClick={() => onGo("settings")} className="text-left rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
          <Settings className="w-6 h-6 text-gold" />
          <p className="mt-3 font-display text-xl">Preferences</p>
          <p className="text-sm text-muted-foreground">Manage email & notifications</p>
        </button>
      </div>
    </div>
  );
}

function Stat({ n, l, accent }: { n: string; l: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border border-border ${accent ? "bg-gold text-forest-deep" : "bg-card"}`}>
      <p className="font-display text-4xl">{n}</p>
      <p className="text-sm opacity-80 mt-1">{l}</p>
    </div>
  );
}

const orders = [
  { id: "GRM-10428", date: "Jul 2, 2026", status: "Delivered", total: 1249, items: [products[0], products[6]] },
  { id: "GRM-10389", date: "Jun 18, 2026", status: "Out for delivery", total: 849, items: [products[3]] },
  { id: "GRM-10321", date: "May 30, 2026", status: "Delivered", total: 2098, items: [products[1], products[5], products[8]] },
];

function Orders() {
  const { addReview, reviews } = useSite();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [pSlug, setPSlug] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const hasReviewed = (orderId: string, slug: string) => reviews.some((r) => r.orderId === orderId && r.productSlug === slug);

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl text-forest-deep">Order {o.id}</p>
              <p className="text-sm text-muted-foreground">Placed on {o.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={o.status} />
              <p className="font-display text-2xl">₹{o.total}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {o.items.map((p) => (
              <div key={p.slug} className="flex items-center gap-3 bg-muted rounded-xl p-2 pr-4">
                <img src={p.image} alt={p.name} className="w-12 h-14 object-contain" />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">₹{p.price}</p>
                </div>
                {o.status === "Delivered" && (
                  hasReviewed(o.id, p.slug) ? (
                    <span className="ml-2 text-[10px] uppercase tracking-widest text-forest-deep bg-gold/40 px-2 py-1 rounded-full">Reviewed</span>
                  ) : (
                    <button
                      onClick={() => { setOpenFor(o.id); setPSlug(p.slug); setRating(5); setText(""); }}
                      className="ml-2 inline-flex items-center gap-1 rounded-full bg-forest-deep text-cream px-3 py-1 text-[11px] font-semibold hover:bg-forest transition"
                    >
                      <Star className="w-3 h-3" /> Rate
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button className="rounded-full bg-forest-deep text-cream px-5 py-2 text-xs font-semibold">Track order</button>
            <button className="rounded-full border border-border px-5 py-2 text-xs font-semibold">Reorder</button>
            <button className="rounded-full border border-border px-5 py-2 text-xs font-semibold">Invoice</button>
          </div>
        </div>
      ))}

      {openFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpenFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl text-forest-deep">Rate this product</p>
              <button onClick={() => setOpenFor(null)} className="text-muted-foreground hover:text-forest-deep"><X className="w-5 h-5" /></button>
            </div>
            <div className="mt-5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`w-8 h-8 transition ${n <= rating ? "fill-gold text-gold" : "text-border"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell others what you loved…"
              rows={4}
              className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-forest-deep text-sm"
            />
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setOpenFor(null)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Cancel</button>
              <button
                onClick={() => {
                  if (!text.trim()) { toast.error("Add a short note"); return; }
                  addReview({ orderId: openFor, productSlug: pSlug, user: "Aanya", rating, text: text.trim() });
                  toast.success("Thanks — your review is live");
                  setOpenFor(null);
                }}
                className="rounded-full bg-forest-deep text-cream px-5 py-2.5 text-sm font-semibold hover:bg-forest transition"
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
    Delivered: { icon: Check, cls: "bg-forest-deep text-gold" },
    "Out for delivery": { icon: Truck, cls: "bg-gold text-forest-deep" },
    Processing: { icon: Clock, cls: "bg-muted text-forest-deep" },
  };
  const it = map[status] ?? map.Processing;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${it.cls}`}>
      <it.icon className="w-3.5 h-3.5" /> {status}
    </span>
  );
}

function Addresses() {
  const list = [
    { name: "Home", label: "Aanya Sharma · +91 98765 43210", body: "Flat 402, Aster Residency, Indiranagar, Bengaluru 560038", primary: true },
    { name: "Office", label: "Aanya Sharma · +91 98765 43210", body: "3rd floor, Prestige Tower, MG Road, Bengaluru 560001" },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {list.map((a) => (
        <div key={a.name} className="rounded-2xl border border-border bg-card p-6 relative">
          {a.primary && <span className="absolute top-4 right-4 text-[10px] tracking-widest uppercase text-gold font-semibold">Default</span>}
          <p className="font-display text-2xl text-forest-deep">{a.name}</p>
          <p className="mt-2 text-sm font-semibold">{a.label}</p>
          <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
          <div className="mt-5 flex gap-2">
            <button className="rounded-full bg-muted px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
            <button className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-terracotta"><X className="w-3.5 h-3.5 inline mr-1" /> Remove</button>
          </div>
        </div>
      ))}
      <button className="rounded-2xl border-2 border-dashed border-border p-6 grid place-items-center min-h-[180px] hover:border-forest-deep transition">
        <div className="text-center">
          <div className="w-11 h-11 mx-auto rounded-full bg-forest-deep text-gold grid place-items-center"><Plus /></div>
          <p className="mt-3 font-semibold">Add new address</p>
        </div>
      </button>
    </div>
  );
}

function Wishlist() {
  const { slugs, remove } = useWishlist();
  const items = slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as typeof products;

  if (items.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <Heart className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="mt-3 font-display text-2xl text-forest-deep">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold">Browse the shelf</Link>
      </div>
    );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <div key={p.slug} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
          <img src={p.image} alt={p.name} className="w-20 h-24 object-contain" />
          <div className="flex-1">
            <p className="font-display text-xl text-forest-deep">{p.name}</p>
            <p className="text-sm text-muted-foreground">₹{p.price}</p>
            <div className="mt-4 flex gap-2">
              <Link to="/product/$slug" params={{ slug: p.slug }} className="rounded-full bg-forest-deep text-cream px-4 py-2 text-xs font-semibold">View</Link>
              <button onClick={() => remove(p.slug)} className="rounded-full border border-border px-4 py-2 text-xs font-semibold">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h3 className="font-display text-2xl text-forest-deep">Profile</h3>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Field label="Full name" defaultValue="Aanya Sharma" />
          <Field label="Email" defaultValue="aanya@grams.snack" />
          <Field label="Phone" defaultValue="+91 98765 43210" />
          <Field label="Birthday" defaultValue="12 Aug" />
        </div>
        <button className="mt-6 rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold">Save changes</button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h3 className="font-display text-2xl text-forest-deep">Notifications</h3>
        <div className="mt-5 space-y-3">
          {[
            "Order updates & delivery status",
            "New product drops",
            "Weekly recipe newsletter",
            "Restock alerts on wishlist",
          ].map((n, i) => (
            <label key={n} className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm">{n}</span>
              <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5 accent-forest-deep" />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
        <h3 className="font-display text-2xl text-terracotta">Danger zone</h3>
        <p className="text-sm text-muted-foreground mt-1">Delete your account and all associated data permanently.</p>
        <button className="mt-4 rounded-full border-2 border-terracotta text-terracotta px-5 py-2.5 text-sm font-semibold hover:bg-terracotta hover:text-cream transition">Delete account</button>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-forest-deep" />
    </div>
  );
}
