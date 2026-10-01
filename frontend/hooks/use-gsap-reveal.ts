"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapReveal<T extends HTMLElement>(options?: gsap.TweenVars) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tween = gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out", ...options }
    );

    return () => {
      tween.kill();
    };
  }, [options]);

  return ref;
}
