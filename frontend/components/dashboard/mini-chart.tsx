"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { HolographicSurface } from "@/components/ui/holographic-surface";

export function MiniChart({
  title,
  values,
  labels,
  className,
  tone = "indigo"
}: {
  title: string;
  values: number[];
  labels: string[];
  className?: string;
  tone?: "indigo" | "teal";
}) {
  const max = Math.max(1, ...values);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo("[data-chart-bar]", { scaleY: 0 }, {
          scaleY: 1, duration: 0.7, stagger: 0.05, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 95%", once: true }
        });
      }, ref);
      return () => context.revert();
    });
    return () => media.revert();
  }, [values]);

  return (
    <div ref={ref} data-reveal className={cn("adapt-panel rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel", className)}>
      <HolographicSurface />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-medium text-adapt-text">{title}</h3>
        <span className="font-mono text-[10px] text-adapt-subtle">LAST 6 MONTHS</span>
      </div>
      <div className="adapt-chart-grid mt-6 flex h-48 items-end gap-3 border-b border-adapt-muted" role="img" aria-label={`${title}: ${values.map((value, index) => `${labels[index]} ${value.toLocaleString()}`).join(", ")}`}>
        {values.map((value, index) => (
          <div key={labels[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end px-1 sm:px-2">
              <div
                data-chart-bar
                title={`${labels[index]}: ${value.toLocaleString()}`}
                className={cn("w-full origin-bottom rounded-t-[6px] border border-white/10 transition-[filter] hover:brightness-125", tone === "indigo" ? "bg-adapt-accent" : "bg-teal-400/70")}
                style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-adapt-subtle">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
