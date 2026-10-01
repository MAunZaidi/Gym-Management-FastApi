"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };
type BeamIntensity = keyof typeof opacityMap;
type Beam = {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
};

function createBeam(width: number, height: number): Beam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03
  };
}

function resetBeam(beam: Beam, index: number, total: number, width: number, height: number) {
  const spacing = width / 3;
  beam.y = height + 100;
  beam.x = (index % 3) * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
  beam.width = 100 + Math.random() * 100;
  beam.speed = 0.5 + Math.random() * 0.4;
  beam.hue = 190 + (index * 70) / total;
  beam.opacity = 0.2 + Math.random() * 0.1;
}

function drawBeam(context: CanvasRenderingContext2D, beam: Beam, intensity: BeamIntensity) {
  context.save();
  context.translate(beam.x, beam.y);
  context.rotate((beam.angle * Math.PI) / 180);
  const opacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];
  const gradient = context.createLinearGradient(0, 0, 0, beam.length);
  for (const [stop, strength] of [[0, 0], [0.1, 0.5], [0.4, 1], [0.6, 1], [0.9, 0.5], [1, 0]]) {
    gradient.addColorStop(stop, `hsla(${beam.hue},85%,65%,${opacity * strength})`);
  }
  context.fillStyle = gradient;
  context.fillRect(-beam.width / 2, 0, beam.width, beam.length);
  context.restore();
}

export function BeamsBackground({ className, intensity = "strong" }: { className?: string; intensity?: BeamIntensity }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let beams: Beam[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let visible = false;

    function draw(delta = 0) {
      if (!context || !width || !height) return;
      context.clearRect(0, 0, width, height);
      for (const [index, beam] of beams.entries()) {
        beam.y -= beam.speed * delta;
        beam.pulse += beam.pulseSpeed * delta;
        if (beam.y + beam.length < -100) resetBeam(beam, index, beams.length, width, height);
        drawBeam(context, beam, intensity);
      }
    }

    function animate(timestamp: number) {
      if (motion.matches || document.hidden || !visible || !width || !height) {
        frame = 0;
        return;
      }
      const elapsed = timestamp - lastFrame;
      if (elapsed >= 1000 / 30) {
        draw(Math.min(elapsed, 50) / (1000 / 60));
        lastFrame = timestamp;
      }
      frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
      if (!motion.matches && !document.hidden && visible && width && height) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(animate);
      }
    }

    function resize() {
      if (!host || !canvas || !context) return;
      const bounds = host.getBoundingClientRect();
      const previousWidth = width;
      const previousHeight = height;
      width = Math.floor(bounds.width);
      height = Math.floor(bounds.height);
      // Blurred artwork can use a smaller backing buffer without losing detail.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * 0.65;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const density = Math.min(1.5, Math.max(1, (width * height) / (1280 * 800)));
      const count = Math.floor(20 * density * 1.5);
      beams = Array.from({ length: count }, (_, index) => {
        const beam = beams[index];
        if (!beam || !previousWidth || !previousHeight) return createBeam(width, height);
        beam.x *= width / previousWidth;
        beam.y *= height / previousHeight;
        beam.length = height * 2.5;
        return beam;
      });
      syncAnimation();
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
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [intensity]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none fixed inset-y-0 right-0 -z-10 overflow-hidden bg-neutral-950", className)}>
      <canvas ref={canvasRef} data-beams-canvas className="absolute inset-0 h-full w-full blur-[35px]" />
      <div className="absolute inset-0 bg-neutral-950/5 backdrop-blur-3xl motion-safe:animate-pulse [animation-duration:8s]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
      <div className="absolute -inset-[25%] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(80,120,255,0.10),transparent)]" />
    </div>
  );
}
