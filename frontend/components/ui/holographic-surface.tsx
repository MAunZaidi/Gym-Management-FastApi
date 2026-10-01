"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

let grainTexture: string | undefined;

function getGrainTexture() {
  if (grainTexture) return grainTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) return "none";
  const pixels = context.createImageData(96, 96);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const shade = Math.floor(Math.random() * 256);
    pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = shade;
    pixels.data[index + 3] = 70;
  }
  context.putImageData(pixels, 0, 0);
  grainTexture = `url("${canvas.toDataURL()}")`;
  return grainTexture;
}

export function HolographicSurface({ tilt = false, quiet = false }: { tilt?: boolean; quiet?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = ref.current;
    const card = surface?.parentElement;
    if (!surface || !card) return;
    surface.style.setProperty("--foil-noise", getGrainTexture());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const context = gsap.context(() => {
      const moveX = gsap.quickTo(surface, "--foil-x", { duration: 0.45, ease: "power2.out" });
      const moveY = gsap.quickTo(surface, "--foil-y", { duration: 0.45, ease: "power2.out" });
      const hover = gsap.quickTo(surface, "--foil-hover", { duration: 0.4, ease: "power2.out" });
      const rotateX = tilt ? gsap.quickTo(card, "--card-rx", { duration: 0.5, ease: "power2.out" }) : null;
      const rotateY = tilt ? gsap.quickTo(card, "--card-ry", { duration: 0.5, ease: "power2.out" }) : null;
      if (tilt) card.dataset.cardTilt = "true";

      function move(event: PointerEvent) {
        if (motion.matches || event.pointerType === "touch") return;
        const bounds = card!.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        moveX(x * 100);
        moveY(y * 100);
        hover(1);
        rotateX?.((0.5 - y) * 6);
        rotateY?.((x - 0.5) * 6);
      }

      function leave() {
        moveX(50);
        moveY(50);
        hover(0);
        rotateX?.(0);
        rotateY?.(0);
      }

      function syncMotion() {
        surface!.style.setProperty("--foil-play-state", visible && !document.hidden && !motion.matches ? "running" : "paused");
        if (motion.matches) {
          moveX.tween.pause();
          moveY.tween.pause();
          hover.tween.pause();
          rotateX?.tween.pause();
          rotateY?.tween.pause();
          gsap.set(surface, { "--foil-x": 50, "--foil-y": 50, "--foil-hover": 0 });
          if (tilt) gsap.set(card!, { "--card-rx": 0, "--card-ry": 0 });
        }
      }

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncMotion();
      });
      observer.observe(card!);
      card!.addEventListener("pointermove", move);
      card!.addEventListener("pointerleave", leave);
      motion.addEventListener("change", syncMotion);
      document.addEventListener("visibilitychange", syncMotion);

      // React effect cleanup owns listeners; GSAP context owns its tweens.
      return () => {
        observer.disconnect();
        card!.removeEventListener("pointermove", move);
        card!.removeEventListener("pointerleave", leave);
        motion.removeEventListener("change", syncMotion);
        document.removeEventListener("visibilitychange", syncMotion);
        if (tilt) delete card!.dataset.cardTilt;
      };
    });

    return () => context.revert();
  }, [tilt]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("holographic-surface", quiet && "holographic-surface--quiet")}>
      <div className="holographic-foil" />
      <div className="holographic-sheen" />
      <div className="holographic-shade" />
      <div className="holographic-grain" />
    </div>
  );
}
