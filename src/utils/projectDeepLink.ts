/** URL-safe id from project title, e.g. "Bouncy Ball" → "bouncy-ball" */
export function projectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function projectVideoHash(slug: string) {
  return `${slug}-video`;
}

export function parseProjectHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return null;
  if (id.endsWith("-video")) {
    return { slug: id.slice(0, -"-video".length), video: true as const };
  }
  return { slug: id, video: false as const };
}

export const PROJECT_SHOW_VIDEO_EVENT = "portfolio:show-video";
export const HERO_MODEL_IDLE_EVENT = "portfolio:hero-idle";

const NAVBAR_OFFSET_PX = 88;
const SPLASH_MS_DEFAULT = 1400;
const SPLASH_MS_DEEP_LINK = 750;
/** Extra wait after splash removal + page opacity fade */
const PAGE_FADE_MS = 650;
/** If the 3D hero never reaches idle (load error, etc.) */
const HERO_IDLE_FALLBACK_MS = 12000;

let pageSettled = false;
let heroIdle = false;
let pendingHash: string | null = null;
let activeAbort: (() => void) | null = null;
let splashDurationMs = SPLASH_MS_DEFAULT;
let retryCleanup: (() => void) | null = null;

export function getSplashDelayMs() {
  return splashDurationMs;
}

export function getPageFadeDelayMs() {
  return PAGE_FADE_MS;
}

export function getHeroIdleFallbackMs() {
  return HERO_IDLE_FALLBACK_MS;
}

export function setPendingProjectHash(hash: string) {
  const id = hash.replace(/^#/, "");
  pendingHash = id || null;
  retryCleanup?.();
  retryCleanup = null;
}

export function hasPendingProjectHash() {
  return Boolean(pendingHash);
}

/** Call once on app load when URL contains a project hash */
export function prepareProjectHashOnLoad() {
  const hash = window.location.hash;
  if (!hash) return;

  if (parseProjectHash(hash)) {
    splashDurationMs = SPLASH_MS_DEEP_LINK;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  setPendingProjectHash(hash);
}

export function requestProjectVideo(slug: string) {
  window.dispatchEvent(
    new CustomEvent<{ slug: string }>(PROJECT_SHOW_VIDEO_EVENT, {
      detail: { slug },
    })
  );
}

/** Fired when hoodie walk → wave → idle sequence finishes (or reduced-motion skip). */
export function notifyHeroModelIdle() {
  if (heroIdle) return;
  heroIdle = true;
  window.dispatchEvent(new CustomEvent(HERO_MODEL_IDLE_EVENT));
  tryFlushPendingProjectHash();
}

function scrollToId(id: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) return false;

  const top =
    el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

function navigateToProjectHash(
  hash: string,
  options?: { behavior?: ScrollBehavior; maxAttempts?: number }
): () => void {
  const parsed = parseProjectHash(hash);
  if (!parsed) return () => {};

  const behavior = options?.behavior ?? "smooth";
  const maxAttempts = options?.maxAttempts ?? 80;
  let attempts = 0;
  let raf = 0;
  let aborted = false;

  if (parsed.video) {
    requestProjectVideo(parsed.slug);
  }

  const scrollTarget = parsed.video
    ? projectVideoHash(parsed.slug)
    : parsed.slug;

  const tryScroll = () => {
    if (aborted) return;

    const scrolled =
      scrollToId(scrollTarget, behavior) || scrollToId(parsed.slug, behavior);

    if (scrolled) {
      pendingHash = null;
      return;
    }

    if (attempts++ < maxAttempts) {
      raf = requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();

  return () => {
    aborted = true;
    if (raf) cancelAnimationFrame(raf);
  };
}

/** After splash + page fade — layout visible; scroll waits for hero idle if hash pending. */
export function markPageSettled() {
  pageSettled = true;
  tryFlushPendingProjectHash();
}

function flushPendingProjectHash() {
  if (!pageSettled || !heroIdle || !pendingHash) return;

  activeAbort?.();
  activeAbort = navigateToProjectHash(`#${pendingHash}`, {
    behavior: "smooth",
    maxAttempts: 100,
  });
}

function scheduleProjectHashRetries() {
  retryCleanup?.();
  const delays = [0, 200, 500, 1000, 1800, 2800];
  const timers = delays.map((ms) =>
    window.setTimeout(() => flushPendingProjectHash(), ms)
  );
  retryCleanup = () => timers.forEach((t) => window.clearTimeout(t));
}

export function tryFlushPendingProjectHash() {
  if (!pendingHash) return;
  flushPendingProjectHash();
  if (pageSettled && heroIdle && pendingHash) {
    scheduleProjectHashRetries();
  }
}
