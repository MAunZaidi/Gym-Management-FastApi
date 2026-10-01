"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGsapReveal<T extends HTMLElement>(transitionKey?: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: "power2.out", clearProps: "opacity" });
        const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
        targets.forEach((target, index) => {
          gsap.fromTo(target, { opacity: 0, y: 14 }, {
            opacity: 1, y: 0, duration: 0.45,
            delay: Math.min(index % 4, 3) * 0.045,
            ease: "power2.out", clearProps: "opacity,transform",
            scrollTrigger: { trigger: target, start: "top 98%", once: true }
          });
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [transitionKey]);

  return ref;
}
