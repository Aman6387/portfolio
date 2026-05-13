/** Safe capped device pixel ratio — sharp phones often report 3–4× DPR. */
export function getCappedPixelRatio(max = 2): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Narrow viewports / touch-first devices — lighter GPU budget */
export function isLikelyMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1024px)").matches;
}
