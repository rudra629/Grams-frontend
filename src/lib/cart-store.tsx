import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth, setPendingAction } from "@/lib/auth-store";


export const MAX_PER_ITEM = 30;


export type CartItem = {
  slug: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (i: CartItem) => boolean;
  addDirect: (i: CartItem) => void;

  remove: (slug: string, weight: string) => void;
  setQty: (slug: string, weight: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });


  useEffect(() => {
    try {
      const raw = localStorage.getItem("grams:cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("grams:cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addDirect: CartCtx["addDirect"] = (i) => {

    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === i.slug && p.weight === i.weight);
      if (idx > -1) {
        const current = prev[idx].qty;
        if (current >= MAX_PER_ITEM) {
          toast.error(`Max ${MAX_PER_ITEM} per product`);
          return prev;
        }
        const nextQty = Math.min(MAX_PER_ITEM, current + i.qty);
        if (nextQty === current) return prev;
        if (current + i.qty > MAX_PER_ITEM) toast.error(`Capped at ${MAX_PER_ITEM} per product`);
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: nextQty };
        return copy;
      }
      const startQty = Math.min(MAX_PER_ITEM, i.qty);
      if (i.qty > MAX_PER_ITEM) toast.error(`Capped at ${MAX_PER_ITEM} per product`);
      return [...prev, { ...i, qty: startQty }];
    });
  };

  const add: CartCtx["add"] = (i) => {
    if (!user) {
      setPendingAction({ type: "cart", item: i });
      toast("Sign in to add items to your cart");
      navigate({ to: "/auth", search: { redirect: href } });
      return false;
    }
    addDirect(i);
    return true;
  };



  const remove: CartCtx["remove"] = (slug, weight) =>
    setItems((prev) => prev.filter((p) => !(p.slug === slug && p.weight === weight)));

  const setQty: CartCtx["setQty"] = (slug, weight, qty) =>
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug && p.weight === weight
          ? { ...p, qty: Math.min(MAX_PER_ITEM, Math.max(1, qty)) }
          : p,
      ),
    );


  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, addDirect, remove, setQty, clear, count, total }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
