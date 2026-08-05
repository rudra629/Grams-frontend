import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  name: string;
  email: string;
  provider: "email" | "google";
};

export type PendingAction =
  | { type: "cart"; item: { slug: string; name: string; image: string; weight: string; price: number; qty: number } }
  | { type: "wishlist"; slug: string };

const USER_KEY = "grams:user";
const PENDING_KEY = "grams:pending-action";

export function setPendingAction(a: PendingAction) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(a));
  } catch {}
}

export function takePendingAction(): PendingAction | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    localStorage.removeItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingAction) : null;
  } catch {
    return null;
  }
}

type AuthCtx = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signInWithGoogle: () => void;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function nameFromEmail(email: string) {
  const raw = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return raw ? raw.replace(/\b\w/g, (c) => c.toUpperCase()) : "Snacker";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  };

  const value: AuthCtx = {
    user,
    ready,
    signIn: (email) => persist({ name: nameFromEmail(email), email, provider: "email" }),
    signUp: (name, email) => persist({ name: name.trim() || nameFromEmail(email), email, provider: "email" }),
    signInWithGoogle: () =>
      persist({ name: "Google Snacker", email: "you@gmail.com", provider: "google" }),
    signOut: () => persist(null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
