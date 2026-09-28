import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the target element enters the viewport.
 * Returns a ref to attach and a boolean `revealed` state.
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion if matchMedia is available
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setRevealed(true);
        return;
      }
    } else {
      // In test/unsupported environments, reveal immediately
      setRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px 0px 50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
