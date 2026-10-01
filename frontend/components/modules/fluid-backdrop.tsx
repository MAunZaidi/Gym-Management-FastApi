"use client";

import { useEffect, useRef } from "react";

export function FluidBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let lastFrame = 0;
    let elapsed = 0;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function draw(time: number) {
      if (!context || !width || !height) return;
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      // Layered streamlines form a continuous ribbon without a GPU dependency.
      for (let line = 0; line < 64; line++) {
        const spread = (line / 63 - 0.5) * Math.min(height * 0.24, 190);
        context.beginPath();
        context.strokeStyle = line < 40
          ? `rgba(99, 102, 241, ${0.15 + line / 150})`
          : `rgba(45, 212, 191, ${0.14 + (line - 40) / 140})`;
        context.lineWidth = line % 8 === 0 ? 1.5 : 0.75;

        for (let point = 0; point <= 90; point++) {
          const progress = point / 90;
          const x = progress * (width + 120) - 60;
          const envelope = Math.sin(progress * Math.PI);
          const phase = progress * Math.PI * 3.1 + time * 0.2;
          const wave = Math.sin(phase + line * 0.019) * height * 0.115;
          const fold = Math.cos(progress * Math.PI * 4.2 - time * 0.15) * spread * 0.65;
          const y = height * 0.61 + wave * envelope + spread + fold
            + pointer.y * envelope * 25 + pointer.x * Math.sin(phase) * 12;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    }

    function tick(timestamp: number) {
      if (!visible || document.hidden || motion.matches || !width || !height) {
        frame = 0;
        return;
      }
      if (timestamp - lastFrame >= 1000 / 30) {
        elapsed += Math.min((timestamp - lastFrame) / 1000, 0.05);
        lastFrame = timestamp;
        draw(elapsed);
      }
      frame = requestAnimationFrame(tick);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      draw(elapsed);
      if (visible && !document.hidden && !motion.matches && width && height) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      if (!host || !canvas || !context) return;
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      syncAnimation();
    }

    function move(event: PointerEvent) {
      if (!host || !width || !height) return;
      const bounds = host.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / height - 0.5) * 2;
    }

    function leave() {
      pointer.targetX = 0;
      pointer.targetY = 0;
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    motion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} data-fluid-backdrop aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
