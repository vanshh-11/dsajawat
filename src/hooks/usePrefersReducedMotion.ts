import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reacts to changes in the user's motion preference, not just the initial value.
 * Used to swap animated React Bits components for static fallbacks at the call site.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    setReduced(media.matches);
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return reduced;
}
