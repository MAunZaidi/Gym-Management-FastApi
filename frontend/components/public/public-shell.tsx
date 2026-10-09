"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const cardSelector = [
  '[data-scroll="card"]',
  ".public-service-grid > *",
  ".public-plan-grid > *",
  ".public-class-grid > *",
  ".public-trainer-grid > *",
  ".public-principles__grid > *",
].join(", ");

const textSelector = '[data-scroll="text"], [data-reveal]';
const textPartSelector = [
  ":scope > .public-eyebrow",
  ":scope > h1",
  ":scope > h2",
  ":scope > h3",
  ":scope > p",
  ":scope > a",
  ":scope > div",
].join(", ");

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
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

        const cardCandidates = gsap.utils.toArray<HTMLElement>(cardSelector, root);
        const cards = cardCandidates.filter((card) =>
          !cardCandidates.some((candidate) => candidate !== card && candidate.contains(card))
        );
        const cardSet = new Set(cards);

        gsap.set(cards, { autoAlpha: 0, y: 52, scale: .975 });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          interval: .12,
          batchMax: 4,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: .72,
              stagger: .1,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
              overwrite: true,
            });
          },
        });

        gsap.utils.toArray<HTMLElement>(textSelector, root)
          .filter((target) => !cardSet.has(target) && !target.closest('[data-scroll="card"]'))
          .forEach((target) => {
            const parts = gsap.utils.toArray<HTMLElement>(textPartSelector, target);
            const revealTargets = parts.length ? parts : [target];

            gsap.fromTo(revealTargets, { autoAlpha: 0, y: 28 }, {
              autoAlpha: 1,
              y: 0,
              duration: .72,
              stagger: .09,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: { trigger: target, start: "top 88%", once: true }
            });
          });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [pathname]);

  return <div ref={ref} key={pathname} className="public-content">{children}</div>;
}
