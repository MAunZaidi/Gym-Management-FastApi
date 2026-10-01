import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-adapt border border-adapt-muted bg-adapt-surface p-5 shadow-panel", className)}>
      {children}
    </section>
  );
}
