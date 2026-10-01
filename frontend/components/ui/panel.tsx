import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HolographicSurface } from "@/components/ui/holographic-surface";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section data-reveal className={cn("adapt-panel rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel", className)}>
      <HolographicSurface />
      {children}
    </section>
  );
}
