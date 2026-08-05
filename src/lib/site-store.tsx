import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as baseProducts, type Product } from "./products";
import giftCorporateNight from "@/assets/gift-corporate-night.jpg";
import giftBirthdayBox from "@/assets/gift-birthday-box.jpg";
import giftFestiveBlack from "@/assets/gift-festive-black.jpg";
import giftPackingLine from "@/assets/gift-packing-line.jpg";

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  items?: { name: string; qty: number; weight: string; price: number; slug?: string }[];
};

export type Application = {
  id: string;
  name: string;
  email: string;
  resumeName: string;
  resumeDataUrl: string;
  message?: string;
  date: string;
};

export type GiftCategory = "Corporate" | "Birthday" | "Festive";

export type GiftBox = {
  id: string;
  category: GiftCategory;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  image: string;
  contents: string[];
  description: string;
};

export type GiftArticle = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: GiftCategory;
  author?: string;
  date: string;
  images: string[];
};

export type Review = {
  id: string;
  productSlug: string;
  orderId: string;
  user: string;
  rating: number;
  text: string;
  date: string;
  hidden?: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiry?: string;
  usageLimit?: number;
  used: number;
  description?: string;
  active: boolean;
};

export type SiteStat = { n: string; l: string };

export const VALUE_PROP_ICONS = ["leaf", "shield", "truck", "sparkles", "award", "heart"] as const;
export type ValuePropIcon = (typeof VALUE_PROP_ICONS)[number];
export type ValueProp = { icon: ValuePropIcon; title: string; desc: string };

export type MonthPick = {
  key: "Nuts" | "Seeds" | "Dried Fruits";
  slug: string;
  eyebrow: string;
  title: string;
  italic: string;
  desc: string;
};

export type ContactInfo = {
  emails: string[];
  phones: string[];
  address: string[];
  hours: string[];
};

export type CopyMap = Record<string, string>;

type SiteCtx = {
  extraProducts: Product[];
  addProduct: (p: Product) => void;
  removeProduct: (slug: string) => void;
  allProducts: Product[];
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Address;
  removeAddress: (id: string) => void;
  bannerWords: string[];
  setBannerWords: (w: string[]) => void;
  applications: Application[];
  addApplication: (a: Omit<Application, "id" | "date">) => void;
  removeApplication: (id: string) => void;
  giftBoxes: GiftBox[];
  addGiftBox: (g: Omit<GiftBox, "id">) => void;
  updateGiftBox: (id: string, patch: Partial<GiftBox>) => void;
  removeGiftBox: (id: string) => void;
  giftArticles: GiftArticle[];
  addGiftArticle: (a: Omit<GiftArticle, "id" | "date"> & { date?: string }) => void;
  updateGiftArticle: (id: string, patch: Partial<GiftArticle>) => void;
  removeGiftArticle: (id: string) => void;
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  toggleReviewHidden: (id: string) => void;
  removeReview: (id: string) => void;
  coupons: Coupon[];
  addCoupon: (c: Omit<Coupon, "id" | "used">) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  removeCoupon: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => { ok: true; coupon: Coupon; discount: number } | { ok: false; reason: string };
  stats: SiteStat[];
  setStats: (s: SiteStat[]) => void;
  valueProps: ValueProp[];
  setValueProps: (v: ValueProp[]) => void;
  monthPicks: MonthPick[];
  setMonthPicks: (m: MonthPick[]) => void;
  contact: ContactInfo;
  setContact: (c: ContactInfo) => void;
  copy: CopyMap;
  setCopy: (c: CopyMap) => void;
  t: (key: string) => string;
};

const Ctx = createContext<SiteCtx | null>(null);

const DEFAULT_BANNER = [
  "Freshly Packed",
  "Small Batch",
  "No Preservatives",
  "Direct from Farms",
  "Vacuum Sealed",
  "Traceable Origins",
];

const DEFAULT_COUPONS: Coupon[] = [
  { id: "c1", code: "CRUNCH20", type: "percent", value: 20, minOrder: 999, maxDiscount: 500, used: 0, active: true, description: "20% off orders above ₹999" },
  { id: "c2", code: "FIRSTBITE", type: "flat", value: 150, minOrder: 599, used: 0, active: true, description: "₹150 off your first pantry haul" },
];

const DEFAULT_VALUE_PROPS: ValueProp[] = [
  { icon: "leaf", title: "Farm to pouch", desc: "Direct sourcing, zero middlemen, honest pricing." },
  { icon: "shield", title: "Small-batch craft", desc: "Roasted & packed in tiny lots for peak flavor." },
  { icon: "truck", title: "Fast delivery", desc: "Free 2-day shipping on orders over ₹899." },
  { icon: "sparkles", title: "Vacuum sealed", desc: "Nitrogen-flushed pouches lock in crunch." },
];

const DEFAULT_STATS: SiteStat[] = [
  { n: "12+", l: "Global origins" },
  { n: "47k", l: "Happy snackers" },
  { n: "98%", l: "Reorder rate" },
];

const DEFAULT_MONTH_PICKS: MonthPick[] = [
  {
    key: "Nuts",
    slug: "walnut-whole-california",
    eyebrow: "Nut of the month",
    title: "Walnut",
    italic: "Whole.",
    desc: "California-grown, hand-graded and shipped within 14 days of harvest.",
  },
  {
    key: "Seeds",
    slug: "pumpkin-seeds",
    eyebrow: "Seed of the month",
    title: "Pumpkin",
    italic: "Seeds.",
    desc: "Cold-dried, magnesium-dense and impossibly crunchy. Your 4pm fix.",
  },
  {
    key: "Dried Fruits",
    slug: "dried-mango-slice",
    eyebrow: "Dry fruit of the month",
    title: "Dried",
    italic: "Mango.",
    desc: "Sun-ripened Alphonso slices with zero added sugar. Nature's candy.",
  },
];

const DEFAULT_CONTACT: ContactInfo = {
  emails: ["care@grams.snack", "wholesale@grams.snack"],
  phones: ["+91 98765 43210", "Mon–Sat · 10am–7pm IST"],
  address: ["Grams Foods Pvt. Ltd.", "42 Farm Lane, Bengaluru 560001"],
  hours: ["Under 24 hours", "Usually same day"],
};

export const COPY_FIELDS: { key: string; label: string; group: string }[] = [
  { key: "home.bestsellers.eyebrow", label: "Bestsellers — eyebrow", group: "Home" },
  { key: "home.bestsellers.title", label: "Bestsellers — title", group: "Home" },
  { key: "home.categories.eyebrow", label: "Categories — eyebrow", group: "Home" },
  { key: "home.categories.title", label: "Categories — title", group: "Home" },
  { key: "home.categories.titleItalic", label: "Categories — italic line", group: "Home" },
  { key: "home.new.eyebrow", label: "New arrivals — eyebrow", group: "Home" },
  { key: "home.new.title", label: "New arrivals — title", group: "Home" },
  { key: "home.ritual.eyebrow", label: "Ritual — eyebrow", group: "Home" },
  { key: "home.ritual.title", label: "Ritual — title", group: "Home" },
  { key: "home.ritual.titleItalic", label: "Ritual — italic line", group: "Home" },
  { key: "home.testimonials.eyebrow", label: "Testimonials — eyebrow", group: "Home" },
  { key: "home.testimonials.title", label: "Testimonials — title", group: "Home" },
  { key: "home.newsletter.eyebrow", label: "Newsletter — eyebrow", group: "Home" },
  { key: "shop.eyebrow", label: "Shop — eyebrow", group: "Shop" },
  { key: "shop.title", label: "Shop — title", group: "Shop" },
  { key: "shop.subtitle", label: "Shop — subtitle", group: "Shop" },
  { key: "contact.eyebrow", label: "Contact — eyebrow", group: "Contact" },
  { key: "contact.title", label: "Contact — title", group: "Contact" },
  { key: "contact.titleItalic", label: "Contact — italic line", group: "Contact" },
  { key: "contact.subtitle", label: "Contact — subtitle", group: "Contact" },
];

const DEFAULT_COPY: CopyMap = {
  "home.bestsellers.eyebrow": "Loved by many",
  "home.bestsellers.title": "The Bestsellers",
  "home.categories.eyebrow": "Categories",
  "home.categories.title": "Pick your poison",
  "home.categories.titleItalic": "(the healthy kind).",
  "home.new.eyebrow": "Fresh off the shelf",
  "home.new.title": "New Arrivals",
  "home.ritual.eyebrow": "The Grams Ritual",
  "home.ritual.title": "A tiny bowl.",
  "home.ritual.titleItalic": "A giant reset.",
  "home.testimonials.eyebrow": "Word on the street",
  "home.testimonials.title": "Snacked & Approved",
  "home.newsletter.eyebrow": "Join the pantry",
  "shop.eyebrow": "The Collection",
  "shop.title": "Invest In Your health.",
  "shop.subtitle": "Ten obsessively-sourced snacks. Sort, filter, and add the good stuff to your pantry.",
  "contact.eyebrow": "Say hi",
  "contact.title": "Let's",
  "contact.titleItalic": "talk snacks.",
  "contact.subtitle": "Questions, bulk orders, collabs, complaints (rare, but valid) — hit us up. We reply within 24 hours, usually much sooner.",
  "chat.trigger": "Ask the wellness guide",
  "chat.name": "Wellness Guide",
  "chat.greeting": "Hey — I'm your Grams wellness guide. What health or daily issue are you facing?",
};


const DEFAULT_ORDERS: Order[] = [
  { id: "GRM-10428", customer: "Aanya Sharma", email: "aanya@grams.snack", total: 1249, status: "Delivered", date: "Jul 2" },
  { id: "GRM-10427", customer: "Kabir Singh", email: "kabir@x.com", total: 849, status: "Processing", date: "Jul 2" },
  { id: "GRM-10426", customer: "Meera Patel", email: "meera@x.com", total: 2098, status: "Shipped", date: "Jul 1" },
  { id: "GRM-10425", customer: "Ishaan Rao", email: "ishaan@x.com", total: 549, status: "Delivered", date: "Jul 1" },
  { id: "GRM-10424", customer: "Riya Mehta", email: "riya@x.com", total: 1499, status: "Cancelled", date: "Jun 30" },
];

const DEFAULT_ADDRESSES: Address[] = [
  { id: "a1", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "12, Palm Grove Apartments", line2: "Linking Road", city: "Mumbai", state: "MH", pincode: "400050", label: "Home" },
  { id: "a2", name: "Aanya Sharma", phone: "+91 98765 43210", line1: "Nexus Coworking, 4th Floor", city: "Mumbai", state: "MH", pincode: "400013", label: "Work" },
];

const DEFAULT_GIFT_BOXES: GiftBox[] = [
  {
    id: "g1",
    category: "Corporate",
    name: "The Boardroom Reserve",
    tagline: "A statement gift for clients & teams.",
    price: 2499,
    compareAt: 2999,
    image: baseProducts[3].image,
    contents: ["Macadamia Halves 250g", "Walnut Whole 250g", "Pecan Halves 200g", "Hand-numbered card"],
    description: "Matte black rigid box, magnetic close, gold foil monogram. Ships gift-wrapped, no invoice inside.",
  },
  {
    id: "g2",
    category: "Corporate",
    name: "Deskside Ritual",
    tagline: "Because Zoom fatigue is real.",
    price: 1499,
    image: baseProducts[5].image,
    contents: ["Pumpkin Seeds 200g", "Sunflower Kernels 200g", "Dried Cranberries 150g"],
    description: "The quiet flex for your favourite colleague. Slim slate box with embossed foil.",
  },
  {
    id: "g3",
    category: "Birthday",
    name: "Birthday Reset",
    tagline: "Better than another candle.",
    price: 1899,
    compareAt: 2299,
    image: baseProducts[6].image,
    contents: ["Dried Mango 200g", "Dried Kiwi 150g", "Dried Pineapple 200g", "Personalised note"],
    description: "Neon birthday sleeve over an obsidian box. Fully personalised message strip.",
  },
  {
    id: "g4",
    category: "Birthday",
    name: "The Sweet Sixteen",
    tagline: "A little chaos, a lot of crunch.",
    price: 1299,
    image: baseProducts[7].image,
    contents: ["Dried Mango 150g", "Cranberries 150g", "Hazelnuts 150g"],
    description: "Bright chrome-stripe pouch tucked into a jet black gift tin.",
  },
  {
    id: "g5",
    category: "Festive",
    name: "Diwali Noir",
    tagline: "Festive lights. Darker box. Louder gift.",
    price: 3499,
    compareAt: 3999,
    image: baseProducts[0].image,
    contents: ["Walnut 250g", "Macadamia 200g", "Pecan 200g", "Cranberries 200g", "Brass tealight"],
    description: "Two-tier lacquered box, brass tealight and a hand-numbered festive card. Bulk pricing available.",
  },
  {
    id: "g6",
    category: "Festive",
    name: "Rakhi Ritual Box",
    tagline: "A modern take on the classic thali.",
    price: 1699,
    image: baseProducts[6].image,
    contents: ["Dried Mango 200g", "Cashew 150g equivalent", "Handmade rakhi", "Roli & chawal"],
    description: "Slim charcoal box, silk-tied rakhi, minimal typography.",
  },
];

const DEFAULT_GIFT_ARTICLES: GiftArticle[] = [
  {
    id: "ga1",
    title: "500 boxes, 3 cities, one very long night",
    excerpt: "How we packed a Diwali order for a Bengaluru fintech in 72 hours — hand-numbered, gold-foiled, and delivered before the first diya was lit.",
    body: "It started with a call on a Tuesday. Five hundred boxes, three cities, and a deadline that made our ops lead laugh out loud.\n\nWe pulled the walnut lot from Ratnagiri, roasted the macadamia in two batches so nothing sat overnight, and set up a packing line in the studio at 9pm. Every box got a hand-numbered card — 001 through 500 — and a gold foil monogram pressed one at a time.\n\nThe last van left at 4:40am. Every single box landed before Diwali morning. The client sent us a photo of the whole floor unwrapping at once. That photo is still on our studio wall.",
    category: "Corporate",
    author: "Team Grams",
    date: "Jul 2, 2026",
    images: [giftCorporateNight, giftPackingLine],
  },
  {
    id: "ga2",
    title: "The birthday box that started as an apology",
    excerpt: "A customer forgot his sister's birthday. What we built for him became our best-selling personalised gift.",
    body: "He messaged us at 11pm: \"I forgot. Can you fix this?\"\n\nWe built a single box overnight — dried mango, kiwi, pineapple — with a message strip printed in her favourite colour. It shipped next-day.\n\nShe posted it. Then forty people asked for the same thing. That box is now the Birthday Reset, and yes, the message strip is still the most-used feature we've ever shipped.",
    category: "Birthday",
    author: "Aanya S.",
    date: "Jun 18, 2026",
    images: [giftBirthdayBox, giftFestiveBlack],
  },
  {
    id: "ga3",
    title: "Why our festive boxes are matte black",
    excerpt: "Everyone else goes red and gold. We went the other way — and the reasoning is more practical than aesthetic.",
    body: "Festive packaging in India is loud by default. We tested a red-and-gold run in year one and half of it arrived scuffed — bright gloss shows every scratch from transit.\n\nMatte black hides handling, photographs beautifully under warm light, and makes the gold foil read as intentional rather than decorative. It also means the box survives as a keepsake instead of going straight into the bin.\n\nThree festive seasons later, we haven't changed it once.",
    category: "Festive",
    author: "Studio Notes",
    date: "May 30, 2026",
    images: [giftFestiveBlack, giftCorporateNight],
  },
  {
    id: "ga4",
    title: "Inside a corporate gifting run",
    excerpt: "From the first spreadsheet to the last delivery scan — a full walkthrough of how a bulk order actually happens.",
    body: "Step one is never the box. It's the list — names, addresses, pincodes, and the twelve people whose office moved last month.\n\nWe clean the list, lock the SKU mix, and produce one sample box for sign-off. Nothing scales until the sample is approved.\n\nThen the line runs: fill, seal, weigh, number, wrap, label, scan. Each box gets a tracking row. Clients get one sheet with every delivery status, updated daily until the last scan clears.",
    category: "Corporate",
    author: "Ops Desk",
    date: "May 12, 2026",
    images: [giftPackingLine, giftBirthdayBox, giftCorporateNight],
  },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [extraProducts, setExtra] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [bannerWords, setBannerWordsState] = useState<string[]>(DEFAULT_BANNER);
  const [applications, setApplications] = useState<Application[]>([]);
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>(DEFAULT_GIFT_BOXES);
  const [giftArticles, setGiftArticles] = useState<GiftArticle[]>(DEFAULT_GIFT_ARTICLES);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [stats, setStatsState] = useState<SiteStat[]>(DEFAULT_STATS);
  const [valueProps, setValuePropsState] = useState<ValueProp[]>(DEFAULT_VALUE_PROPS);
  const [monthPicks, setMonthPicksState] = useState<MonthPick[]>(DEFAULT_MONTH_PICKS);
  const [contact, setContactState] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [copy, setCopyState] = useState<CopyMap>(DEFAULT_COPY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExtra(load("grams:extra-products", [] as Product[]));
    setOrders(load("grams:orders", DEFAULT_ORDERS));
    setAddresses(load("grams:addresses", DEFAULT_ADDRESSES));
    setBannerWordsState(load("grams:banner", DEFAULT_BANNER));
    setApplications(load("grams:applications", [] as Application[]));
    setGiftBoxes(load("grams:gift-boxes", DEFAULT_GIFT_BOXES));
    setGiftArticles(load("grams:gift-articles-v2", DEFAULT_GIFT_ARTICLES));
    setReviews(load("grams:reviews", [] as Review[]));
    setCoupons(load("grams:coupons", DEFAULT_COUPONS));
    setStatsState(load("grams:stats", DEFAULT_STATS));
    setValuePropsState(load("grams:value-props", DEFAULT_VALUE_PROPS));
    setMonthPicksState(load("grams:month-picks", DEFAULT_MONTH_PICKS));
    setContactState(load("grams:contact", DEFAULT_CONTACT));
    setCopyState({ ...DEFAULT_COPY, ...load("grams:copy", {} as CopyMap) });
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("grams:extra-products", JSON.stringify(extraProducts)); }, [extraProducts, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:addresses", JSON.stringify(addresses)); }, [addresses, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:banner", JSON.stringify(bannerWords)); }, [bannerWords, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:applications", JSON.stringify(applications)); }, [applications, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:gift-boxes", JSON.stringify(giftBoxes)); }, [giftBoxes, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:gift-articles-v2", JSON.stringify(giftArticles)); }, [giftArticles, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:reviews", JSON.stringify(reviews)); }, [reviews, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:coupons", JSON.stringify(coupons)); }, [coupons, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:stats", JSON.stringify(stats)); }, [stats, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:value-props", JSON.stringify(valueProps)); }, [valueProps, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:month-picks", JSON.stringify(monthPicks)); }, [monthPicks, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:contact", JSON.stringify(contact)); }, [contact, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("grams:copy", JSON.stringify(copy)); }, [copy, hydrated]);


  const allProducts = useMemo(() => [...extraProducts, ...baseProducts], [extraProducts]);

  const value: SiteCtx = {
    extraProducts,
    addProduct: (p) => setExtra((prev) => [p, ...prev.filter((x) => x.slug !== p.slug)]),
    removeProduct: (slug) => setExtra((prev) => prev.filter((p) => p.slug !== slug)),
    allProducts,
    orders,
    addOrder: (o) => setOrders((prev) => [o, ...prev]),
    updateOrderStatus: (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    addresses,
    addAddress: (a) => {
      const full = { ...a, id: `addr_${Date.now()}` };
      setAddresses((prev) => [...prev, full]);
      return full;
    },
    removeAddress: (id) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    bannerWords,
    setBannerWords: setBannerWordsState,
    applications,
    addApplication: (a) => setApplications((prev) => [{ ...a, id: `app_${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev]),
    removeApplication: (id) => setApplications((prev) => prev.filter((x) => x.id !== id)),
    giftBoxes,
    addGiftBox: (g) => setGiftBoxes((prev) => [{ ...g, id: `gb_${Date.now()}` }, ...prev]),
    updateGiftBox: (id, patch) => setGiftBoxes((prev) => prev.map((g) => g.id === id ? { ...g, ...patch } : g)),
    removeGiftBox: (id) => setGiftBoxes((prev) => prev.filter((g) => g.id !== id)),
    giftArticles,
    addGiftArticle: (a) => setGiftArticles((prev) => [{
      ...a,
      id: `ga_${Date.now()}`,
      date: a.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }, ...prev]),
    updateGiftArticle: (id, patch) => setGiftArticles((prev) => prev.map((a) => a.id === id ? { ...a, ...patch } : a)),
    removeGiftArticle: (id) => setGiftArticles((prev) => prev.filter((a) => a.id !== id)),
    reviews,
    addReview: (r) => setReviews((prev) => [{ ...r, id: `rev_${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev]),
    toggleReviewHidden: (id) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, hidden: !r.hidden } : r)),
    removeReview: (id) => setReviews((prev) => prev.filter((r) => r.id !== id)),
    coupons,
    addCoupon: (c) => setCoupons((prev) => [{ ...c, code: c.code.toUpperCase().trim(), id: `cp_${Date.now()}`, used: 0 }, ...prev.filter((x) => x.code.toUpperCase() !== c.code.toUpperCase().trim())]),
    updateCoupon: (id, patch) => setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    removeCoupon: (id) => setCoupons((prev) => prev.filter((c) => c.id !== id)),
    validateCoupon: (code, subtotal) => {
      const c = coupons.find((x) => x.code.toUpperCase() === code.toUpperCase().trim());
      if (!c) return { ok: false as const, reason: "Invalid coupon code" };
      if (!c.active) return { ok: false as const, reason: "This coupon is no longer active" };
      if (c.expiry && new Date(c.expiry) < new Date(new Date().toDateString())) return { ok: false as const, reason: "This coupon has expired" };
      if (c.usageLimit && c.used >= c.usageLimit) return { ok: false as const, reason: "Coupon usage limit reached" };
      if (subtotal < c.minOrder) return { ok: false as const, reason: `Minimum order ₹${c.minOrder} required` };
      let discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
      if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
      discount = Math.min(discount, subtotal);
      return { ok: true as const, coupon: c, discount };
    },
    stats,
    setStats: setStatsState,
    valueProps,
    setValueProps: setValuePropsState,
    monthPicks,
    setMonthPicks: setMonthPicksState,
    contact,
    setContact: setContactState,
    copy,
    setCopy: setCopyState,
    t: (key) => copy[key] ?? DEFAULT_COPY[key] ?? "",
  };


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used within SiteProvider");
  return c;
}
