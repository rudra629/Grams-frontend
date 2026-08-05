import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Package, IndianRupee, TrendingUp, Users, Search, Plus, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Boxes, ShoppingCart, BarChart3, Trash2, Settings2, Megaphone, X, Briefcase, FileText, Download, Gift, Star, EyeOff, Eye, Type, TicketPercent, Power,
} from "lucide-react";
import { toast } from "sonner";
import { products as baseProducts, type Product } from "@/lib/products";
import { useSite, COPY_FIELDS, VALUE_PROP_ICONS, type Order, type GiftCategory, type SiteStat, type MonthPick, type ContactInfo, type Coupon, type ValueProp, type ValuePropIcon } from "@/lib/site-store";
import { AdminAuthGate } from "@/components/site/AdminAuthGate";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Grams" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminAuthGate>
      <Admin />
    </AdminAuthGate>
  ),
});


type Section = "dashboard" | "products" | "add" | "orders" | "customers" | "careers" | "gifting" | "reviews" | "coupons" | "content" | "settings";


function Admin() {
  const [section, setSection] = useState<Section>("dashboard");

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container-x py-6 md:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-6 md:mb-8 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Grams · Admin</p>
            <h1 className="truncate font-display text-3xl md:text-5xl text-forest-deep">Command Center</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search…" className="bg-transparent outline-none text-sm w-40" />
            </div>
            <div className="w-10 h-10 rounded-full bg-forest-deep text-gold grid place-items-center font-semibold text-sm shrink-0">AS</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {([
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "products", label: "Products", icon: Boxes },
            { id: "add", label: "Add Product", icon: Plus },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "customers", label: "Customers", icon: Users },
            { id: "gifting", label: "Gifting Stories", icon: Gift },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "coupons", label: "Coupons", icon: TicketPercent },
            { id: "careers", label: "Careers", icon: Briefcase },
            { id: "content", label: "Content & Copy", icon: Type },
            { id: "settings", label: "Site Settings", icon: Settings2 },

          ] as { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm font-medium transition ${section === t.id ? "bg-forest-deep text-cream" : "bg-card border border-border hover:bg-muted"}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {section === "dashboard" && <Dashboard />}
        {section === "products" && <ProductsTable />}
        {section === "add" && <AddProductForm />}
        {section === "orders" && <OrdersTable />}
        {section === "customers" && <CustomersTable />}
        {section === "gifting" && <GiftingManager />}
        {section === "reviews" && <ReviewsManager />}
        {section === "coupons" && <CouponsManager />}
        {section === "careers" && <CareersTable />}
        {section === "content" && <ContentManager />}
        {section === "settings" && <SiteSettings />}

      </div>
    </div>
  );
}


function Dashboard() {
  const { orders } = useSite();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KPI title="Revenue" value="₹4,82,340" delta="+12.4%" up icon={IndianRupee} />
        <KPI title="Orders" value={String(orders.length + 1279)} delta="+8.1%" up icon={Package} />
        <KPI title="New customers" value="342" delta="+22%" up icon={Users} />
        <KPI title="Refunds" value="₹4,120" delta="−2.3%" up={false} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-xl md:text-2xl text-forest-deep">Sales this month</p>
              <p className="text-sm text-muted-foreground">₹4,82,340 · +12.4% vs last month</p>
            </div>
            <select className="rounded-full bg-muted border border-border px-4 py-2 text-sm">
              <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option>
            </select>
          </div>
          <MiniChart />
        </div>

        <div className="rounded-2xl bg-forest-deep text-cream p-6">
          <p className="font-display text-2xl">Top products</p>
          <div className="mt-4 space-y-3">
            {baseProducts.slice(0, 5).map((p, i) => (
              <div key={p.slug} className="flex items-center gap-3">
                <span className="w-6 text-gold font-display text-lg shrink-0">0{i + 1}</span>
                <img src={p.image} alt="" className="w-9 h-11 object-contain shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-cream/60">{Math.round(400 - i * 47)} sold</p>
                </div>
                <p className="text-sm text-gold font-semibold shrink-0">₹{(p.price * (400 - i * 47)).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-xl md:text-2xl text-forest-deep">Recent orders</p>
        </div>
        <OrdersTable compact />
      </div>
    </div>
  );
}

function KPI({ title, value, delta, up, icon: Icon }: { title: string; value: string; delta: string; up: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-forest-deep text-gold grid place-items-center shrink-0"><Icon className="w-4 h-4" /></div>
      </div>
      <p className="mt-3 font-display text-2xl md:text-3xl text-forest-deep truncate">{value}</p>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-forest" : "text-terracotta"}`}>
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {delta}
      </div>
    </div>
  );
}

function MiniChart() {
  const bars = [42, 58, 46, 72, 60, 88, 74, 92, 80, 96, 84, 108];
  const max = Math.max(...bars);
  return (
    <div className="mt-6 flex items-end gap-1.5 md:gap-2 h-32 md:h-40">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-forest-deep to-gold" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function ProductsTable() {
  const { extraProducts, removeProduct } = useSite();
  const rows = [...extraProducts, ...baseProducts];
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="flex items-center justify-between p-5 md:p-6 flex-wrap gap-3">
        <div>
          <p className="font-display text-xl md:text-2xl text-forest-deep">Products</p>
          <p className="text-sm text-muted-foreground">{rows.length} SKUs in catalog</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const stock = 100 - i * 6;
              const isCustom = extraProducts.some((x) => x.slug === p.slug);
              return (
                <tr key={p.slug} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-12 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate flex items-center gap-2">
                          {p.name}
                          {isCustom && <span className="text-[9px] font-bold uppercase tracking-widest bg-gold text-forest-deep px-1.5 py-0.5 rounded">Custom</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 font-semibold">₹{p.price}</td>
                  <td className="p-4">
                    <span className={stock < 30 ? "text-terracotta font-semibold" : "text-muted-foreground"}>{stock} units</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-deep text-gold">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    {isCustom ? (
                      <button onClick={() => { removeProduct(p.slug); toast.success("Product removed"); }} className="text-muted-foreground hover:text-terracotta">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <MoreHorizontal className="w-4 h-4 inline text-muted-foreground" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddProductForm() {
  const { addProduct } = useSite();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Nuts");
  const [price, setPrice] = useState(0);
  const [compareAt, setCompareAt] = useState(0);
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(100);
  const [origin, setOrigin] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [badgeInput, setBadgeInput] = useState("");
  const [weights, setWeights] = useState([{ label: "250g", value: "250", price: 0 }]);
  const [slides, setSlides] = useState<{ image: string; title: string; description: string }[]>([]);
  const [nutrition, setNutrition] = useState([
    { label: "Protein", value: "" },
    { label: "Fibre", value: "" },
    { label: "Omega-3", value: "" },
    { label: "Energy", value: "" },
  ]);


  const addBadge = () => {
    if (badgeInput.trim()) { setBadges([...badges, badgeInput.trim()]); setBadgeInput(""); }
  };
  const rmBadge = (i: number) => setBadges(badges.filter((_, x) => x !== i));

  const addWeight = () => setWeights([...weights, { label: "", value: "", price: 0 }]);
  const rmWeight = (i: number) => setWeights(weights.filter((_, x) => x !== i));

  const handleImage = (file: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  };

  const addSlide = () => setSlides([...slides, { image: "", title: "", description: "" }]);
  const rmSlide = (i: number) => setSlides(slides.filter((_, x) => x !== i));
  const handleSlideImage = (i: number, file: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setSlides((prev) => prev.map((s, ix) => ix === i ? { ...s, image: String(r.result) } : s));
    r.readAsDataURL(file);
  };

  const submit = () => {
    if (!name || !price || !image) { toast.error("Name, price and image are required"); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
    const cleanSlides = slides.filter((s) => s.image && s.title);
    const product: Product = {
      slug, name, tagline: tagline || name, category, price,
      compareAt: compareAt > price ? compareAt : undefined,
      rating, reviews, image,
      badges, description: description || tagline, origin: origin || "India",
      nutrition: nutrition.filter((n) => n.value),
      weights: weights.filter((w) => w.label && w.price > 0),
      bestseller, newArrival,
      slides: cleanSlides.length > 0 ? cleanSlides : undefined,
    };
    if (product.weights.length === 0) { toast.error("Add at least one weight/price"); return; }
    addProduct(product);
    toast.success(`${name} added to catalog`);
    // Reset
    setName(""); setTagline(""); setPrice(0); setCompareAt(0); setOrigin(""); setImage("");
    setDescription(""); setBadges([]); setWeights([{ label: "250g", value: "250", price: 0 }]);
    setSlides([]); setBestseller(false); setNewArrival(false);
  };


  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-6">
      <div>
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Add a new product</p>
        <p className="text-sm text-muted-foreground">All fields flow directly into the shop and product detail page.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Product name *"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Almonds Premium" /></Field>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value as Product["category"])} className={inputCls}>
            <option>Nuts</option><option>Seeds</option><option>Dried Fruits</option>
          </select>
        </Field>
        <Field label="Subtitle / Tagline" full><input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} placeholder="Sun-cured Californian almonds, hand-selected" /></Field>
        <Field label="Final price (₹) *"><input type="number" value={price || ""} onChange={(e) => setPrice(+e.target.value)} className={inputCls} /></Field>
        <Field label="Cancelled / MRP price (₹)"><input type="number" value={compareAt || ""} onChange={(e) => setCompareAt(+e.target.value)} className={inputCls} placeholder="Optional strike-through" /></Field>
        <Field label="Rating (0-5)"><input type="number" step="0.1" value={rating} onChange={(e) => setRating(+e.target.value)} className={inputCls} /></Field>
        <Field label="Number of reviews"><input type="number" value={reviews} onChange={(e) => setReviews(+e.target.value)} className={inputCls} /></Field>
        <Field label="Origin"><input value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputCls} placeholder="California, USA" /></Field>
        <Field label="Product image *" full>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0] ?? null)} className="text-sm" />
            {image && <img src={image} alt="" className="w-16 h-16 object-contain rounded-lg border border-border" />}
          </div>
        </Field>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Badges (Protein Rich, Omega-3, …)</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs bg-muted rounded-full px-3 py-1.5 font-medium">
              ✦ {b}
              <button onClick={() => rmBadge(i)} className="text-muted-foreground hover:text-terracotta"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={badgeInput} onChange={(e) => setBadgeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())} placeholder="Protein Rich" className={inputCls} />
          <button onClick={addBadge} className="rounded-xl bg-forest-deep text-cream px-4 text-sm font-semibold shrink-0">Add</button>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} /> Bestseller</label>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} /> New arrival</label>
      </div>

      {/* Weights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Weight variants & pricing</p>
          <button onClick={addWeight} className="text-xs font-semibold text-forest-deep hover:text-terracotta inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add row</button>
        </div>
        <div className="space-y-2">
          {weights.map((w, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input value={w.label} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, label: e.target.value } : x))} placeholder="250g" className={inputCls} />
              <input value={w.value} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, value: e.target.value } : x))} placeholder="250" className={inputCls} />
              <input type="number" value={w.price || ""} onChange={(e) => setWeights(weights.map((x, ix) => ix === i ? { ...x, price: +e.target.value } : x))} placeholder="Price ₹" className={inputCls} />
              <button onClick={() => rmWeight(i)} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Nutrition (Protein, Fibre, Omega, Energy…)</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {nutrition.map((n, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-2">
              <input value={n.label} onChange={(e) => setNutrition(nutrition.map((x, ix) => ix === i ? { ...x, label: e.target.value } : x))} className={inputCls} />
              <input value={n.value} onChange={(e) => setNutrition(nutrition.map((x, ix) => ix === i ? { ...x, value: e.target.value } : x))} placeholder="15g / 100g" className={inputCls} />
            </div>
          ))}
        </div>
        <button onClick={() => setNutrition([...nutrition, { label: "", value: "" }])} className="mt-2 text-xs font-semibold text-forest-deep hover:text-terracotta inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add nutrient</button>
      </div>

      {/* Description */}
      <Field label="The Story / Description" full>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputCls} placeholder="Slow-cured, hand-picked and packed within 14 days of harvest…" />
      </Field>

      {/* Detail slideshow */}
      <div className="rounded-2xl border border-dashed border-border p-4 md:p-5">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Detail page slideshow</p>
            <p className="text-[11px] text-muted-foreground/80">Auto-swipes on the product page. Each slide has its own image, title & description. Origin stays fixed. Leave empty to just show the main image + name + tagline.</p>
          </div>
          <button onClick={addSlide} className="text-xs font-semibold text-forest-deep hover:text-terracotta inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add slide</button>
        </div>
        <div className="mt-3 space-y-3">
          {slides.length === 0 && <p className="text-xs text-muted-foreground">No extra slides yet.</p>}
          {slides.map((s, i) => (
            <div key={i} className="grid md:grid-cols-[96px_1fr_auto] gap-3 items-start p-3 rounded-xl bg-muted/40 border border-border/60">
              <div className="flex flex-col gap-2">
                {s.image ? (
                  <img src={s.image} alt="" className="w-24 h-24 object-contain rounded-lg border border-border bg-cream" />
                ) : (
                  <div className="w-24 h-24 rounded-lg border border-dashed border-border grid place-items-center text-[10px] text-muted-foreground">No image</div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleSlideImage(i, e.target.files?.[0] ?? null)} className="text-[11px]" />
              </div>
              <div className="space-y-2">
                <input value={s.title} onChange={(e) => setSlides(slides.map((x, ix) => ix === i ? { ...x, title: e.target.value } : x))} placeholder="Slide title (e.g. Sun-cured whole kernels)" className={inputCls} />
                <textarea value={s.description} onChange={(e) => setSlides(slides.map((x, ix) => ix === i ? { ...x, description: e.target.value } : x))} rows={3} placeholder="Slide description shown next to this image." className={inputCls} />
              </div>
              <button onClick={() => rmSlide(i)} className="w-10 h-10 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={submit} className="rounded-full bg-forest-deep text-cream px-7 py-3.5 text-sm font-semibold hover:bg-forest transition inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Save product
        </button>
      </div>
    </div>
  );
}


const inputCls = "rounded-xl border border-border bg-cream px-4 py-3 text-sm outline-none focus:border-forest-deep w-full";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col ${full ? "md:col-span-2" : ""}`}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function OrdersTable({ compact }: { compact?: boolean }) {
  const { orders, updateOrderStatus } = useSite();
  const list = compact ? orders.slice(0, 6) : orders;
  const statuses: Order["status"][] = ["Processing", "Shipped", "Delivered", "Cancelled"];
  return (
    <div className={compact ? "" : "rounded-2xl bg-card border border-border overflow-hidden"}>
      {!compact && (
        <div className="p-5 md:p-6">
          <p className="font-display text-xl md:text-2xl text-forest-deep">Orders</p>
          <p className="text-sm text-muted-foreground">{orders.length} total · change status inline</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4 font-semibold">{o.id}</td>
                <td className="p-4">
                  <p className="font-semibold">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </td>
                <td className="p-4 font-semibold">₹{o.total}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => { updateOrderStatus(o.id, e.target.value as Order["status"]); toast.success(`${o.id} → ${e.target.value}`); }}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                      o.status === "Delivered" ? "bg-forest-deep text-gold" :
                      o.status === "Shipped" ? "bg-gold text-forest-deep" :
                      o.status === "Cancelled" ? "bg-destructive/10 text-terracotta" :
                      "bg-muted text-forest-deep"
                    }`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-muted-foreground">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersTable() {
  const customers = [
    { name: "Aanya Sharma", email: "aanya@grams.snack", orders: 12, spend: 8240, tier: "Silver" },
    { name: "Kabir Singh", email: "kabir@x.com", orders: 8, spend: 5199, tier: "Silver" },
    { name: "Meera Patel", email: "meera@x.com", orders: 24, spend: 18500, tier: "Gold" },
    { name: "Ishaan Rao", email: "ishaan@x.com", orders: 4, spend: 1849, tier: "Bronze" },
    { name: "Riya Mehta", email: "riya@x.com", orders: 15, spend: 11200, tier: "Gold" },
  ];
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-5 md:p-6">
        <p className="font-display text-xl md:text-2xl text-forest-deep">Customers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Lifetime spend</th>
              <th className="text-left p-4">Tier</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-deep text-gold grid place-items-center text-xs font-semibold shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-semibold">{c.orders}</td>
                <td className="p-4 font-semibold">₹{c.spend.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    c.tier === "Gold" ? "bg-gold text-forest-deep" :
                    c.tier === "Silver" ? "bg-muted text-forest-deep" :
                    "bg-terracotta/20 text-terracotta"
                  }`}>{c.tier}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentManager() {
  const { copy, setCopy, stats, setStats, monthPicks, setMonthPicks, contact, setContact, allProducts, valueProps, setValueProps } = useSite();
  const [vp, setVp] = useState<ValueProp[]>(valueProps);
  useEffect(() => { setVp(valueProps); }, [valueProps]);
  const [c, setC] = useState(copy);
  const [s, setS] = useState<SiteStat[]>(stats);
  const [m, setM] = useState<MonthPick[]>(monthPicks);
  const [ct, setCt] = useState<ContactInfo>(contact);

  useEffect(() => { setC(copy); }, [copy]);
  useEffect(() => { setS(stats); }, [stats]);
  useEffect(() => { setM(monthPicks); }, [monthPicks]);
  useEffect(() => { setCt(contact); }, [contact]);

  const groups = Array.from(new Set(COPY_FIELDS.map((f) => f.group)));
  const lines = (v: string[]) => v.join("\n");
  const parse = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Quality / value prop cards */}
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-4">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Home quality cards</p>
        <p className="text-sm text-muted-foreground -mt-3">The four feature cards under the hero (Farm to pouch, Small-batch craft, etc).</p>
        {vp.map((v, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="grid md:grid-cols-[150px_1fr_auto] gap-3">
              <Field label="Icon">
                <select value={v.icon} onChange={(e) => setVp(vp.map((x, ix) => ix === i ? { ...x, icon: e.target.value as ValuePropIcon } : x))} className={inputCls}>
                  {VALUE_PROP_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
              <Field label="Title"><input value={v.title} onChange={(e) => setVp(vp.map((x, ix) => ix === i ? { ...x, title: e.target.value } : x))} className={inputCls} placeholder="Farm to pouch" /></Field>
              <div className="flex items-end">
                <button onClick={() => setVp(vp.filter((_, ix) => ix !== i))} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <Field label="Description" full>
              <textarea rows={2} value={v.desc} onChange={(e) => setVp(vp.map((x, ix) => ix === i ? { ...x, desc: e.target.value } : x))} className={inputCls} />
            </Field>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={() => setVp([...vp, { icon: "leaf", title: "", desc: "" }])} className="rounded-xl bg-muted border border-border px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add card</button>
          <button onClick={() => { setValueProps(vp.filter((x) => x.title && x.desc)); toast.success("Quality cards updated"); }} className="rounded-full bg-forest-deep text-cream px-6 py-2.5 text-sm font-semibold">Save cards</button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-4">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Home stats strip</p>
        <p className="text-sm text-muted-foreground -mt-3">The big numbers shown in the hero and the dark strip.</p>
        {s.map((st, i) => (
          <div key={i} className="grid grid-cols-[110px_1fr_auto] gap-2">
            <input value={st.n} onChange={(e) => setS(s.map((x, ix) => ix === i ? { ...x, n: e.target.value } : x))} className={inputCls} placeholder="12+" />
            <input value={st.l} onChange={(e) => setS(s.map((x, ix) => ix === i ? { ...x, l: e.target.value } : x))} className={inputCls} placeholder="Global origins" />
            <button onClick={() => setS(s.filter((_, ix) => ix !== i))} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={() => setS([...s, { n: "", l: "" }])} className="rounded-xl bg-muted border border-border px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add stat</button>
          <button onClick={() => { setStats(s.filter((x) => x.n && x.l)); toast.success("Stats updated"); }} className="rounded-full bg-forest-deep text-cream px-6 py-2.5 text-sm font-semibold">Save stats</button>
        </div>
      </div>

      {/* Product of the month */}
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-5">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Product of the month</p>
        <p className="text-sm text-muted-foreground -mt-3">One feature block each for Nuts, Seeds and Dry fruits.</p>
        {m.map((p, i) => (
          <div key={p.key} className="rounded-xl border border-border p-4 space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold">{p.key}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Product">
                <select value={p.slug} onChange={(e) => setM(m.map((x, ix) => ix === i ? { ...x, slug: e.target.value } : x))} className={inputCls}>
                  {allProducts.map((pr) => <option key={pr.slug} value={pr.slug}>{pr.name}</option>)}
                </select>
              </Field>
              <Field label="Eyebrow"><input value={p.eyebrow} onChange={(e) => setM(m.map((x, ix) => ix === i ? { ...x, eyebrow: e.target.value } : x))} className={inputCls} /></Field>
              <Field label="Title line"><input value={p.title} onChange={(e) => setM(m.map((x, ix) => ix === i ? { ...x, title: e.target.value } : x))} className={inputCls} /></Field>
              <Field label="Italic line"><input value={p.italic} onChange={(e) => setM(m.map((x, ix) => ix === i ? { ...x, italic: e.target.value } : x))} className={inputCls} /></Field>
              <Field label="Description" full><textarea rows={2} value={p.desc} onChange={(e) => setM(m.map((x, ix) => ix === i ? { ...x, desc: e.target.value } : x))} className={inputCls} /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => { setMonthPicks(m); toast.success("Product of the month updated"); }} className="rounded-full bg-forest-deep text-cream px-6 py-2.5 text-sm font-semibold">Save picks</button>
      </div>

      {/* Titles & subtitles */}
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-5">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Titles & subtitles</p>
        <p className="text-sm text-muted-foreground -mt-3">Section headings across the site, including the chatbot label.</p>
        {groups.map((g) => (
          <div key={g} className="space-y-3">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold">{g}</p>
            {COPY_FIELDS.filter((f) => f.group === g).map((f) => (
              <Field key={f.key} label={f.label} full>
                <input value={c[f.key] ?? ""} onChange={(e) => setC({ ...c, [f.key]: e.target.value })} className={inputCls} />
              </Field>
            ))}
          </div>
        ))}
        <button onClick={() => { setCopy(c); toast.success("Copy updated"); }} className="rounded-full bg-forest-deep text-cream px-6 py-2.5 text-sm font-semibold">Save copy</button>
      </div>

      {/* Contact details */}
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-4">
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Contact details</p>
        <p className="text-sm text-muted-foreground -mt-3">One line per row — shown on the Contact page.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Emails"><textarea rows={3} value={lines(ct.emails)} onChange={(e) => setCt({ ...ct, emails: e.target.value.split("\n") })} className={inputCls} /></Field>
          <Field label="Phone / hours"><textarea rows={3} value={lines(ct.phones)} onChange={(e) => setCt({ ...ct, phones: e.target.value.split("\n") })} className={inputCls} /></Field>
          <Field label="Address"><textarea rows={3} value={lines(ct.address)} onChange={(e) => setCt({ ...ct, address: e.target.value.split("\n") })} className={inputCls} /></Field>
          <Field label="Response time"><textarea rows={3} value={lines(ct.hours)} onChange={(e) => setCt({ ...ct, hours: e.target.value.split("\n") })} className={inputCls} /></Field>
        </div>
        <button
          onClick={() => {
            setContact({ emails: parse(ct.emails.join("\n")), phones: parse(ct.phones.join("\n")), address: parse(ct.address.join("\n")), hours: parse(ct.hours.join("\n")) });
            toast.success("Contact details updated");
          }}
          className="rounded-full bg-forest-deep text-cream px-6 py-2.5 text-sm font-semibold"
        >
          Save contact
        </button>
      </div>
    </div>
  );
}


function SiteSettings() {
  const { bannerWords, setBannerWords } = useSite();
  const [words, setWords] = useState<string[]>(bannerWords);
  const [draft, setDraft] = useState("");

  const save = () => { setBannerWords(words); toast.success("Home banner updated"); };
  const add = () => { if (draft.trim()) { setWords([...words, draft.trim()]); setDraft(""); } };
  const rm = (i: number) => setWords(words.filter((_, x) => x !== i));

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-forest-deep" />
        <p className="font-display text-2xl md:text-3xl text-forest-deep">Home yellow banner</p>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">The scrolling gold marquee under the hero. Edit each phrase — they cycle in order.</p>

      {/* Preview */}
      <div className="bg-gold text-forest-deep py-3 overflow-hidden rounded-xl">
        <div className="flex whitespace-nowrap marquee-track font-display text-xl italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {words.map((w, j) => (<span key={j} className="flex items-center gap-10">{w} <span className="text-forest-deep/40">✦</span></span>))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {words.map((w, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
            <input value={w} onChange={(e) => setWords(words.map((x, ix) => ix === i ? e.target.value : x))} className={inputCls} />
            <button onClick={() => rm(i)} className="w-11 h-11 grid place-items-center border border-border rounded-xl hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="New phrase…" className={inputCls} />
        <button onClick={add} className="rounded-xl bg-muted border border-border px-4 text-sm font-semibold shrink-0 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <button onClick={save} className="rounded-full bg-forest-deep text-cream px-7 py-3.5 text-sm font-semibold hover:bg-forest transition">
        Save banner
      </button>
    </div>
  );
}

function CareersTable() {
  const { applications, removeApplication } = useSite();

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display text-2xl md:text-3xl text-forest-deep">Job applications</p>
          <p className="text-sm text-muted-foreground">{applications.length} submission{applications.length === 1 ? "" : "s"} from the Careers page.</p>
        </div>
        <div className="hidden md:flex w-10 h-10 rounded-full bg-forest-deep/10 items-center justify-center">
          <Briefcase className="w-5 h-5 text-forest-deep" />
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl bg-muted/50 border border-dashed border-border p-10 text-center">
          <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-forest-deep">No applications yet</p>
          <p className="text-sm text-muted-foreground mt-1">Submissions from /careers will land here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="rounded-xl bg-muted/40 border border-border p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-semibold text-forest-deep truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <a href={`mailto:${a.email}`} className="text-sm text-forest-deep/80 hover:text-forest-deep transition break-all">{a.email}</a>
                {a.message && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.message}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={a.resumeDataUrl}
                  download={a.resumeName}
                  className="inline-flex items-center gap-2 rounded-full bg-forest-deep text-cream px-4 py-2 text-xs font-semibold hover:bg-forest transition"
                >
                  <Download className="w-3.5 h-3.5" /> Resume
                </a>
                <a
                  href={a.resumeDataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 text-xs font-semibold hover:bg-card transition"
                >
                  <FileText className="w-3.5 h-3.5" /> View
                </a>
                <button
                  onClick={() => { if (confirm("Remove this application?")) removeApplication(a.id); }}
                  className="w-9 h-9 rounded-full bg-muted border border-border hover:bg-destructive/10 hover:text-destructive grid place-items-center transition"
                  aria-label="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GiftingManager() {
  const { giftArticles, addGiftArticle, updateGiftArticle, removeGiftArticle } = useSite();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<GiftCategory>("Corporate");
  const [author, setAuthor] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const MAX = 5;

  const onImages = (files: FileList | null) => {
    if (!files || !files.length) return;
    const room = MAX - images.length;
    if (room <= 0) { toast.error("Max 5 images per article"); return; }
    const list = Array.from(files).slice(0, room);
    if (files.length > room) toast.error(`Only ${room} more image${room === 1 ? "" : "s"} allowed`);
    list.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setImages((prev) => (prev.length >= MAX ? prev : [...prev, String(r.result)]));
      r.readAsDataURL(f);
    });
  };

  const reset = () => {
    setTitle(""); setExcerpt(""); setBody(""); setAuthor(""); setImages([]); setCategory("Corporate"); setEditing(null);
  };

  const submit = () => {
    if (!title || !excerpt || !body) { toast.error("Title, excerpt and story body are required"); return; }
    if (editing) {
      updateGiftArticle(editing, { title, excerpt, body, category, author: author || undefined, images });
      toast.success("Article updated");
    } else {
      addGiftArticle({ title, excerpt, body, category, author: author || undefined, images });
      toast.success(`"${title}" published to Gifting`);
    }
    reset();
  };

  const startEdit = (id: string) => {
    const a = giftArticles.find((x) => x.id === id);
    if (!a) return;
    setEditing(a.id); setTitle(a.title); setExcerpt(a.excerpt); setBody(a.body);
    setCategory(a.category); setAuthor(a.author ?? ""); setImages(a.images);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border border-border p-5 md:p-8 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="font-display text-2xl md:text-3xl text-forest-deep">
            {editing ? "Edit gifting article" : "Publish a gifting article"}
          </p>
          {editing && (
            <button onClick={reset} className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-muted transition">
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Article title *" full><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="500 boxes, 3 cities, one very long night" /></Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as GiftCategory)} className={inputCls}>
              <option>Corporate</option><option>Birthday</option><option>Festive</option>
            </select>
          </Field>
          <Field label="Author / byline"><input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} placeholder="Team Grams" /></Field>
          <Field label="Excerpt (shown on the card) *" full>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className={inputCls} placeholder="First few lines shown in the 2x2 grid…" />
          </Field>
          <Field label="Full story (one paragraph per line) *" full>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={inputCls} placeholder="The full article, shown when a visitor opens the story." />
          </Field>
          <Field label={`Images (max ${MAX}) — first one is the cover`} full>
            <div className="space-y-3">
              <input type="file" accept="image/*" multiple onChange={(e) => { onImages(e.target.files); e.currentTarget.value = ""; }} className="text-sm" disabled={images.length >= MAX} />
              <div className="flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg border border-border grid place-items-center bg-muted/40">
                    <img src={src} alt="" className="max-w-full max-h-full object-contain" />
                    {i === 0 && <span className="absolute -top-2 -left-2 text-[9px] uppercase tracking-wider bg-gold text-forest-deep rounded-full px-1.5 py-0.5">Cover</span>}
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, n) => n !== i))}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-card border border-border grid place-items-center hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length === 0 && <p className="text-xs text-muted-foreground">No images yet — the card will show a placeholder.</p>}
              </div>
            </div>
          </Field>
        </div>
        <button onClick={submit} className="rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold hover:bg-forest transition">
          {editing ? "Save changes" : "Publish article"}
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
        <p className="font-display text-2xl text-forest-deep mb-4">Live articles ({giftArticles.length})</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {giftArticles.map((a) => (
            <div key={a.id} className="rounded-xl border border-border p-4 flex gap-3">
              <div className="w-20 h-24 shrink-0 rounded-lg bg-muted/40 grid place-items-center overflow-hidden">
                {a.images[0] ? <img src={a.images[0]} alt="" className="max-w-full max-h-full object-contain" /> : <Gift className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest uppercase text-gold">{a.category} · {a.date}</p>
                <p className="font-semibold text-forest-deep line-clamp-2">{a.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.excerpt}</p>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={a.category}
                    onChange={(e) => updateGiftArticle(a.id, { category: e.target.value as GiftCategory })}
                    className="text-[11px] rounded-full bg-muted px-2 py-1 border border-border"
                  >
                    <option>Corporate</option><option>Birthday</option><option>Festive</option>
                  </select>
                  <button onClick={() => startEdit(a.id)} className="text-[11px] rounded-full border border-border px-2.5 py-1 hover:bg-muted transition">Edit</button>
                  <button onClick={() => { if (confirm("Delete article?")) removeGiftArticle(a.id); }} className="text-muted-foreground hover:text-terracotta"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{a.images.length} image{a.images.length === 1 ? "" : "s"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManualReviewComposer() {
  const { addReview, allProducts } = useSite();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    addReview({
      productSlug: slug || allProducts[0]?.slug || "",
      orderId: "MANUAL",
      user: name.trim(),
      rating,
      text: text.trim(),
    });
    setName(""); setText(""); setRating(5);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl border border-dashed border-border bg-muted/40 p-5 opacity-70 hover:opacity-100 transition">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] rounded-full border border-border px-2 py-0.5 text-muted-foreground">Temporary</span>
        <p className="font-display text-xl text-forest-deep">Add a review manually</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className={inputCls} />
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls}>
          <option value="">Select product</option>
          {allProducts.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-cream px-4 py-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star`}>
              <Star className={`w-5 h-5 text-gold ${n <= rating ? "fill-gold" : ""}`} />
            </button>
          ))}
        </div>
        <button onClick={submit} className="rounded-xl bg-gold text-forest-deep px-5 py-3 text-sm font-bold hover:bg-cream transition">
          {done ? "Added" : "Add review"}
        </button>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="Comment" className={`${inputCls} mt-3`} />
    </div>
  );
}

function ReviewsManager() {
  const { reviews, allProducts, toggleReviewHidden, removeReview } = useSite();
  const nameOf = (slug: string) => allProducts.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display text-2xl md:text-3xl text-forest-deep">Ratings & Reviews</p>
          <p className="text-sm text-muted-foreground">{reviews.length} submitted from customers post-delivery.</p>
        </div>
      </div>
      <ManualReviewComposer />

      {reviews.length === 0 ? (
        <div className="rounded-xl bg-muted/50 border border-dashed border-border p-10 text-center">
          <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-forest-deep">No reviews yet</p>
          <p className="text-sm text-muted-foreground mt-1">Reviews submitted after delivery will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className={`rounded-xl border p-4 flex flex-col md:flex-row md:items-start gap-3 ${r.hidden ? "bg-muted/40 border-dashed" : "bg-card border-border"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold">{nameOf(r.productSlug)}</span>
                  <span className="text-xs text-muted-foreground">· {r.date}</span>
                  <span className="text-xs text-muted-foreground">· Order {r.orderId}</span>
                  {r.hidden && <span className="text-[10px] uppercase tracking-widest text-terracotta">Hidden</span>}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-gold" : ""}`} />)}
                  <span className="ml-2 text-sm font-semibold text-forest-deep">{r.user}</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleReviewHidden(r.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1.5 text-xs font-semibold hover:bg-card transition"
                >
                  {r.hidden ? <><Eye className="w-3.5 h-3.5" /> Show</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
                </button>
                <button
                  onClick={() => { if (confirm("Delete review?")) removeReview(r.id); }}
                  className="w-9 h-9 rounded-full bg-muted border border-border hover:bg-destructive/10 hover:text-destructive grid place-items-center transition"
                  aria-label="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function CouponsManager() {
  const { coupons, addCoupon, updateCoupon, removeCoupon } = useSite();
  const empty = { code: "", type: "percent" as Coupon["type"], value: 10, minOrder: 0, maxDiscount: "", expiry: "", usageLimit: "", description: "", active: true };
  const [f, setF] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.code.trim()) return toast.error("Coupon code is required");
    if (!f.value || f.value <= 0) return toast.error("Discount value must be greater than 0");
    if (f.type === "percent" && f.value > 100) return toast.error("Percentage cannot exceed 100");
    const payload = {
      code: f.code.toUpperCase().trim(),
      type: f.type,
      value: Number(f.value),
      minOrder: Number(f.minOrder) || 0,
      maxDiscount: f.maxDiscount ? Number(f.maxDiscount) : undefined,
      expiry: f.expiry || undefined,
      usageLimit: f.usageLimit ? Number(f.usageLimit) : undefined,
      description: f.description.trim() || undefined,
      active: f.active,
    };
    if (editing) { updateCoupon(editing, payload); toast.success(`${payload.code} updated`); }
    else { addCoupon(payload); toast.success(`${payload.code} created`); }
    setF(empty); setEditing(null);
  };

  const edit = (c: Coupon) => {
    setEditing(c.id);
    setF({
      code: c.code, type: c.type, value: c.value, minOrder: c.minOrder,
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
      expiry: c.expiry ?? "", usageLimit: c.usageLimit ? String(c.usageLimit) : "",
      description: c.description ?? "", active: c.active,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 items-start">
      <form onSubmit={submit} className="rounded-2xl bg-card border border-border p-5 md:p-7 space-y-5">
        <div className="flex items-center gap-2">
          <TicketPercent className="w-5 h-5 text-forest-deep" />
          <p className="font-display text-2xl text-forest-deep">{editing ? "Edit coupon" : "Create coupon"}</p>
        </div>

        <Field label="Coupon code" full>
          <input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="CRUNCH20" className={`${inputCls} font-mono tracking-widest uppercase`} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as Coupon["type"] })} className={inputCls}>
              <option value="percent">Percentage %</option>
              <option value="flat">Flat ₹ off</option>
            </select>
          </Field>
          <Field label={f.type === "percent" ? "Discount %" : "Discount ₹"}>
            <input type="number" min={1} value={f.value} onChange={(e) => setF({ ...f, value: Number(e.target.value) })} className={inputCls} />
          </Field>
          <Field label="Min order ₹">
            <input type="number" min={0} value={f.minOrder} onChange={(e) => setF({ ...f, minOrder: Number(e.target.value) })} className={inputCls} />
          </Field>
          <Field label="Max discount ₹">
            <input type="number" min={0} value={f.maxDiscount} onChange={(e) => setF({ ...f, maxDiscount: e.target.value })} placeholder="optional" className={inputCls} />
          </Field>
          <Field label="Expiry date">
            <input type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Usage limit">
            <input type="number" min={0} value={f.usageLimit} onChange={(e) => setF({ ...f, usageLimit: e.target.value })} placeholder="unlimited" className={inputCls} />
          </Field>
        </div>

        <Field label="Description" full>
          <input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="20% off orders above ₹999" className={inputCls} />
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} className="w-4 h-4 accent-current" />
          Active (usable at checkout)
        </label>

        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-forest-deep text-cream px-7 py-3.5 text-sm font-semibold hover:bg-forest transition">
            {editing ? "Save changes" : "Create coupon"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setF(empty); }} className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold hover:bg-muted transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-2xl bg-card border border-border p-5 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <p className="font-display text-2xl text-forest-deep">All coupons</p>
          <span className="text-xs font-mono text-muted-foreground">{coupons.length} total</span>
        </div>

        {coupons.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No coupons yet. Create your first one.</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className={`rounded-xl border p-4 transition ${c.active ? "border-border" : "border-border/60 opacity-60"}`}>
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-base tracking-widest text-forest-deep">{c.code}</span>
                      <span className="text-[10px] uppercase tracking-widest rounded-full bg-gold/20 text-gold px-2 py-0.5">
                        {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                      </span>
                      <span className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 ${c.active ? "bg-forest-deep/10 text-forest-deep" : "bg-muted text-muted-foreground"}`}>
                        {c.active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {c.description ? `${c.description} · ` : ""}
                      Min ₹{c.minOrder}
                      {c.maxDiscount ? ` · Cap ₹${c.maxDiscount}` : ""}
                      {c.expiry ? ` · Expires ${c.expiry}` : ""}
                      {c.usageLimit ? ` · ${c.used}/${c.usageLimit} used` : ` · ${c.used} used`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateCoupon(c.id, { active: !c.active })} title={c.active ? "Pause" : "Activate"} className="w-10 h-10 grid place-items-center rounded-xl border border-border hover:bg-muted transition">
                      <Power className="w-4 h-4" />
                    </button>
                    <button onClick={() => edit(c)} className="rounded-xl border border-border px-4 h-10 text-xs font-semibold hover:bg-muted transition">Edit</button>
                    <button onClick={() => { removeCoupon(c.id); toast.success("Coupon deleted"); }} className="w-10 h-10 grid place-items-center rounded-xl border border-border hover:text-terracotta transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
