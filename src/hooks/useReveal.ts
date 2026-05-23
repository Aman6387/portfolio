import { useEffect, useRef } from "react";

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => el.classList.add("visible");

    if (isInViewport(el)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      // threshold 0: tall sections (e.g. multiple showcase projects) still reveal
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);

    const fallback = window.setTimeout(() => {
      if (!el.classList.contains("visible") && isInViewport(el)) reveal();
    }, 500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return ref;
}
