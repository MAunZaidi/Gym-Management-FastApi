"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const hero = ref.current?.querySelector<HTMLElement>(".public-hero");
        const heroMedia = hero?.querySelector<HTMLElement>("[data-hero-media]");
        const heroSteps = hero?.querySelectorAll<HTMLElement>("[data-hero-step]");
        if (heroSteps?.length) {
          gsap.fromTo(heroSteps, { opacity: .92, y: 18 }, {
            opacity: 1,
            y: 0,
            duration: .55,
            stagger: .08,
            ease: "power3.out",
            clearProps: "transform,opacity"
          });
        }
        if (hero && heroMedia) {
          gsap.fromTo(heroMedia, { yPercent: -4, scale: 1.03 }, {
            yPercent: 8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 }
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((target) => {
          gsap.fromTo(target, { opacity: .92, y: 20 }, {
            opacity: 1,
            y: 0,
            duration: .7,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: target, start: "top 90%", once: true }
          });
        });
      }, ref);
      return () => context.revert();
    });
    return () => media.revert();
  }, [pathname]);

  return <div ref={ref} key={pathname} className="public-content">{children}</div>;
}
