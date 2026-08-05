// Animate a product image flying into the cart icon in the header.
// Usage: pass the source <img> element (or any element) to animate from.
export function flyToCart(source: HTMLElement | null | undefined, imageUrl?: string) {
  if (typeof window === "undefined" || !source) return;
  const target = document.querySelector<HTMLElement>("[data-cart-icon]");
  if (!target) {
    window.dispatchEvent(new Event("grams:cart-bump"));
    return;
  }

  const src = source.getBoundingClientRect();
  const dst = target.getBoundingClientRect();

  // Prefer an <img> inside the source if the source itself isn't one
  const imgInside = source.tagName === "IMG" ? (source as HTMLImageElement) : source.querySelector("img");
  const url = imageUrl || imgInside?.getAttribute("src") || "";

  const flyer = document.createElement("div");
  flyer.style.cssText = `
    position: fixed;
    left: ${src.left}px;
    top: ${src.top}px;
    width: ${src.width}px;
    height: ${src.height}px;
    z-index: 9999;
    pointer-events: none;
    border-radius: 9999px;
    background: var(--cream);
    box-shadow: 0 20px 40px -10px rgba(10,40,24,.35);
    overflow: hidden;
    display: grid;
    place-items: center;
    padding: 8px;
    will-change: transform, opacity;
  `;
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;";
    flyer.appendChild(img);
  }
  document.body.appendChild(flyer);

  const dx = dst.left + dst.width / 2 - (src.left + src.width / 2);
  const dy = dst.top + dst.height / 2 - (src.top + src.height / 2);

  const anim = flyer.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.35 - 80}px) scale(0.7) rotate(-10deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15) rotate(15deg)`, opacity: 0.2, offset: 1 },
    ],
    { duration: 850, easing: "cubic-bezier(.7,.02,.4,1)", fill: "forwards" },
  );
  anim.onfinish = () => {
    flyer.remove();
    window.dispatchEvent(new Event("grams:cart-bump"));
  };
}
