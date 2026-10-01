import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
    primary: "bg-adapt-primary/15 text-adapt-primary",
    success: "bg-teal-300/15 text-teal-200",
    warning: "bg-amber-300/15 text-amber-200",
    danger: "bg-rose-300/15 text-rose-200",
    info: "bg-sky-300/15 text-sky-200"
  };

  return (
    <article className="rounded-adapt border border-adapt-muted bg-adapt-surface p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-adapt-subtle">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-adapt-text">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 place-items-center rounded-adapt", toneClasses[tone])}>{icon}</span>
      </div>
      <p className="mt-4 text-sm text-adapt-subtle">{detail}</p>
    </article>
  );
}
