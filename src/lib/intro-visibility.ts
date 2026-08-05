import { useEffect, useState } from "react";

/**
 * Tiny global store telling the app whether the cinematic intro sequence is
 * currently filling the viewport (so chrome like the header can hide).
 */
let active = false;
const listeners = new Set<(v: boolean) => void>();

export function setIntroActive(v: boolean) {
  if (active === v) return;
  active = v;
  listeners.forEach((l) => l(v));
}

export function isIntroActive() {
  return active;
}

export function useIntroActive() {
  const [v, setV] = useState(active);
  useEffect(() => {
    setV(active);
    listeners.add(setV);
    return () => {
      listeners.delete(setV);
    };
  }, []);
  return v;
}
