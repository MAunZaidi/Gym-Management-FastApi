"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const frameInterval = 1000 / 30;

export function WavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let scrollProgress = 0;
    let targetProgress = 0;
    let scrollImpulse = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const xGap = width < 640 ? 31 : 27;
      const yGap = width < 640 ? 34 : 29;
      const phase = time * 0.00018 + scrollProgress * 9;
      const energy = Math.abs(scrollImpulse);

      context.lineWidth = 1;
      for (let column = -1; column <= Math.ceil(width / xGap) + 1; column += 1) {
        const baseX = column * xGap;
        context.beginPath();

        for (let y = -yGap; y <= height + yGap; y += yGap) {
          const wave =
            Math.sin(baseX * 0.008 + y * 0.009 + phase) * 9 +
            Math.sin(baseX * 0.018 - y * 0.005 + phase * 1.4) * 4;
          const scrollSway = Math.sin(y * 0.012 + column * 0.22 + phase) * scrollImpulse * 15;
          const distance = Math.hypot(baseX - pointerX, y - pointerY);
          const pointerPush = distance < 180 ? ((baseX - pointerX) / (distance + 1)) * (1 - distance / 180) * 15 : 0;
          const x = baseX + wave * (1 + energy * 0.35) + scrollSway + pointerPush;
          const waveY = y + Math.sin(baseX * 0.006 + phase + y * 0.013) * 4;

          if (y === -yGap) context.moveTo(x, waveY);
          else context.lineTo(x, waveY);
        }

        context.strokeStyle = column % 13 === 0 ? "rgba(229, 28, 36, 0.16)" : "rgba(0, 229, 255, 0.2)";
        context.stroke();
      }
    };

    const render = (time: number) => {
      frame = window.requestAnimationFrame(render);
      if (time - lastFrame < frameInterval) return;
      lastFrame = time;
      scrollProgress += (targetProgress - scrollProgress) * 0.12;
      scrollImpulse *= 0.88;
      draw(time);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      stop();
      if (reducedMotion.matches) {
        draw(0);
      } else if (!document.hidden) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (reducedMotion.matches) draw(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        targetProgress = self.progress;
        scrollImpulse = gsap.utils.clamp(-1, 1, self.getVelocity() / 1700);
      },
    });

    targetProgress = scrollTrigger.progress;
    scrollProgress = targetProgress;
    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", start);
    ScrollTrigger.refresh();

    return () => {
      stop();
      scrollTrigger.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", start);
    };
  }, [pathname]);

  return <canvas ref={canvasRef} className="public-waves" aria-hidden="true" />;
}
