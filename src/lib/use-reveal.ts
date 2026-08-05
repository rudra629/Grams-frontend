import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP-powered pop-in scroll reveal.
 * Auto-tags section-level blocks inside <main> and pops them in with a
 * bouncy back-out ease as they enter the viewport.
 */
export function useReveal(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ctx: gsap.Context | null = null;
    const rafId = requestAnimationFrame(() => {
      const root = document.querySelector("main");
      if (!root) return;

      const selector = ["section", "article", "[data-reveal]"].join(",");
      const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));

      ctx = gsap.context(() => {
        targets.forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 44, scale: 0.965 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.95,
              ease: "back.out(1.35)",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, [pathname]);
}
