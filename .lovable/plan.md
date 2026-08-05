## Goal

Make the opening sequence feel finished on both desktop and mobile: scroll up from home enters the animation on the first gesture, no bare band at the top, no floating buttons over the intro, mobile takes a real multi-swipe journey, and the product transitions scrub smoothly instead of jump-cutting.

## 1. Scroll-up entry works on the first gesture

Today the upward gate in `IntroSequence.tsx` counts two upward gestures before it lets you back into the intro, and the counter only starts once the page has been "armed" by scrolling. Landing exactly at the hero, a first upward flick gets eaten and nothing happens — which is why it only works after scrolling down and back up.

Change: when the viewport is already parked at the hero top (within a few px) and the user scrolls up, release immediately and let the scroll through. The "park" behaviour is kept only for the case where the user is scrolling up *from further down the page* — they stop once at the hero, then the next upward gesture enters the intro. Reset state cleanly on release so it never gets stuck in a half-armed state.

## 2. The band at the top of the intro

The hidden header/announcement bar still occupies layout space above the intro, so a flat strip of page background shows. Rather than fight it, remove the space: while the intro is active, the chrome collapses out of flow (absolutely positioned instead of just translated) so the intro stage starts at pixel 0 of the viewport. If any sliver remains, it gets filled by extending the intro stage's own background upward so it reads as one surface — no separate colour to mismatch.

## 3. Hide the floating buttons during the intro

`ModeToggle` and `HealthChat` render in `__root.tsx` and float over the intro. Both get gated on the existing `useIntroActive()` store — faded/translated out while the intro owns the viewport, restored (with a short transition) once the user reaches the home hero. Same treatment for the intro's own "Skip down" pill so only one control is visible at a time.

## 4. Mobile scroll length

On mobile the whole 5-product track collapses into roughly one swipe because the track is sized in `vh` (which mobile browsers shrink with the URL bar) and Lenis runs a 1.4× touch multiplier. Fixes:
- Size the track from the measured viewport height per slide with a larger per-slide travel on touch devices, so each product needs a deliberate swipe.
- Reduce the touch multiplier while the intro is active, restoring it afterwards.
- Same treatment for the hero track so the hero doesn't get skipped either.

## 5. Smooth, finished slide transitions

The slide currently swaps on a discrete index via `AnimatePresence`, animating `filter: blur()` on several layers at once — that is the choppy, laggy, unfinished feel, especially on mobile.

- Drive the product image, headline block, background tint and giant word from the continuous scroll progress: each slide is a layer whose opacity/scale/offset is a `useTransform` over its own progress window, so slow scrolling shows a slow blend and reversing is symmetric.
- Drop animated `blur()` filters (keep at most one static blur) and animate only `opacity` / `transform`, which stay on the GPU.
- On mobile, disable the particle burst, floaters and the front ingredient halo, and cut the giant-word layer, so each frame is cheap.
- Keep the existing visual design, colours, copy and progress ticks unchanged; the ticks keep scrolling the track to the matching slide.

## 6. Verification

Playwright at desktop (1280) and mobile (390) widths:
- Step through the whole intro capturing frames — confirm continuous blending and no bare band at the top.
- Confirm the intro track needs multiple swipes on mobile before reaching home.
- Confirm the floating buttons are absent during the intro and back after it.
- From the home hero, one upward gesture enters the intro; from further down, the park-then-enter behaviour still holds.
- Check the console for errors on each pass.

## Technical notes

Files touched: `src/components/showcase/GramsSlider.tsx` (progress-driven transitions, mobile cost cuts), `src/components/site/IntroSequence.tsx` (gate rework, skip pill visibility), `src/routes/__root.tsx` (gate the two floating widgets), `src/lib/smooth-scroll.ts` (touch multiplier during intro), `src/styles.css` (chrome out of flow), possibly `src/components/showcase/GramsHero.tsx` (track sizing only). No changes to routing, products, cart, admin or any other page.
