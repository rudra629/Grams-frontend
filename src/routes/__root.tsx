import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/lib/cart-store";
import { AuthProvider } from "@/lib/auth-store";
import { WishlistProvider } from "@/lib/wishlist-store";

import { SiteProvider } from "@/lib/site-store";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/site/ModeToggle";
import { HealthChat } from "@/components/site/HealthChat";
import { useReveal } from "@/lib/use-reveal";
import { useSmoothScroll, getLenis } from "@/lib/smooth-scroll";
import { hasSeenIntro, scrollToHomeStart } from "@/components/site/IntroSequence";
import { useIntroActive } from "@/lib/intro-visibility";




function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-gold">Lost in the pantry</p>
        <h1 className="mt-3 font-display text-7xl text-forest-deep">404</h1>
        <p className="mt-4 text-muted-foreground">
          This shelf is empty. Let's get you back to the good stuff.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-forest-deep px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors"
        >
          Back to Grams
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-forest-deep">Something cracked open</h1>
        <p className="mt-3 text-muted-foreground">Try again — we'll re-shell it.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest transition"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Grams — Premium Dry Fruits, Nuts & Seeds" },
      { name: "description", content: "Small-batch, hand-selected dry fruits, nuts and seeds. Freshly packed, delivered with care. Beyond snack — it's a lifestyle." },
      { property: "og:title", content: "Grams — Premium Dry Fruits, Nuts & Seeds" },
      { property: "og:description", content: "Beyond snack, it's a lifestyle. Farm-fresh nuts, seeds and dried fruits, packed in small batches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Manrope:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap",
      },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useSmoothScroll();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <PageTransition>
                    <Outlet />
                  </PageTransition>
                </main>
                <Footer />
              </div>
              <FloatingChrome />

              <Toaster position="top-center" richColors />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SiteProvider>

    </QueryClientProvider>
  );
}

/** Floating widgets (mode toggle + wellness chat) hide while the cinematic
 *  intro owns the viewport, so nothing overlays the animation. */
function FloatingChrome() {
  const introActive = useIntroActive();
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        introActive ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100"
      }`}
      aria-hidden={introActive}
    >
      <ModeToggle />
      <HealthChat />
    </div>
  );
}



function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useReveal(pathname);

  useEffect(() => {
    let isPop = false;
    const onPop = () => { isPop = true; };
    window.addEventListener("popstate", onPop);
    const id = window.setTimeout(() => {
      if (isPop) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Home skips its intro sequence once it's been seen this session.
      if (pathname === "/" && hasSeenIntro()) {
        scrollToHomeStart(true);
        return;
      }
      const lenis = getLenis();
      if (lenis && !reduced) {
        lenis.scrollTo(0, { duration: 1.1, immediate: false });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
      }
    }, 0);

    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(id);
    };
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}

