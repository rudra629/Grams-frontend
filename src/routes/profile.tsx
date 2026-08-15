import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Package, MapPin, Settings, Heart, LogOut, Edit3, Plus, Check, Clock, Truck, X, Star } from "lucide-react";
import { toast } from "sonner";
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
  const { user, ready, logout } = useAuth();
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

  const displayName = user?.first_name || user?.username || user?.email?.split('@')[0] || 'there';

  return (
    <div className="container-x py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold">My Account</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-forest-deep">Hey, {displayName} 👋</h1>
          <p className="mt-2 text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={() => { logout(); toast("Signed out"); navigate({ to: "/", replace: true }); }}
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
  const { token } = useAuth();
  const [stats, setStats] = useState({ orders: 0, spend: 0, addresses: 0 });

  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/profile/stats/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(console.error);
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Stat n={String(stats.orders)} l="Total orders" />
        <Stat n={`₹${stats.spend.toLocaleString()}`} l="Lifetime spend" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => onGo("addresses")} className="text-left rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
          <MapPin className="w-6 h-6 text-gold" />
          <p className="mt-3 font-display text-xl">Delivery addresses</p>
          <p className="text-sm text-muted-foreground">{stats.addresses} saved</p>
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

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl p-6 border border-border bg-card">
      <p className="font-display text-4xl text-forest-deep">{n}</p>
      <p className="text-sm text-muted-foreground mt-1">{l}</p>
    </div>
  );
}

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/profile/orders/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading your orders...</div>;
  if (orders.length === 0) return <div className="text-center py-10 text-muted-foreground">You haven't placed any orders yet.</div>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl text-forest-deep">Order {o.order_id}</p>
              <p className="text-sm text-muted-foreground">Placed on {new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={o.status} />
              <p className="font-display text-2xl">₹{o.total_amount}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button className="rounded-full bg-forest-deep text-cream px-5 py-2 text-xs font-semibold hover:bg-forest transition">Track order</button>
            <button className="rounded-full border border-border px-5 py-2 text-xs font-semibold hover:bg-muted transition">Invoice</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
    Delivered: { icon: Check, cls: "bg-forest-deep text-gold" },
    Shipped: { icon: Truck, cls: "bg-gold text-forest-deep" },
    Processing: { icon: Clock, cls: "bg-muted text-forest-deep" },
    Cancelled: { icon: X, cls: "bg-terracotta/10 text-terracotta" }
  };
  const it = map[status] ?? map.Processing;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${it.cls}`}>
      <it.icon className="w-3.5 h-3.5" /> {status}
    </span>
  );
}

function Addresses() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", phone: "", body: "", label: "Home" });

  const fetchAddresses = () => {
    fetch("http://127.0.0.1:8000/api/profile/addresses/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { setAddresses(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  };

  useEffect(() => { if (token) fetchAddresses(); }, [token]);

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/addresses/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newAddress)
      });
      if (res.ok) {
        toast.success("Address saved!");
        setShowForm(false);
        setNewAddress({ name: "", phone: "", body: "", label: "Home" });
        fetchAddresses();
      }
    } catch (err) { toast.error("Failed to save address"); }
  };

  const deleteAddress = async (id: number) => {
    if (!confirm("Remove this address?")) return;
    await fetch(`http://127.0.0.1:8000/api/profile/addresses/${id}/`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchAddresses();
  };

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading addresses...</div>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-6 relative">
            <p className="font-display text-2xl text-forest-deep">{a.label}</p>
            <p className="mt-2 text-sm font-semibold">{a.name} · {a.phone}</p>
            <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => deleteAddress(a.id)} className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-terracotta hover:bg-terracotta/10 transition"><X className="w-3.5 h-3.5 inline mr-1" /> Remove</button>
            </div>
          </div>
        ))}
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="rounded-2xl border-2 border-dashed border-border p-6 grid place-items-center min-h-[180px] hover:border-forest-deep transition">
            <div className="text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-forest-deep text-gold grid place-items-center"><Plus /></div>
              <p className="mt-3 font-semibold">Add new address</p>
            </div>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={saveAddress} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display text-2xl text-forest-deep">New Address</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-terracotta"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full Name" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
            <Field label="Phone Number" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
            <Field label="Label (e.g., Home, Work)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} />
          </div>
          <Field label="Full Address (Street, City, Pincode)" required value={newAddress.body} onChange={e => setNewAddress({...newAddress, body: e.target.value})} />
          <button type="submit" className="rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold hover:bg-forest transition">Save Address</button>
        </form>
      )}
    </div>
  );
}

function Wishlist() {
  const { slugs, remove } = useWishlist();
  const { allProducts } = useSite();
  const items = slugs.map((s) => allProducts.find((p) => p.slug === s)).filter(Boolean);

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
        <div key={p!.slug} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
          <img src={p!.image} alt={p!.name} className="w-full h-32 object-contain bg-muted/30 rounded-lg" />
          <div className="flex-1">
            <p className="font-display text-xl text-forest-deep">{p!.name}</p>
            <p className="text-sm text-muted-foreground">₹{p!.price}</p>
            <div className="mt-4 flex gap-2">
              <Link to="/product/$slug" params={{ slug: p!.slug }} className="flex-1 text-center rounded-full bg-forest-deep text-cream px-4 py-2 text-xs font-semibold">View</Link>
              <button onClick={() => remove(p!.slug)} className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-semibold">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h3 className="font-display text-2xl text-forest-deep">Profile Details</h3>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Field label="Full name" defaultValue={user?.first_name || ""} disabled />
          <Field label="Email" defaultValue={user?.email || ""} disabled />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Account details are currently locked for security.</p>
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
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-forest-deep disabled:opacity-60" />
    </div>
  );
}