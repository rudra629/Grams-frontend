import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { GramsHero } from "@/components/showcase/GramsHero";
import { GramsSlider } from "@/components/showcase/GramsSlider";
import { getLenis } from "@/lib/smooth-scroll";
import { setIntroActive } from "@/lib/intro-visibility";

export const INTRO_SEEN_KEY = "grams_intro_seen";
export const HOME_START_ID = "home-start";

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Height of the sticky site chrome, so the hero never sits under the navbar. */
function chromeOffset() {
  if (typeof document === "undefined") return 0;
  const header = document.querySelector("header.site-chrome") as HTMLElement | null;
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

function homeStartTop() {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return 0;
  return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - chromeOffset()));
}

/** Set while a programmatic scroll is in flight, so gates stay out of the way. */
let programmaticUntil = 0;
function isProgrammatic() {
  return performance.now() < programmaticUntil;
}

/** Smoothly (or instantly) move the viewport to the start of the real home page. */
export function scrollToHomeStart(immediate = false) {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return;
  const lenis = getLenis();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const jump = immediate || reduced;
  const top = homeStartTop();
  programmaticUntil = performance.now() + (jump ? 300 : 1800);
  if (lenis) {
    lenis.scrollTo(top, jump ? { immediate: true, force: true } : { duration: 1.4, force: true });
  } else {
    window.scrollTo({ top, behavior: jump ? "auto" : "smooth" });
  }
}




export function IntroSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [showSkip, setShowSkip] = useState(true);
  const [mounted, setMounted] = useState(false);
  // The site chrome (announcement bar + header) sits in flow above the intro;
  // while it's hidden its space would show as a flat band. Pulling the intro
  // up by exactly that height removes the band without any layout jump later.
  const [chromePull, setChromePull] = useState(0);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const measure = () => {
      const bars = Array.from(
        document.querySelectorAll(".site-chrome"),
      ) as HTMLElement[];
      const total = bars
        .filter((el) => getComputedStyle(el).position !== "fixed")
        .reduce((sum, el) => sum + el.offsetHeight, 0);
      setChromePull(total);

    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);


  // Track whether the intro fills the viewport (hides the site chrome), and
  // remember it as "seen" once the user has scrolled past it.
  useEffect(() => {
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const top = homeStartTop();
      const past = window.scrollY > top - 8;
      setShowSkip(!past);
      setIntroActive(!past);
      document.documentElement.classList.toggle("intro-active", !past);
      if (past) markIntroSeen();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      setIntroActive(false);
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  // Upward gate: scrolling up from inside the home page parks once at the top
  // of the hero. Once parked (or if you are already sitting at the hero), the
  // next upward gesture goes straight into the intro.
  useEffect(() => {
    let parked = window.scrollY <= homeStartTop() + 8;
    let lastSettle = 0;

    const blockUp = (delta: number) => {
      if (isProgrammatic()) return false;
      const top = homeStartTop();
      const y = window.scrollY;

      // Far enough down the page — re-arm the park for the next trip up.
      if (y > top + 220) {
        parked = false;
        return false;
      }
      if (delta >= 0) return false;
      // Already at (or above) the hero top: let the intro through.
      if (y <= top + 8) {
        parked = true;
        return false;
      }
      if (parked) return false;

      const now = performance.now();
      const lenis = getLenis();
      if (now - lastSettle > 260) {
        lastSettle = now;
        if (lenis) lenis.scrollTo(top, { duration: 0.6, force: true });
        else window.scrollTo({ top, behavior: "smooth" });
      }
      parked = true;
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (blockUp(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) < 10) return;
      if (blockUp(dy)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      // Leaving home (nav to /shop etc.) counts as having seen the intro, so
      // coming back lands on the hero instead of replaying the sequence.
      if (window.scrollY > 40) markIntroSeen();
    };
  }, []);

  // While the intro owns the viewport, damp touch scrolling so a single swipe
  // can't fling the visitor past the whole sequence on mobile.
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const base = lenis.options?.touchMultiplier ?? 1.4;
    lenis.options.touchMultiplier = showSkip ? 0.6 : base;
    return () => {
      const l = getLenis();
      if (l) l.options.touchMultiplier = 1.4;
    };
  }, [showSkip]);



  const skipButton = (
    <button
      type="button"
      onClick={() => {
        markIntroSeen();
        scrollToHomeStart();
      }}
      aria-label="Skip the intro and go to the shop"
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 items-center gap-2 rounded-full border border-gold/40 bg-black/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-cream backdrop-blur-xl transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-[#0a0a0c] ${
        showSkip ? "flex" : "hidden"
      }`}
    >
      Skip down
      <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
    </button>
  );

  // A fixed backdrop painted with the hero's own mesh colours. The collapsed
  // site-chrome strip above the intro sits over this instead of over the warm
  // page background, so the top of the sequence reads as one surface.
  const backdrop = (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 transition-opacity duration-500 ${
        showSkip ? "opacity-100" : "opacity-0"
      }`}
      style={{
        zIndex: -1,
        background:
          "radial-gradient(120% 90% at 50% 60%, #1f3d2d 0%, #0f2119 48%, #050b08 100%)",
      }}

    />
  );

  return (
    <div ref={ref} className="relative bg-transparent" style={{ marginTop: -chromePull }}>
      <GramsHero />

      <GramsSlider />

      {/* seam: fade the intro into the home hero's base colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(180deg, transparent 0%, #0a0a0c 100%)" }}
      />
      {mounted ? createPortal(backdrop, document.body) : null}
      {mounted ? createPortal(skipButton, document.body) : null}

    </div>


  );
}
