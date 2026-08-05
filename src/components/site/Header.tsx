import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";

import { cn } from "@/lib/utils";
import { useIntroActive } from "@/lib/intro-visibility";

import gramsLogo from "@/assets/Grams-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/gifting", label: "Gifting" },
  { to: "/story", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-forest-deep text-cream text-[11px] md:text-xs tracking-[0.2em] uppercase">
      <div className="container-x flex items-center justify-center gap-8 py-2 overflow-hidden">
        <span className="hidden md:inline opacity-70 font-mono">FLAT 20% OFF · CODE CRUNCH20</span>
        <span className="text-gold">✦ Freshly packed this week ✦</span>
        <span className="hidden md:inline opacity-70">Cash on delivery available</span>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const introActive = useIntroActive();
  const { count } = useCart();
  const { user } = useAuth();


  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const bump = () => {
      const el = cartRef.current;
      if (!el) return;
      el.classList.remove("cart-bump");
      void el.offsetWidth;
      el.classList.add("cart-bump");
    };
    window.addEventListener("grams:cart-bump", bump);
    return () => window.removeEventListener("grams:cart-bump", bump);
  }, []);

  return (
    <>
      <div className={cn("site-chrome transition-all duration-500 ease-out", introActive && "is-hidden")}>
        <AnnouncementBar />
      </div>
      <header
        className={cn(
          "site-chrome sticky top-0 z-40 backdrop-blur-lg bg-cream/85 border-b border-border/60 transition-all duration-500 ease-out",
          introActive && "is-hidden",
        )}
      >

        <div className="container-x flex items-center justify-between h-20 md:h-28">
          <Link to="/" className="flex items-center">
            <img src={gramsLogo} alt="Grams" className="h-14 md:h-20 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative py-1 tx hover:text-forest-deep hover:-translate-y-0.5",
                  pathname === n.to ? "text-forest-deep" : "text-ink/70",
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gold origin-left transition-transform duration-300",
                    pathname === n.to ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/shop" className="p-2 rounded-full hover:bg-muted transition" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            <Link to={user ? "/profile" : "/auth"} className="p-2 rounded-full hover:bg-muted transition hidden sm:grid" aria-label={user ? "Profile" : "Sign in"}>
              <User className="w-5 h-5" />
            </Link>

            <Link ref={cartRef} to="/cart" data-cart-icon className="relative p-2 rounded-full hover:bg-muted transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta text-cream text-[10px] font-semibold grid place-items-center font-mono">
                  {count}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 relative w-9 h-9 grid place-items-center" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              <Menu className={`w-5 h-5 absolute transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
              <X className={`w-5 h-5 absolute transition-all duration-300 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden border-t border-border/60 bg-cream">
            <div className="container-x py-4 flex flex-col gap-1">
              {nav.map((n, idx) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${80 + idx * 40}ms` : "0ms" }}
                  className={`py-3 border-b border-border/40 text-base font-medium transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
                >
                  {n.label}
                </Link>
              ))}
              <Link to={user ? "/profile" : "/auth"} onClick={() => setOpen(false)} className={`py-3 text-base font-medium transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`} style={{ transitionDelay: open ? `${80 + nav.length * 40}ms` : "0ms" }}>
                {user ? "My Account" : "Sign in"}
              </Link>

            </div>
          </div>
        </div>

      </header>
    </>
  );
}
