import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HolographicSurface } from "@/components/ui/holographic-surface";

export function StatCard({
  title,
  value,
  detail,
  icon,
  tone = "primary"
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}) {
  const toneClasses = {
    primary: "bg-adapt-primary/15 text-indigo-300",
    success: "bg-teal-300/15 text-teal-200",
    warning: "bg-amber-300/15 text-amber-200",
    danger: "bg-rose-300/15 text-rose-200",
    info: "bg-sky-300/15 text-sky-200"
  };

  return (
    <article data-reveal className="adapt-panel adapt-stat rounded-adapt border border-adapt-muted bg-adapt-surface p-6 shadow-panel">
      <HolographicSurface tilt />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-medium uppercase text-adapt-subtle">{title}</p>
          <p className="mt-4 text-3xl font-medium tabular-nums text-adapt-text">{value}</p>
        </div>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-adapt", toneClasses[tone])}>{icon}</span>
      </div>
      <p className="mt-4 text-sm text-adapt-subtle">{detail}</p>
    </article>
  );
}
