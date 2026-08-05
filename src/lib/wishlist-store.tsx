import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth, setPendingAction } from "@/lib/auth-store";

type WishlistCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  addDirect: (slug: string) => void;
};

const Ctx = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("grams:wishlist");
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("grams:wishlist", JSON.stringify(slugs));
    } catch {}
  }, [slugs]);

  const addDirect = (slug: string) =>
    setSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));

  const value: WishlistCtx = {
    slugs,
    has: (slug) => slugs.includes(slug),
    remove: (slug) => setSlugs((prev) => prev.filter((s) => s !== slug)),
    addDirect,
    toggle: (slug) => {
      if (!user) {
        setPendingAction({ type: "wishlist", slug });
        toast("Sign in to save to your wishlist");
        navigate({ to: "/auth", search: { redirect: pathname } });
        return false;
      }
      setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return true;
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
